// ==UserScript==
// @name         WPS 表单 / 金山表单 自动填写助手
// @name:en      WPS (Kdocs) Form AutoFill Assistant
// @namespace    https://github.com/chaoAI00/interview/wps-form-autofill
// @version      1.0.0
// @description  在 WPS 表单（金山表单 / kdocs ksform）页面自动填写已配置的答案：支持文本框、多行文本、单选、多选、下拉选择、分页表单；写入前后做兼容性自检与逐字段回读校验。
// @description:en  Auto-fill configured answers on WPS/Kdocs forms (text, textarea, radio, checkbox, dropdown, paginated) with per-field verification and a built-in compatibility self-check.
// @author       chaoAI00
// @homepageURL  https://github.com/chaoAI00/interview
// @supportURL   https://github.com/chaoAI00/interview/issues
// @match        *://*.kdocs.cn/*
// @match        *://kdocs.cn/*
// @match        *://*.kdocs.com/*
// @match        *://*.wps.cn/*
// @match        *://*.wps.com/*
// @match        *://localhost/*
// @match        *://127.0.0.1/*
// @match        file:///*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        unsafeWindow
// ==/UserScript==

/* 设计要点（详见 README.md）
 * 1) 不依赖 WPS 表单的具体 class 名：优先语义化选择器（input/textarea/select/[role=radio]/
 *    [role=combobox]/[contenteditable]）发现题目，class 前缀（k- / ks- / ant-）只作辅助线索，
 *    站点改版（class 哈希变化）不会直接导致脚本失效；真找不到时还有"按控件反推"的兜底路径。
 * 2) WPS 表单是 React 受控组件：直接 `input.value = x` 不会触发 onChange（React 的 _valueTracker
 *    认为值没变）。本脚本用「原型链原生 setter + tracker 修正 + 冒泡 input/change 事件」写入，
 *    并逐字段回读校验，失败会自动换策略重试。
 * 3) 下拉/日期等浮层渲染在 body 上的 portal 里，不在题目容器内部：先点触发器，再在全文档范围
 *    找"点击后新出现的浮层"，最后点匹配的选项。
 * 4) 不做静默提交：autoSubmit 默认关闭；只有显式打开后，才会在全部必填项校验通过后延迟点击提交。
 */

(function () {
  'use strict';

  /* ==========================================================================
   * 0. 环境适配层（Tampermonkey / 普通页面 / 测试宿主 都能跑）
   * ========================================================================== */

  const TAG = '[WPS-AutoFill]';
  const IS_TM = (() => { try { return typeof GM_getValue === 'function'; } catch (e) { return false; } })();
  const PAGE = (() => {
    try { return (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window; }
    catch (e) { return window; }
  })();

  const store = {
    get(key, dflt) {
      try {
        if (IS_TM) { const v = GM_getValue(key, undefined); return v === undefined ? dflt : v; }
        const raw = localStorage.getItem(key);
        return raw === null ? dflt : JSON.parse(raw);
      } catch (e) { return dflt; }
    },
    set(key, value) {
      try {
        if (IS_TM) GM_setValue(key, value);
        else localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) { warn('存储写入失败', e); return false; }
    },
    del(key) {
      try {
        if (IS_TM) { if (typeof GM_deleteValue === 'function') GM_deleteValue(key); }
        else localStorage.removeItem(key);
      } catch (e) { /* ignore */ }
    },
  };

  const KEYS = {
    settings: 'wpsfa.v1.settings',
    profile: 'wpsfa.v1.profile',
    form: (id) => 'wpsfa.v1.form.' + id,
  };

  let DEBUG = false;
  const log = (...a) => { if (DEBUG) console.log(TAG, ...a); };
  const warn = (...a) => { try { console.warn(TAG, ...a); } catch (e) { /* ignore */ } };

  /* ==========================================================================
   * 1. 配置与字段字典
   * ========================================================================== */

  const VERSION = '1.0.0';

  const DEFAULT_SETTINGS = {
    enabled: true,        // 总开关
    autoFill: true,       // 题目出现后自动填充
    autoPaginate: true,   // 必填项填完后自动点"下一页"（严格白名单，绝不点提交）
    autoSubmit: false,    // ⚠️ 默认关闭：全部必填校验通过后自动提交
    submitDelayMs: 1500,  // 自动提交前等待（留最后反悔时间）
    overwrite: false,     // 覆盖已有内容（默认只填空字段，不动你手改过的答案）
    humanize: true,       // 字段之间加入随机小延迟
    showPanel: true,      // 显示悬浮面板
    debug: false,         // 控制台详细日志
    notify: false,        // 用系统通知提示结果（部分环境不支持，会静默忽略）
  };

  // 常用字段别名：左边是内部 key，右边是可能出现的题目标题（归一化后模糊匹配）
  const ALIASES = {
    name:      ['姓名', '名字', '学生姓名', '考生姓名', '本人姓名', '真实姓名'],
    studentId: ['学号', '学籍号', '学生学号', '学号工号', '工号', '学籍编号'],
    className: ['班级', '行政班', '所在班级', '班级名称', '班别', '教学班'],
    major:     ['专业', '所学专业', '专业名称', '专业方向'],
    college:   ['学院', '所在学院', '学院系', '院系', '系别', '所在院系', '学院名称', '学部'],
    grade:     ['年级', '入学年份', '入学时间'],
    phone:     ['手机', '手机号', '手机号码', '电话', '联系电话', '联系方式', '电话号码'],
    email:     ['邮箱', '电子邮箱', '邮件地址', 'email'],
    gender:    ['性别'],
    dorm:      ['宿舍', '宿舍号', '寝室', '宿舍楼'],
    advisor:   ['指导教师', '指导老师', '导师', '指导老师姓名', '指导教师姓名'],
    topic1:    ['选题', '题目', '选题1', '第一志愿', '题目名称', '毕业设计题目', '论文题目', '课题名称', '课题', '毕业设计选题'],
    topic2:    ['选题2', '第二志愿', '备选题目', '志愿二'],
    topic3:    ['选题3', '第三志愿', '志愿三'],
    remark:    ['备注', '说明', '其他', '其他说明', '补充说明', '留言', '特殊情况'],
    agree:     ['是否服从调剂', '服从调剂', '是否同意调剂', '是否愿意调剂', '是否服从分配'],
  };

  const PROFILE_LABELS = {
    name: '姓名', studentId: '学号', className: '班级', major: '专业', college: '学院',
    grade: '年级', phone: '手机号', email: '邮箱', gender: '性别', dorm: '宿舍号',
    advisor: '指导教师', topic1: '选题/题目', topic2: '选题2（备选）', topic3: '选题3',
    remark: '备注', agree: '服从调剂',
  };

  const MULTI_SPLIT = /[,，、;；\n]+/;

  /* ==========================================================================
   * 2. 通用工具
   * ========================================================================== */

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rnd = (min, max) => min + Math.random() * (max - min);

  function hasLayout() {
    if (HAS_LAYOUT_CACHE === null) {
      try {
        const probe = document.createElement('div');
        probe.setAttribute('style', 'position:absolute;left:-9999px;top:0;width:10px;height:10px');
        (document.body || document.documentElement).appendChild(probe);
        HAS_LAYOUT_CACHE = probe.getBoundingClientRect().width > 0;
        probe.parentNode.removeChild(probe);
      } catch (e) { HAS_LAYOUT_CACHE = true; }
    }
    return HAS_LAYOUT_CACHE;
  }
  let HAS_LAYOUT_CACHE = null;

  /** 归一化文本：去空白/全角标点/装饰符号/序号/(必填)等噪音，用于标题与选项匹配 */
  function norm(s) {
    if (s == null) return '';
    return String(s)
      .replace(/\s+/g, '')
      .replace(/[\u200b-\u200f\ufeff]/g, '')
      .replace(/[*·•﹡]/g, '')
      .replace(/[（(]\s*(必填|选填|必选|可多选|多选|单选)\s*[)）]/g, '')
      .replace(/^[0-9０-９]+\s*[.、)）:：]\s*/, '')
      .replace(/[：:？?。，,．.、/／|"'"'“”‘’]/g, '')
      .toLowerCase();
  }

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    if (el.hidden) return false;
    if (el.getAttribute && el.getAttribute('aria-hidden') === 'true') return false;
    const win = el.ownerDocument.defaultView;
    const style = win && win.getComputedStyle ? win.getComputedStyle(el) : null;
    if (style && (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')) return false;

    if (hasLayout()) {
      // 有真实排版引擎：几何尺寸最准，且天然覆盖“父级 display:none”的情况
      if (typeof el.offsetWidth === 'number' && el.offsetWidth === 0 && el.offsetHeight === 0) return false;
    } else {
      // 无排版引擎（jsdom / 爬虫环境）：退化为祖先链样式检查
      let p = el.parentElement, depth = 0;
      while (p && p !== document.documentElement && depth++ < 40) {
        if (p.hidden) return false;
        const ps = win.getComputedStyle ? win.getComputedStyle(p) : null;
        if (ps && (ps.display === 'none' || ps.visibility === 'hidden')) return false;
        p = p.parentElement;
      }
    }
    return true;
  }

  async function waitFor(fn, { timeout = 2000, interval = 50 } = {}) {
    const t0 = Date.now();
    for (;;) {
      let v;
      try { v = fn(); } catch (e) { v = null; }
      if (v) return v;
      if (Date.now() - t0 > timeout) return null;
      await sleep(interval);
    }
  }

  function textOf(el, { deep = true } = {}) {
    if (!el) return '';
    let t;
    if (el.nodeType === 1) t = deep ? (el.innerText != null && el.innerText !== '' ? el.innerText : el.textContent) : el.textContent;
    else t = el.textContent;
    return (t || '').replace(/\u00a0/g, ' ').trim();
  }

  /** 真实用户点击模拟：pointer/mouse 系列 + click，兼容监听不同事件的组件库 */
  function simulateClick(el) {
    if (!el) return false;
    try { if (el.scrollIntoView) el.scrollIntoView({ block: 'center' }); } catch (e) { /* ignore */ }
    const win = el.ownerDocument.defaultView;
    for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
      let ev;
      try {
        const opts = { bubbles: true, cancelable: true, composed: true, view: win };
        if (type.startsWith('pointer') && typeof win.PointerEvent === 'function') ev = new win.PointerEvent(type, opts);
        else ev = new win.MouseEvent(type.replace('pointer', 'mouse'), opts);
      } catch (e) { continue; }
      try { el.dispatchEvent(ev); } catch (e) { /* ignore */ }
    }
    return true;
  }

  function clickReal(el) {
    if (!el) return false;
    try { if (typeof el.click === 'function') { el.click(); return true; } } catch (e) { /* ignore */ }
    return simulateClick(el);
  }

  function fireKey(el, key) {
    const win = el.ownerDocument.defaultView;
    const opts = { key, code: key, bubbles: true, cancelable: true, composed: true, view: win };
    try {
      el.dispatchEvent(new win.KeyboardEvent('keydown', opts));
      el.dispatchEvent(new win.KeyboardEvent('keyup', opts));
    } catch (e) { /* ignore */ }
  }

  function closePopups() {
    try {
      const target = document.activeElement || document.body;
      fireKey(target, 'Escape');
      const doc = document;
      for (const type of ['mousedown', 'mouseup', 'click']) {
        doc.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
      }
    } catch (e) { /* ignore */ }
  }

  /* ==========================================================================
   * 3. React 受控输入写入（脚本核心）
   * ========================================================================== */

  /** 取"未被 patch 过"的原生 value setter —— 必须在原型上取，才能绕过 React 在节点上打的补丁 */
  function nativeValueSetter(el, win = PAGE) {
    const isTextarea = el.tagName === 'TEXTAREA';
    const isSelect = el.tagName === 'SELECT';
    const ctorName = isTextarea ? 'HTMLTextAreaElement' : isSelect ? 'HTMLSelectElement' : 'HTMLInputElement';
    const ctors = [win && win[ctorName], window[ctorName]].filter(Boolean);
    for (const C of ctors) {
      const desc = C && C.prototype ? Object.getOwnPropertyDescriptor(C.prototype, 'value') : null;
      if (desc && typeof desc.set === 'function') return desc.set;
    }
    return null;
  }

  /** React 的 _valueTracker：跨上下文可能取不到，取不到也无妨（原型 setter 本身已绕过它） */
  function valueTracker(el) {
    try {
      const t = (PAGE && PAGE !== window ? el['_valueTracker'] : undefined) || el['_valueTracker'];
      return t && typeof t.getValue === 'function' ? t : null;
    } catch (e) { return null; }
  }

  function dispatchInput(el, data) {
    const win = el.ownerDocument.defaultView;
    let ev;
    try {
      ev = new win.InputEvent('input', { bubbles: true, cancelable: true, composed: true, inputType: 'insertText', data: data == null ? null : String(data) });
    } catch (e) {
      ev = new win.Event('input', { bubbles: true, cancelable: true });
    }
    el.dispatchEvent(ev);
    el.dispatchEvent(new win.Event('change', { bubbles: true, cancelable: true }));
  }

  function valueMatches(readback, expected) {
    if (readback === expected) return true;
    const a = String(readback == null ? '' : readback);
    const b = String(expected == null ? '' : expected);
    if (a.replace(/\s+/g, '') === b.replace(/\s+/g, '')) return true;
    if (/^-?\d+(\.\d+)?$/.test(b)) {           // number 输入框会被规范化：1e3 → 1000
      const n = Number(a);
      if (Number.isFinite(n) && Number(n) === Number(b)) return true;
    }
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(a) && /^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(b)) {
      if (a.replace(/\//g, '-') === b.replace(/\//g, '-')) return true;
    }
    return false;
  }

  function setViaProtoSetter(el, value) {
    const prev = el.value;
    const setter = nativeValueSetter(el);
    if (setter) setter.call(el, value);
    else el.value = value;
    const t = valueTracker(el);
    if (t) { try { if (t.getValue() === value) t.setValue(prev); } catch (e) { /* ignore */ } }
    dispatchInput(el, value);
  }

  function setDirectWithTracker(el, value) {
    const prev = el.value;
    el.value = value;
    const t = valueTracker(el);
    if (t) { try { t.setValue(prev); } catch (e) { /* ignore */ } }
    dispatchInput(el, value);
  }

  /** 逐字符模拟键盘输入：少数带 mask/自动补全的组件只认键盘序列 */
  function typeLikeHuman(el, value) {
    const win = el.ownerDocument.defaultView;
    try { el.focus(); } catch (e) { /* ignore */ }
    setViaProtoSetter(el, '');
    for (const ch of String(value)) {
      try { el.dispatchEvent(new win.KeyboardEvent('keydown', { key: ch, bubbles: true, composed: true })); } catch (e) { /* ignore */ }
      setViaProtoSetter(el, el.value + ch);
      try { el.dispatchEvent(new win.KeyboardEvent('keyup', { key: ch, bubbles: true, composed: true })); } catch (e) { /* ignore */ }
    }
    try { el.blur(); } catch (e) { /* ignore */ }
  }

  /**
   * 写入受控输入，返回 { ok, strategy, readback }。
   * 策略由"最干净"到"最像人"依次尝试，每次都回读校验。
   */
  function writeValue(el, value, { humanize = false } = {}) {
    const str = value == null ? '' : String(value);
    if (!el) return { ok: false, strategy: 'none', readback: null };
    const attempts = [
      ['proto-setter', () => setViaProtoSetter(el, str)],
      ['proto-setter+tracker', () => setDirectWithTracker(el, str)],
      ['type-simulation', () => typeLikeHuman(el, str)],
    ];
    for (const [name, run] of attempts) {
      try { run(); } catch (e) { log('写入策略异常:', name, e); continue; }
      if (valueMatches(el.value, str)) return { ok: true, strategy: name, readback: el.value };
    }
    return { ok: false, strategy: 'all-failed', readback: el.value };
  }

  /** contenteditable（富文本 / 填空）写入 */
  function writeContentEditable(el, value) {
    const text = String(value);
    const doc = el.ownerDocument;
    try { el.focus(); } catch (e) { /* ignore */ }
    let ok = false;
    try {
      const sel = doc.defaultView.getSelection();
      const range = doc.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges(); sel.addRange(range);
      if (typeof doc.execCommand === 'function') ok = doc.execCommand('insertText', false, text);
    } catch (e) { /* ignore */ }
    if (!ok || !textOf(el).includes(text)) {
      el.textContent = text;
      dispatchInput(el, text);
    }
    return valueMatches(textOf(el), text);
  }

  /* ==========================================================================
   * 4. 题目发现（语义优先，class 仅作辅助线索）
   * ========================================================================== */

  const CONTROL_SEL = [
    'input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]):not([type=image])',
    'textarea',
    'select',
    '[role=radio]', '[role=checkbox]', '[role=combobox]', '[role=switch]',
    '[contenteditable="true"]', '[contenteditable=""]',
    '[aria-haspopup="listbox"]', '[aria-haspopup="true"]',
  ].join(',');

  const ITEM_SEL = [
    '[data-question-id]', '[data-qid]', '[data-item-id]', '[data-field-id]',
    '.k-form-item', '.ks-form-item', '.kform-item', '.form-item', '.ant-form-item',
    '[class*=form-item]', '[class*=formItem]', '[class*=question-item]', '[class*=questionItem]',
    '[class*=field-item]', '[class*=fieldItem]', '[class*=question_wrap]', '[class*=field_wrap]',
    '[class*=quest-item]', '[class*=ques-item]',
  ].join(',');

  const LABELISH_SEL = [
    'label', 'legend', '[role=label]',
    '[class*=label]', '[class*=Label]', '[class*=title]', '[class*=Title]',
    '[class*=subject]', '[class*=Subject]', '[class*=name]', '[class*=Name]',
  ].join(',');

  const LABEL_HINT_SEL = ['.k-label', '[class*=form-label]', '[class*=label]', '[class*=title]', '[class*=titleText]', 'legend', 'label'].join(',');

  /** 页面是否为 WPS 表单（路由 + DOM 双判据；不满足则脚本保持静默，不干扰其他页面） */
  function isFormHost() {
    const host = location.hostname;
    const path = location.pathname + location.search + location.hash;
    // 本地自定义域名 / 内网域名 / 预览环境：可在页面里设置 window.__WPS_AUTOFILL_FORCE__ = true 强制启用（演示页用）
    let forced = false;
    try { forced = !!(PAGE.__WPS_AUTOFILL_FORCE__ || window.__WPS_AUTOFILL_FORCE__); } catch (e) { forced = false; }
    const hostOk = forced
      || /(kdocs|wps)\.(cn|com)$/.test(host)
      || host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:';
    const pathOk = /ksform|\/form\/|\/write\/|\/w\/|\/s\/|\/share|kdocs-form|form-ks/i.test(path);
    const domOk = !!document.querySelector('#root, [id*=root], #app') && !!document.querySelector(CONTROL_SEL);
    return { hostOk, pathOk, domOk, forced, ok: hostOk && (pathOk || domOk) };
  }

  function rootEl() {
    return document.getElementById('root') || document.querySelector('#app') || document.querySelector('[id*=root]') || document.body;
  }

  /** 是否处于"编辑/设计"模式（创建者视角），仅提示、不禁用 */
  function isEditMode() {
    const p = location.pathname + location.search;
    if (/[\/?&](edit|design|create|preview)/i.test(p)) return true;
    return !!document.querySelector('[class*=question-editor],[class*=designer],[class*=editor-toolbar]');
  }

  function countControls(el) { return el ? el.querySelectorAll(CONTROL_SEL).length : 0; }

  /** 从题目容器里提取题干文字 */
  function labelTextOf(item) {
    const parts = [];
    const push = (t) => { const v = (t || '').replace(/\s*[*﹡]\s*$/, '').trim(); if (v && v.length <= 200 && !/^(必填|选填|请输入|请选择|请填写|请输入内容)$/.test(v)) parts.push(v); };

    // 1) 明确的 label / title 元素（排除选项自身的 label 与按钮内部文字）
    for (const el of item.querySelectorAll(LABEL_HINT_SEL)) {
      if (el.querySelector('input, textarea, select')) continue;              // 这是选项 label
      if (el.closest('[role=radiogroup],[role=listbox],[role=option],[role=menu]')) continue;
      if (el.closest('button,[role=button]')) continue;
      push(textOf(el, { deep: false }));
      if (parts.length >= 3) break;
    }
    // 2) 退一步用任意"像标题"的节点
    if (!parts.length) {
      for (const el of item.querySelectorAll(LABELISH_SEL)) {
        if (el.querySelector('input, textarea, select')) continue;
        push(textOf(el, { deep: false }));
        if (parts.length >= 3) break;
      }
    }
    // 3) 兜底：容器内第一行文本
    if (!parts.length) {
      const line = textOf(item).split('\n').map((s) => s.trim()).filter(Boolean)[0];
      push(line);
    }
    if (!parts.length) return '';
    return parts.sort((a, b) => a.length - b.length)[0];
  }

  function isRequired(item) {
    if (item.querySelector('[required],[aria-required="true"]')) return true;
    const head = textOf(item).slice(0, 120);
    if (/\*/.test(head)) return true;
    if (/必填|必选|必答|请务必/.test(head)) return true;
    return !!item.querySelector('[class*=required],[class*=Required],.is-required');
  }

  function optionLabelOf(input) {
    const doc = input.ownerDocument;
    const id = input.getAttribute('id');
    if (id) {
      const lab = doc.querySelector('label[for="' + cssEscape(id) + '"]');
      if (lab && norm(textOf(lab))) return textOf(lab);
    }
    const wrap = input.closest('label');
    if (wrap && norm(textOf(wrap))) return textOf(wrap);
    const aria = input.getAttribute('aria-label');
    if (aria) return aria;
    // 常见：<div class="option"><input/><span>选项文字</span></div>
    let node = input.parentElement;
    for (let i = 0; i < 4 && node; i++) {
      if (node.getAttribute && (node.getAttribute('role') === 'radiogroup' || node.getAttribute('role') === 'listbox')) break;
      const t = textOf(node);
      if (t && t.length <= 120) return t;
      node = node.parentElement;
    }
    return input.getAttribute('value') || '';
  }

  function cssEscape(s) {
    try { return (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(s) : String(s).replace(/["\\]/g, '\\$&'); }
    catch (e) { return String(s).replace(/["\\]/g, '\\$&'); }
  }

  function typeOfItem(item) {
    if (item.querySelector('input[type=file]') || /上传|附件|文件|图片/.test(textOf(item).slice(0, 60)) && item.querySelector('[class*=upload],[class*=Upload]')) return 'file';
    if (item.querySelector('textarea')) return 'textarea';
    if (item.querySelector('input[type=radio]') || item.querySelector('[role=radio]')) return 'radio';
    if (item.querySelector('input[type=checkbox]') || item.querySelector('[role=checkbox]')) return 'checkbox';
    if (item.querySelector('select')) return 'select';
    const textInput = item.querySelector('input[type=text],input[type=tel],input[type=number],input[type=email],input:not([type])');
    const combo = item.querySelector('[role=combobox],[aria-haspopup=listbox],[aria-haspopup=true],[class*=k-select],[class*=ant-select],[class*=select-input]');
    if (combo && !textInput) return 'dropdown';
    if (textInput) {
      const t = (textInput.getAttribute('type') || 'text').toLowerCase();
      return t === 'date' || t === 'datetime-local' ? 'date' : t === 'time' ? 'time' : 'text';
    }
    if (item.querySelector('[contenteditable="true"],[contenteditable=""]')) return 'richtext';
    if (item.querySelector('[class*=date],[class*=Date],[class*=picker],[class*=Picker]')) return 'date';
    if (item.querySelector('[aria-haspopup],[class*=select],[class*=Select],[class*=dropdown]')) return 'dropdown';
    return 'unknown';
  }

  /** 单选/多选/原生 select 的候选项（无需打开浮层） */
  function optionsOf(item) {
    const out = [];
    const seen = new Set();
    const add = (text, el, kind, value) => {
      const t = (text || '').trim();
      if (t && !seen.has(t)) { seen.add(t); out.push({ text: t, el, kind, value }); }
    };
    for (const el of item.querySelectorAll('input[type=radio],input[type=checkbox]')) {
      add(optionLabelOf(el), el, 'input', el.value);
    }
    for (const el of item.querySelectorAll('[role=radio],[role=checkbox]')) {
      if (el.tagName === 'INPUT') continue;
      add(textOf(el), el, 'role', null);
    }
    for (const el of item.querySelectorAll('select option')) {
      add(textOf(el), el, 'option', el.value);
    }
    return out;
  }

  function pickControl(item) {
    const first = item.querySelector('input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, [contenteditable="true"]');
    if (first) return first;
    const combo = item.querySelector('[role=combobox],[aria-haspopup=listbox],[aria-haspopup=true],[class*=k-select],[class*=ant-select],[class*=select-trigger]');
    if (combo) return combo;
    return item.querySelector('select') || item.querySelector(CONTROL_SEL) || null;
  }

  function makeQuestion(item) {
    let label = labelTextOf(item);
    if (!label) {
      // 兜底：控件自身的无障碍标签，例如 <input aria-label="姓名">
      const c0 = pickControl(item);
      label = norm((c0 && (c0.getAttribute('aria-label') || c0.getAttribute('title') || c0.getAttribute('data-label'))) || '');
    }
    if (!norm(label)) return null;
    const type = typeOfItem(item);
    return {
      item,
      label,
      key: norm(label),
      type,
      required: isRequired(item),
      options: (type === 'radio' || type === 'checkbox' || type === 'select') ? optionsOf(item) : [],
      control: pickControl(item),
    };
  }

  /** 收集题目容器（可选包含被隐藏的分页，用于跨页定位） */
  function questionContainers({ includeHidden = false } = {}) {
    let items = [];
    try { items = Array.from(document.querySelectorAll(ITEM_SEL)); } catch (e) { items = []; }

    items = items.filter((el) => {
      if (!el.isConnected) return false;
      if (!includeHidden && !isVisible(el)) return false;
      if (el.closest('[data-wpsfa-ui]')) return false;          // 忽略脚本自己的面板
      if (countControls(el) === 0) return false;
      // 丢弃"只是包住其它题目"的外层容器
      return !items.some((other) => other !== el && el.contains(other) && countControls(other) > 0 && countControls(other) < countControls(el));
    });

    if (!items.length) items = deriveItemsFromControls({ includeHidden });
    return items;
  }

  /** 收集页面上所有题目 */
  function collectQuestions({ includeHidden = false } = {}) {
    const items = questionContainers({ includeHidden });

    const questions = [];
    const seen = new Set();
    for (const el of items) {
      const q = makeQuestion(el);
      if (!q) continue;
      const key = q.key + '|' + q.type;
      if (seen.has(key)) continue;
      seen.add(key);
      questions.push(q);
    }
    return questions;
  }

  /** 兜底：class 全变时，从控件出发向上找"带标题的容器" */
  function deriveItemsFromControls({ includeHidden = false } = {}) {
    const out = [];
    for (const c of document.querySelectorAll(CONTROL_SEL)) {
      if (!includeHidden && !isVisible(c)) continue;
      if (c.closest('[data-wpsfa-ui]')) continue;
      let start = c;
      if (c.matches('input[type=radio],input[type=checkbox]')) {
        start = c.closest('[role=radiogroup],[role=group],fieldset') ||
                (c.name ? firstRadioScope(c) : c.parentElement) || c.parentElement;
      }
      const item = climbToLabeled(start, c);
      if (item && out.indexOf(item) === -1) out.push(item);
    }
    return out.filter((el) => !out.some((o) => o !== el && o.contains(el)));
  }

  function firstRadioScope(c) {
    const same = c.ownerDocument.querySelectorAll('input[name="' + cssEscape(c.name) + '"]');
    return same.length ? same[0].parentElement : null;
  }

  /** 同一组控件的数量（单选/多选按 name 分组），用于判断"这个容器是不是只装了一道题" */
  function groupSize(c) {
    try {
      if (c && c.name) {
        const same = c.ownerDocument.querySelectorAll('input[name="' + cssEscape(c.name) + '"]');
        if (same.length) return same.length;
      }
      return 1;
    } catch (e) { return 1; }
  }

  function climbToLabeled(start, control) {
    const isChoice = !!(control && control.matches && control.matches('input[type=radio],input[type=checkbox]'));
    const expected = isChoice ? groupSize(control) : 1;
    let weak = null;          // 弱判据命中的"最近的候选容器"
    let node = start;
    for (let depth = 0; depth < 8 && node && node !== document.body && node !== document.documentElement; depth++) {
      // 关键：容器里的控件数不能超过本题应有的数量，否则说明爬到了包住多道题的公共父级
      if (countControls(node) <= expected) {
        const lines = textOf(node).split('\n').map((s) => s.trim()).filter(Boolean);
        const hasLabelEl = !!node.querySelector(LABEL_HINT_SEL);
        if (lines.length && lines[0].length <= 60) {
          const label = labelTextOf(node) || lines[0];
          if (label && !/^(请输入|请选择|请填写)[^，。]{0,12}$/.test(label)) {
            // 强判据：有显式的 label/title 节点，或容器里有多行文本（标题 + 选项/提示）
            if (hasLabelEl || lines.length >= 2 || isChoice) return node;
            // 弱判据：只有一个短文本行（例如 <div><div>姓名</div><input></div>），先记住最近的
            if (!weak && lines[0].length <= 40) weak = node;
          }
        }
      }
      node = node.parentElement;
    }
    return weak;
  }

  /* ==========================================================================
   * 5. 字段匹配：题目 → 配置项
   * ========================================================================== */

  const TOPIC_KEYS = ['topic1', 'topic2', 'topic3'];

  /** 单个题目标题对每个已知 key 打分（0 = 不匹配） */
  function scoreCandidates(q, available) {
    const k = q.key;
    if (!k) return [];
    const out = [];
    for (const key of Object.keys(ALIASES)) {
      if (!available[key]) continue;
      for (const alias of ALIASES[key]) {
        const na = norm(alias);
        if (!na) continue;
        let s = 0;
        if (k === na) s = 100;
        else if (k.startsWith(na) || k.endsWith(na)) s = 85;
        else if (na.length >= 2 && k.includes(na)) s = 72;
        else if (k.length >= 2 && na.includes(k)) s = 58;
        if (s > 0) {
          // 越接近的别名越可信（避免 "姓名" 命中 "指导教师姓名"）
          s -= Math.min(20, Math.abs(k.length - na.length));
          out.push({ key, alias, s: Math.max(s, 1) });
        }
      }
    }
    return out
      .filter((c) => contextAllows(q, c.key))
      .sort((a, b) => b.s - a.s || norm(b.alias).length - norm(a.alias).length);
  }

  /** 语境规则：根据题干里的关键词排除明显不对的字段 */
  function contextAllows(q, key) {
    const k = q.key;
    if (key === 'advisor') return true;
    if (/指导|导师/.test(k) && (TOPIC_KEYS.includes(key))) return false;   // "指导教师姓名" ≠ 选题
    if (key === 'agree' && !/调剂|服从|分配|同意/.test(k)) return false;    // 避免"是否愿意"之类误配
    if (key === 'college' && /班级|专业/.test(k) && !/学院|院系|学部/.test(k)) return false;
    if (key === 'major' && /学院|院系/.test(k) && !/专业/.test(k)) return false;
    if (key === 'className' && /专业|学院/.test(k) && !/班级|班别|行政班/.test(k)) return false;
    if (key === 'name' && /指导教师|导师|家长|老师/.test(k) && !/本人|学生/.test(k)) return false;
    return true;
  }

  /** 从题干里读出"第几个志愿/选题"：第一/第二/第三、选题2、第3志愿…… */
  function topicOrdinalOf(text) {
    const k = typeof text === 'string' ? text : (text && text.key) || '';
    if (!k) return 0;
    const map = { '一': 1, '二': 2, '三': 3, '1': 1, '2': 2, '3': 3, '１': 1, '２': 2, '３': 3 };
    let m = k.match(/第\s*([一二三123１２３])\s*(?:志愿|选题|题目|课题|方向|个)/);
    if (m && map[m[1]]) return map[m[1]];
    m = k.match(/(?:志愿|选题|题目|课题|方向)\s*([一二三123１２３])(?!\d)/);
    if (m && map[m[1]]) return map[m[1]];
    m = k.match(/([一二三123１２３])\s*(?:志愿|选题|题目|课题)/);
    if (m && map[m[1]]) return map[m[1]];
    return 0;
  }

  /** 整份表单（含被 display:none 藏起来的其它分页）里"选题族"题目的文档顺序 */
  function topicFamilyOrder() {
    const out = [];
    const avail = { topic1: true, topic2: true, topic3: true };
    let containers = [];
    try { containers = questionContainers({ includeHidden: true }); } catch (e) { return out; }
    for (const item of containers) {
      const label = labelTextOf(item);
      if (!label) continue;
      const key = norm(label);
      if (!key) continue;
      if (scoreCandidates({ key, label, item, type: typeOfItem(item), options: [] }, avail).length) out.push(item);
    }
    return out;
  }

  /**
   * 为页面上的每道题决定用哪个配置项；返回与 questions 等长的数组（无匹配为 null）。
   * 题目族（选题/志愿）按"题干序号 → 整份表单中的位置"定位，因此跨分页也正确；
   * 该位置没配答案就留空，绝不把第一志愿的内容填到第二志愿上去。
   */
  function planMatches(questions, profile) {
    const available = {};
    for (const key of Object.keys(profile)) {
      const v = profile[key];
      if (v === '' || v == null) continue;
      if (typeof v === 'object' && !Array.isArray(v) && !(v.value || v.option != null || v.index != null || v.custom)) continue;
      available[key] = true;
    }
    const plan = [];
    let topicOrder = null;
    const ensureTopicOrder = () => { if (!topicOrder) topicOrder = topicFamilyOrder(); return topicOrder; };

    for (const q of questions) {
      if (q.type === 'file' || q.type === 'location' || q.type === 'unknown') { plan.push(null); continue; }
      const cands = scoreCandidates(q, available);
      if (!cands.length) { plan.push(null); continue; }
      const top = cands[0].s;
      const tied = cands.filter((c) => c.s === top);
      const key = tied[0].key;

      const topicTied = tied.filter((c) => TOPIC_KEYS.includes(c.key));
      if (TOPIC_KEYS.includes(key) || (topicTied.length && topicTied.length === tied.length)) {
        // ① 题干自带序号（"第二志愿"）优先；② 否则按它在整份表单里的位置（跨分页也成立）
        let slot = topicOrdinalOf(q.key || q.label) - 1;
        if (slot < 0) {
          const idx = ensureTopicOrder().indexOf(q.item);
          slot = idx < 0 ? 0 : idx;
        }
        const target = TOPIC_KEYS[Math.min(Math.max(slot, 0), TOPIC_KEYS.length - 1)];
        if (target && available[target]) plan.push({ q, key: target });
        else plan.push(null);          // 该位置用户没配答案 → 留空
        continue;
      }
      plan.push({ q, key });
    }
    return plan;
  }

  /** 中文数字 → 阿拉伯数字（仅支持 1~99 的常见写法，够用即可） */
  function chineseNumber(str) {
    const digits = { '零': 0, '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
    let s = String(str).replace(/[０-９]/g, (d) => String(d.charCodeAt(0) - 0xfee0));
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    if (s === '十') return 10;
    let m = s.match(/^十([一二三四五六七八九])$/);
    if (m) return 10 + digits[m[1]];
    m = s.match(/^([一二三四五六七八九])十([一二三四五六七八九])?$/);
    if (m) return digits[m[1]] * 10 + (m[2] ? digits[m[2]] : 0);
    m = s.match(/^([一二三四五六七八九])$/);
    if (m) return digits[m[1]];
    return 0;
  }

  /** 配置项 → 选项规格：{optionText, index, custom} */
  function parseSelectSpec(raw) {
    if (raw == null) return null;
    if (typeof raw === 'number') return { index: Math.max(1, Math.round(raw)) };
    if (typeof raw === 'object') {
      if (raw.index != null) return { index: parseInt(raw.index, 10) || 1 };
      if (raw.option != null) return { optionText: String(raw.option) };
      if (raw.value != null) return parseSelectSpec(raw.value);
      if (raw.custom != null) return { custom: String(raw.custom) };
      return null;
    }
    let s = String(raw).trim();
    if (!s) return null;
    const custom = s.match(/^(?:custom|其他|自填)\s*[:：]\s*(.+)$/i);
    if (custom) return { custom: custom[1].trim() };
    const ordinal = s.match(/^第\s*([0-9０-９一二三四五六七八九十]+)\s*(?:项|个|条|选项)?$/);
    if (ordinal) { const n = chineseNumber(ordinal[1]); if (n) return { index: n }; }
    const sharp = s.match(/^#\s*(\d+)$/);
    if (sharp) return { index: parseInt(sharp[1], 10) };
    if (/^\d{1,3}$/.test(s)) return { index: parseInt(s, 10) };   // 纯 1~3 位数字视为"第 N 项"
    return { optionText: s };
  }

  function optionHaystack(o) { return norm(o.text); }

  /** 在候选项里找目标项；找不到时退回自定义项 */
  function matchOption(options, spec) {
    if (!spec) return { kind: 'none' };
    if (spec.optionText != null) {
      const target = norm(spec.optionText);
      let hit = options.find((o) => optionHaystack(o) === target);
      if (!hit) hit = options.find((o) => o.value != null && norm(o.value) === target);
      if (!hit && target) {
        // 只有"长度接近 + 互相包含"才允许近似匹配，
        // 否则 16 字的"其他"自定义内容会被硬凑到 4 字的普通选项上
        const sub = options
          .filter((o) => {
            const h = optionHaystack(o);
            if (!h) return false;
            const ratio = h.length / Math.max(1, target.length);
            if (ratio < 0.45 || ratio > 2.2) return false;
            return h.includes(target) || target.includes(h);
          })
          .sort((a, b) => Math.abs(optionHaystack(a).length - target.length) - Math.abs(optionHaystack(b).length - target.length));
        if (sub.length) hit = sub[0];
      }
      if (hit) return { kind: 'option', option: hit, fuzzy: optionHaystack(hit) !== target };
      if (spec.custom) return { kind: 'custom', text: spec.custom };
      return { kind: 'missing', wanted: spec.optionText };
    }
    if (spec.index != null) {
      let i = spec.index;
      // 1 基索引：用户填 1 表示第一项；若选项里带"序号"文字也直接按序号找
      const opt = options[i - 1];
      if (opt) return { kind: 'option', option: opt };
      return { kind: 'missing', wanted: '第 ' + i + ' 项（共 ' + options.length + ' 项）' };
    }
    if (spec.custom) return { kind: 'custom', text: spec.custom };
    return { kind: 'none' };
  }

  function optionSelected(opt) {
    if (!opt || !opt.el) return false;
    const el = opt.el;
    if (el.tagName === 'OPTION') return !!el.selected;
    if (el.tagName === 'INPUT') return !!el.checked;
    const aria = el.getAttribute('aria-checked') || el.getAttribute('aria-selected') || el.getAttribute('data-state');
    if (aria === 'true' || aria === 'checked' || aria === 'selected' || aria === 'on') return true;
    const cls = el.className && String(el.className);
    return !!(cls && /(^|[-_\s])(checked|selected|active|is-checked)([-_\s]|$)/i.test(cls));
  }

  function selectedTexts(item) {
    const out = [];
    for (const el of item.querySelectorAll('input[type=radio],input[type=checkbox]')) {
      if (el.checked) out.push(norm(optionLabelOf(el)));
    }
    for (const el of item.querySelectorAll('[role=radio],[role=checkbox]')) {
      if (el.tagName === 'INPUT') continue;
      if (optionSelected({ el })) out.push(norm(textOf(el)));
    }
    return out.filter(Boolean);
  }

  /* ==========================================================================
   * 6. 填充执行
   * ========================================================================== */

  function toDateValue(str) {
    const s = String(str).trim();
    let m = s.match(/^(\d{4})[-/.年]\s*(\d{1,2})[-/.月]\s*(\d{1,2})/);
    if (m) return m[1] + '-' + String(m[2]).padStart(2, '0') + '-' + String(m[3]).padStart(2, '0');
    m = s.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (m) return m[1] + '-' + m[2] + '-' + m[3];
    return s;
  }

  function isFilled(q) {
    switch (q.type) {
      case 'textarea':
      case 'text':
      case 'date':
      case 'time':
        return !!(q.control && String(q.control.value || '').trim() !== '');
      case 'richtext':
        return !!(q.control && textOf(q.control) !== '');
      case 'radio':
      case 'checkbox':
        return selectedTexts(q.item).length > 0;
      case 'select':
        return !!(q.control && q.control.value && q.control.selectedIndex > 0);
      case 'dropdown': {
        const t = norm(textOf(q.control || q.item));
        return !!t && !/^(请选择|请选择项|请选择一项|未选择|全部)/.test(t) && t !== q.key;
      }
      default:
        return false;
    }
  }

  async function fillText(q, value, { humanize } = {}) {
    const ctrl = q.control;
    if (!ctrl) return { ok: false, detail: '未找到输入控件' };
    if (ctrl.getAttribute('contenteditable') != null) {
      const ok = writeContentEditable(ctrl, value);
      return ok ? { ok: true, strategy: 'contenteditable' } : { ok: false, detail: '富文本写入失败' };
    }
    const isDate = (ctrl.getAttribute('type') || '').toLowerCase() === 'date';
    let v = String(value);
    if (isDate) v = toDateValue(v);
    const maxLen = parseInt(ctrl.getAttribute('maxlength') || '0', 10);
    if (maxLen > 0 && v.length > maxLen) v = v.slice(0, maxLen);
    if (ctrl.tagName === 'SELECT') {
      // 少数"下拉"其实是原生 select
      const spec = parseSelectSpec(value);
      const mo = matchOption(optionsOf(q.item), spec);
      return mo.kind === 'option' ? fillNativeSelect(q, mo.option) : { ok: false, detail: '下拉未匹配到选项：' + v };
    }
    const res = writeValue(ctrl, v, { humanize });
    if (!res.ok) return { ok: false, detail: '写入后回读不一致（读到：' + JSON.stringify(res.readback) + '）' };
    return { ok: true, strategy: res.strategy };
  }

  function fillNativeSelect(q, opt) {
    const sel = q.control || q.item.querySelector('select');
    if (!sel || !opt || !opt.el) return { ok: false, detail: '未找到 select' };
    const target = opt.el;
    let ok = false;
    for (const o of sel.options) { if (o === target || o.value === target.value) { o.selected = true; ok = true; } else { o.selected = false; } }
    if (ok) {
      const win = sel.ownerDocument.defaultView;
      sel.dispatchEvent(new win.Event('input', { bubbles: true, composed: true }));
      sel.dispatchEvent(new win.Event('change', { bubbles: true, composed: true }));
    }
    return ok ? { ok: true, strategy: 'native-select' } : { ok: false, detail: 'select 赋值失败' };
  }

  /** 单选 / 多选：直接点击选项标签（比设置 checked 更能触发组件内部逻辑） */
  async function fillChoice(q, values, { humanize } = {}) {
    const multi = q.type === 'checkbox';
    const wanted = multi ? values : values.slice(0, 1);
    const done = [];
    const failed = [];
    for (const raw of wanted) {
      const spec = parseSelectSpec(raw);
      if (!spec) continue;
      let mo = matchOption(q.options, spec);
      if (mo.kind === 'custom' || mo.kind === 'missing') {
        const byCustom = await tryCustomOption(q, mo.kind === 'custom' ? mo.text : spec.optionText);
        if (byCustom.ok) { done.push(byCustom.detail || '自定义项'); continue; }
        failed.push((mo.wanted ? '缺少选项「' + mo.wanted + '」' : '第 N 项超出范围') + (byCustom.detail ? '；' + byCustom.detail : ''));
        continue;
      }
      if (mo.kind !== 'option') { failed.push('无可用选项'); continue; }
      const opt = mo.option;
      maxtries: for (let attempt = 0; attempt < 2; attempt++) {
        if (!optionSelected(opt)) {
          const clickTarget = chooseClickTarget(opt);
          clickReal(clickTarget);
          const ok = await waitFor(() => optionSelected(opt) || selectedTexts(q.item).includes(optionHaystack(opt)), { timeout: 800, interval: 40 });
          if (!ok) continue;
        }
        done.push(opt.text.trim() + (mo.fuzzy ? '（近似匹配）' : ''));
        break maxtries;
      }
      if (!done.length || !(optionSelected(opt) || selectedTexts(q.item).includes(optionHaystack(opt)))) {
        failed.push('点击「' + opt.text.trim() + '」无效');
      }
      if (humanize && wanted.length > 1) await sleep(rnd(30, 90));
    }
    const sel = selectedTexts(q.item);
    const ok = done.length > 0 && failed.length === 0;
    return {
      ok,
      strategy: 'click-option',
      detail: [done.length ? '已选：' + done.join('、') : '未选中任何项', failed.length ? '失败：' + failed.join('；') : '', sel.length ? '回读：' + sel.join('、') : '']
        .filter(Boolean).join(' | '),
    };
  }

  function chooseClickTarget(opt) {
    const el = opt.el;
    if (el.tagName === 'INPUT') {
      const wrap = el.closest('label') || el.parentElement;
      // 优先点整行 label（很多实现只监听外层），否则点 input 本身
      return wrap && textOf(wrap) ? wrap : el;
    }
    return el;
  }

  /** "其他/自定义" 选项：点击后填写弹出的输入框 */
  async function tryCustomOption(q, text) {
    if (!text) return { ok: false, detail: '无自定义文本' };
    const trig = findCustomOptionTrigger(q);
    if (!trig) return { ok: false, detail: '该题没有“其他/自定义”选项' };
    const before = new Set(Array.from(q.item.querySelectorAll('input[type=text],input:not([type]),textarea')));
    clickReal(trig);
    const input = await waitFor(() => {
      const cands = Array.from(q.item.querySelectorAll('input[type=text],input:not([type]),textarea')).filter((el) => !before.has(el) || !el.value);
      const popover = visibleOverlays().slice(-1)[0];
      const inPop = popover ? Array.from(popover.querySelectorAll('input[type=text],input:not([type]),textarea')) : [];
      return cands[cands.length - 1] || inPop[inPop.length - 1] || q.item.querySelector('input[type=text]') || null;
    }, { timeout: 1200, interval: 60 });
    if (!input) return { ok: false, detail: '未出现自定义输入框' };
    const r = writeValue(input, text, { humanize: true });
    if (!r.ok) return { ok: false, detail: '自定义输入框写入失败' };
    fireKey(input, 'Enter');
    return { ok: true, detail: '自定义：' + text, strategy: 'custom-option' };
  }

  function findCustomOptionTrigger(q) {
    const pat = /^(其他|其它|自定义|其他请填写|其他选项|其他（请注明）)$/;
    for (const o of q.options) {
      if (pat.test(norm(o.text))) return chooseClickTarget(o);
    }
    for (const el of q.item.querySelectorAll('label,[role=radio],[role=checkbox],li,[class*=option],[class*=Option]')) {
      const t = norm(textOf(el, { deep: false }));
      if (t && (pat.test(t) || /^其他/.test(t)) && t.length <= 10 && !el.querySelector('input[type=radio],input[type=checkbox]')) return el;
    }
    return null;
  }

  /** 下拉/日期等浮层：点击触发器 → 在"新出现的浮层"里点选项 */
  async function fillDropdown(q, value, { humanize } = {}) {
    const spec = parseSelectSpec(value);
    if (!spec) return { ok: false, detail: '配置值无法解析' };
    const trigger = q.control || q.item.querySelector('[role=combobox],[aria-haspopup],[class*=select],[class*=Select]');
    if (!trigger) return { ok: false, detail: '未找到下拉触发器' };

    // 有些"下拉"其实把选项直接渲染在题目里（没有浮层）
    const inline = q.options.length ? q.options : optionsOf(q.item);
    const inlineHit = inline.length ? matchOption(inline, spec) : { kind: 'none' };

    const before = new Set(visibleOverlays());
    clickReal(trigger);
    const overlay = await waitFor(() => {
      const now = visibleOverlays();
      const fresh = now.filter((el) => !before.has(el));
      return fresh.length ? fresh[fresh.length - 1] : (now.length ? now[now.length - 1] : null);
    }, { timeout: 1500, interval: 60 });

    let options = [];
    if (overlay) {
      options = overlayOptions(overlay);
      await sleep(humanize ? rnd(60, 160) : 40);
      const hit = matchOption(options, spec);
      if (hit.kind === 'option') {
        clickReal(chooseClickTarget(hit.option));
        await sleep(humanize ? rnd(60, 140) : 40);
        const after = norm(textOf(trigger));
        const verified = after && (after.includes(optionHaystack(hit.option)) || optionHaystack(hit.option).includes(after));
        closeIfOpen(trigger);
        return verified
          ? { ok: true, strategy: 'click-popover', detail: '已选：' + hit.option.text.trim() + (hit.fuzzy ? '（近似匹配）' : '') }
          : { ok: false, detail: '点击选项后触发器文本未更新（读到：' + textOf(trigger).slice(0, 40) + '）' };
      }
      closePopups();
      await sleep(80);
      if (hit.kind === 'custom') {
        const custom = await tryCustomOption(q, spec.custom);
        if (custom.ok) return custom;
      }
      if (hit.kind === 'missing') return { ok: false, detail: '浮层里没有「' + spec.optionText + '」' + (options.length ? '（共 ' + options.length + ' 项：' + options.map((o) => o.text.trim()).slice(0, 8).join('/') + '）' : '') };
    }

    // 退路 1：题目内直接渲染的选项
    if (inlineHit.kind === 'option') {
      clickReal(chooseClickTarget(inlineHit.option));
      await sleep(120);
      if (isFilled(q) || optionSelected(inlineHit.option)) return { ok: true, strategy: 'click-inline', detail: '已选：' + inlineHit.option.text.trim() };
    }
    // 退路 2：原生 select
    const sel = q.item.querySelector('select');
    if (sel) {
      const mo = matchOption(optionsOf({ querySelectorAll: sel.querySelectorAll.bind(sel) }), spec);
      if (mo.kind === 'option') return fillNativeSelect(q, mo.option);
    }
    // 退路 3：自定义项
    if (/自定义|其他/.test(textOf(q.item).slice(0, 200))) {
      const custom = await tryCustomOption(q, spec.optionText || spec.custom || '');
      if (custom.ok) return custom;
    }
    return { ok: false, detail: '下拉未成功' + (options.length ? '（浮层选项：' + options.map((o) => o.text.trim()).slice(0, 6).join('/') + '）' : '（未捕获到浮层）') };
  }

  function closeIfOpen(trigger) {
    // 选择后组件一般会自己收起；没收起才补一次 Esc
    try {
      const stillOpen = visibleOverlays().some((o) => o.contains(document.activeElement) || optionSelected({ el: document.activeElement }));
      if (stillOpen) closePopups();
    } catch (e) { /* ignore */ }
  }

  const OVERLAY_SEL = [
    '[role=listbox]', '[role=menu]', '[role=dialog]',
    '.k-select-dropdown', '.k-dropdown', '.ks-select-dropdown', '.ant-select-dropdown',
    '[class*=select-dropdown]', '[class*=selectDropdown]', '[class*=dropdown-menu]', '[class*=dropdownMenu]',
    '[class*=popover]', '[class*=Popover]', '[class*=popup]', '[class*=Popup]', '[class*=panel-content]',
    '.rti-container',
  ].join(',');

  function visibleOverlays() {
    const out = [];
    let nodes = [];
    try { nodes = Array.from(document.querySelectorAll(OVERLAY_SEL)); } catch (e) { nodes = []; }
    for (const el of nodes) {
      if (el.closest('[data-wpsfa-ui]')) continue;
      if (!isVisible(el)) continue;
      if (norm(textOf(el)) === '') continue;
      out.push(el);
    }
    // 去掉被其它浮层包住的外层
    return out.filter((el) => !out.some((o) => o !== el && o.contains(el)));
  }

  function overlayOptions(overlay) {
    const out = [];
    const seen = new Set();
    const nodes = overlay.querySelectorAll('[role=option],[role=menuitem],[role=treeitem],li,[class*=option],[class*=Option],[class*=item],[class*=Item],div,span');
    for (const el of nodes) {
      if (el.querySelector('[role=option],[class*=option],[class*=Option]')) continue;   // 只取叶子节点
      if (!isVisible(el)) continue;
      const t = textOf(el, { deep: false }).replace(/\s+/g, ' ').trim();
      if (!t || t.length > 60 || seen.has(t)) continue;
      seen.add(t);
      out.push({ text: t, el, kind: 'overlay', value: null });
    }
    return out;
  }

  /** 填充一道题（入口） */
  async function fillQuestion(q, key, rawValue, { humanize, overwrite, force } = {}) {
    const ctrl0 = q.control;
    if (ctrl0 && ctrl0.disabled) return { ok: false, detail: '控件被禁用（disabled），无法填写' };
    if (ctrl0 && (ctrl0.readOnly || ctrl0.getAttribute('readonly') != null)) return { ok: false, detail: '控件是只读的（readonly），脚本不该往里写' };
    if (isFilled(q) && !overwrite && !force) return { ok: true, skipped: true, detail: '已有内容，按设置跳过' };
    let res;
    try {
      switch (q.type) {
        case 'radio':    res = await fillChoice(q, asArray(rawValue), { humanize }); break;
        case 'checkbox': res = await fillChoice(q, asArray(rawValue), { humanize }); break;
        case 'select':   res = await fillSelectNative(q, rawValue); break;
        case 'dropdown': res = await fillDropdown(q, rawValue, { humanize }); break;
        case 'date':     res = await fillText(q, rawValue, { humanize }); break;
        case 'time':     res = await fillText(q, rawValue, { humanize }); break;
        case 'richtext': res = await fillText(q, rawValue, { humanize }); break;
        default:         res = await fillText(q, rawValue, { humanize }); break;
      }
    } catch (e) {
      res = { ok: false, detail: '异常：' + (e && e.message ? e.message : e) };
    }
    return res || { ok: false, detail: '未知错误' };
  }

  async function fillSelectNative(q, rawValue) {
    const spec = parseSelectSpec(rawValue);
    const mo = matchOption(optionsOf(q.item), spec);
    if (mo.kind === 'option') return fillNativeSelect(q, mo.option);
    if (mo.kind === 'custom') {
      const c = await tryCustomOption(q, mo.text);
      if (c.ok) return c;
    }
    return { ok: false, detail: '下拉未匹配到选项：' + JSON.stringify(rawValue) };
  }

  function asArray(v) {
    if (Array.isArray(v)) return v;
    if (v == null) return [];
    if (typeof v === 'object') {
      if (Array.isArray(v.value)) return v.value;
      return [v.option != null ? v.option : v.index != null ? v.index : v.custom != null ? v.custom : v.value].filter((x) => x != null);
    }
    const s = String(v);
    return MULTI_SPLIT.test(s) ? s.split(MULTI_SPLIT).map((x) => x.trim()).filter(Boolean) : [s];
  }

  /* ==========================================================================
   * 7. 分页 / 提交（严格白名单，绝不误点）
   * ========================================================================== */

  const BTN_SEL = 'button,[role=button],.k-button,.ant-btn,input[type=button],input[type=submit],a[class*=btn]';
  const NEXT_PAT = /^(下一页|下页|下一步|继续|继续填写|继续作答|下一题|下一页\s*\(.*\))$/;
  const SUBMIT_PAT = /^(提交|提交表单|提交答卷|立即提交|确认提交|确认并提交|提交并结束|完成并提交|交卷|提交答案)$/;
  const BLOCK_PAT = /(提交|保存|完成|结束|上一页|上一步|返回|重置|清空|取消|删除|退出|登录|提交并|完成并)/;

  function buttonsIn(scope) {
    return Array.from(scope.querySelectorAll(BTN_SEL)).filter((el) => isVisible(el) && !el.closest('[data-wpsfa-ui]') && !el.disabled);
  }

  function buttonText(el) { return norm(textOf(el, { deep: false })) .replace(/\s+/g, ''); }

  function isDisabled(el) {
    if (!el) return true;
    if (el.disabled) return true;
    if (el.getAttribute('aria-disabled') === 'true') return true;
    const cls = String(el.className || '');
    return /disabled/i.test(cls);
  }

  function findButton(pat, { scope = document, block = null } = {}) {
    for (const el of buttonsIn(scope)) {
      const t = buttonText(el);
      if (!t || t.length > 14) continue;
      if (block && block.test(t) && !pat.test(t)) continue;
      if (pat.test(t)) return el;
    }
    return null;
  }

  function findNextButton() { return findButton(NEXT_PAT, { block: BLOCK_PAT }); }
  function findSubmitButton() { return findButton(SUBMIT_PAT, { block: NEXT_PAT }); }

  function questionSignature() { return collectQuestions().map((q) => q.key + ':' + q.type).join('|'); }

  async function goNextPage() {
    const btn = findNextButton();
    if (!btn) return { ok: false, detail: '未找到“下一页”按钮' };
    if (isDisabled(btn)) return { ok: false, detail: '“下一页”按钮处于禁用状态（可能还有必填项未完成）' };
    const before = questionSignature();
    clickReal(btn);
    const changed = await waitFor(() => questionSignature() !== before, { timeout: 5000, interval: 120 });
    await sleep(300);
    return changed ? { ok: true, detail: '已进入下一页' } : { ok: false, detail: '点击后页面题目未变化（可能校验未通过）' };
  }

  async function submitForm({ allow = false } = {}) {
    if (!allow) return { ok: false, detail: '自动提交未开启，已跳过' };
    const btn = findSubmitButton();
    if (!btn) return { ok: false, detail: '未找到提交按钮' };
    if (isDisabled(btn)) return { ok: false, detail: '提交按钮处于禁用状态' };
    clickReal(btn);
    await sleep(600);
    // 提交确认弹窗
    const confirmPat = /^(确定|确认|是|好的|继续提交|确认提交)$/;
    const dlg = visibleOverlays().find((o) => /确定|确认|是否提交|提交后/.test(textOf(o)));
    if (dlg) {
      const ok = findButton(confirmPat, { scope: dlg }) || buttonsIn(dlg).find((b) => confirmPat.test(buttonText(b)));
      if (ok) { clickReal(ok); await sleep(300); return { ok: true, detail: '已提交（并确认弹窗）' }; }
    }
    return { ok: true, detail: '已点击提交' };
  }

  /* ==========================================================================
   * 8. 配置存取（全局个人信息 + 每个表单的专属覆盖）
   * ========================================================================== */

  let settings = Object.assign({}, DEFAULT_SETTINGS, store.get(KEYS.settings, {}));
  DEBUG = !!settings.debug;

  function currentSettings() { return settings; }
  function saveSettings(patch) {
    settings = Object.assign({}, settings, patch || {});
    DEBUG = !!settings.debug;
    store.set(KEYS.settings, settings);
    return settings;
  }

  function loadProfile() {
    const p = store.get(KEYS.profile, {});
    return (p && typeof p === 'object') ? p : {};
  }
  function saveProfile(profile) { store.set(KEYS.profile, profile || {}); }

  function simpleHash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  function formId() {
    const m = location.pathname.match(/\/ksform\/([A-Za-z0-9_-]{4,})/)
           || location.pathname.match(/\/(?:form|write|s|share)\/([A-Za-z0-9_-]{4,})/);
    if (m) return m[1];
    return 'p' + simpleHash(location.origin + location.pathname);
  }

  function loadFormConfig() {
    const c = store.get(KEYS.form(STATE.formId), null);
    return (c && typeof c === 'object') ? c : { overrides: {} };
  }
  function saveFormConfig(cfg) { store.set(KEYS.form(STATE.formId), cfg); }

  function questionId(q) {
    const d = q.item.dataset || {};
    const raw = d.questionId || d.qid || d.itemId || d.fieldId || d.id;
    if (raw) return String(raw);
    return 'q' + simpleHash(q.key + '|' + q.type);
  }

  /** 题目 → 最终要写入的值（表单专属覆盖 > 全局配置） */
  function answersFor(questions) {
    const profile = loadProfile();
    const cfg = loadFormConfig();
    const plan = planMatches(questions, profile);
    return questions.map((q, i) => {
      const qid = questionId(q);
      const hasOverride = cfg.overrides && Object.prototype.hasOwnProperty.call(cfg.overrides, qid);
      const p = plan[i];
      if (hasOverride) return { q, qid, key: p ? p.key : null, value: cfg.overrides[qid], source: 'override' };
      if (p) return { q, qid, key: p.key, value: profile[p.key], source: 'profile' };
      return { q, qid, key: null, value: null, source: null };
    });
  }

  /* ==========================================================================
   * 9. 状态与执行编排
   * ========================================================================== */

  const STATE = {
    formId: '',
    running: false,
    abort: false,
    userEditedAt: 0,        // 用户最近一次真实输入的时间（用于自动填充让路）
    results: [],      // {label, key, qid, status, detail}
    lastRunAt: 0,
    selftest: null,
    panel: null,
    log: [],
  };

  function pushResult(r) {
    STATE.results = STATE.results.filter((x) => x.qid !== r.qid).concat([r]);
    if (STATE.results.length > 200) STATE.results = STATE.results.slice(-200);
    STATE.log.push(r);
    renderResults();
  }

  function hasPendingWork() {
    let qs;
    try { qs = collectQuestions(); } catch (e) { return false; }
    if (!qs.length) return false;
    const entries = answersFor(qs);
    return entries.some((e) => e.value != null && e.value !== '' && !isFilled(e.q));
  }

  /** 主流程：逐页填充（可选自动翻页、可选提交） */
  async function runFill({ force = false, reason = 'manual', maxPages = 20, submit = null } = {}) {
    if (STATE.running) return { skipped: true, reason: '已在执行中' };
    if (!currentSettings().enabled) return { skipped: true, reason: '脚本已关闭' };
    STATE.running = true;
    STATE.abort = false;
    STATE.lastRunAt = Date.now();
    setStatus('填充中…');
    const summary = { pages: 0, filled: 0, failed: 0, skipped: 0, missingRequired: [], submitted: false };
    try {
      for (let page = 1; page <= maxPages; page++) {
        const questions = await waitFor(() => { const qs = collectQuestions(); return qs.length ? qs : null; }, { timeout: 4000, interval: 120 });
        if (!questions || !questions.length) { if (page === 1) notify('未识别到任何题目'); break; }
        summary.pages = page;
        const entries = answersFor(questions);

        for (const e of entries) {
          if (STATE.abort) break;
          const value = e.value;
          const hasValue = value != null && value !== '' && !(Array.isArray(value) && !value.length);
          if (!hasValue) {
            pushResult({ qid: e.qid, label: e.q.label, key: e.key, type: e.q.type, required: e.q.required, status: 'none', detail: e.source === 'override' ? '覆盖值为空' : '未配置答案' });
            continue;
          }
          const res = await fillQuestion(e.q, e.key, value, { humanize: currentSettings().humanize, overwrite: currentSettings().overwrite, force });
          if (res.skipped) { summary.skipped++; pushResult({ qid: e.qid, label: e.q.label, key: e.key, type: e.q.type, required: e.q.required, status: 'skip', detail: res.detail }); }
          else if (res.ok) { summary.filled++; pushResult({ qid: e.qid, label: e.q.label, key: e.key, type: e.q.type, required: e.q.required, status: 'ok', detail: res.detail || ('写入方式：' + (res.strategy || '-')) }); }
          else { summary.failed++; pushResult({ qid: e.qid, label: e.q.label, key: e.key, type: e.q.type, required: e.q.required, status: 'fail', detail: res.detail || '失败' }); }
          setStatus('填充中… 已填 ' + summary.filled + ' 失败 ' + summary.failed);
          if (currentSettings().humanize) await sleep(rnd(70, 190));
        }

        const missingHere = entries.filter((e) => e.q.required && !isFilled(e.q));
        missingHere.forEach((e) => summary.missingRequired.push(e.q.label));
        renderResults();

        const next = findNextButton();
        if (!next || !currentSettings().autoPaginate) break;
        if (STATE.abort) break;
        if (missingHere.length) { notify('本页还有必填项未完成，停止翻页：' + missingHere.map((x) => x.q.label).slice(0, 3).join('、')); break; }
        const nav = await goNextPage();
        pushResult({ qid: 'page' + page, label: '翻页', key: null, status: nav.ok ? 'ok' : 'fail', detail: nav.detail });
        if (!nav.ok) break;
      }

      // 全表单校验 + 可选提交
      const all = collectQuestions();
      const missingAll = all.filter((q) => q.required && !isFilled(q)).map((q) => q.label);
      summary.missingRequired = Array.from(new Set(missingAll.concat(summary.missingRequired)));
      const wantSubmit = submit == null ? currentSettings().autoSubmit : submit;
      if (wantSubmit && !missingAll.length) {
        setStatus('等待提交…');
        await sleep(currentSettings().submitDelayMs);
        const s = await submitForm({ allow: true });
        summary.submitted = !!s.ok;
        pushResult({ qid: 'submit', label: '提交', key: null, status: s.ok ? 'ok' : 'fail', detail: s.detail });
      } else if (wantSubmit && missingAll.length) {
        pushResult({ qid: 'submit', label: '提交', key: null, status: 'fail', detail: '有 ' + missingAll.length + ' 个必填项未填，已阻止提交' });
      }
      setStatus(summary.failed ? ('完成：成功 ' + summary.filled + '，失败 ' + summary.failed) : ('完成：已填 ' + summary.filled + ' 项'));
      notify(buildSummaryText(summary));
      return summary;
    } catch (e) {
      setStatus('出错：' + (e && e.message ? e.message : e));
      warn('填充过程异常', e);
      return Object.assign(summary, { error: String(e && e.message || e) });
    } finally {
      STATE.running = false;
    }
  }

  function buildSummaryText(s) {
    const parts = ['已填 ' + s.filled + ' 项'];
    if (s.skipped) parts.push('跳过 ' + s.skipped);
    if (s.failed) parts.push('失败 ' + s.failed);
    if (s.missingRequired.length) parts.push('未完成必填：' + s.missingRequired.slice(0, 3).join('、'));
    if (s.submitted) parts.push('已提交');
    return parts.join('，');
  }

  const EDIT_GUARD_MS = 60000;   // 用户手动改过表单后，这段时间内不再自动重填

  async function autoRun(reason, delay) {
    if (delay) await sleep(delay);
    const s = currentSettings();
    if (!s.enabled || !s.autoFill) return;
    if (STATE.running) return;
    // ① 用户正在自己填表 → 让路（手动点击面板/菜单不受影响）
    const userDriven = ['manual', 'menu', 'api'].includes(reason);
    if (!userDriven && STATE.userEditedAt && Date.now() - STATE.userEditedAt < EDIT_GUARD_MS) { log('用户正在编辑表单，跳过自动填充'); return; }
    if (!hasPendingWork()) return;
    await runFill({ force: false, reason });
  }

  /* ==========================================================================
   * 10. 兼容性自检
   * ========================================================================== */

  function probeReact(limit = 4000) {
    const nodes = document.querySelectorAll('*');
    const n = Math.min(nodes.length, limit);
    let fiberNodes = 0, fiberKeys = 0, trackers = 0;
    for (let i = 0; i < n; i++) {
      const el = nodes[i];
      let names = [];
      // React 的 _valueTracker 是 defineProperty 挂上去的（不可枚举），Object.keys 抓不到
      try { names = Object.getOwnPropertyNames(el); } catch (e) { continue; }
      let isReact = false;
      for (const key of names) {
        if (key.startsWith('__reactFiber$') || key.startsWith('__reactProps$') || key.startsWith('__reactInternalInstance$') || key === '_reactRootContainer') { isReact = true; fiberKeys++; }
        if (key === '_valueTracker') trackers++;
      }
      if (isReact) fiberNodes++;
    }
    return { scanned: n, total: nodes.length, fiberNodes, fiberKeys, trackers };
  }

  async function runSelfTest({ deep = false } = {}) {
    const checks = [];
    const add = (name, ok, detail, level = ok ? 'pass' : 'warn') => checks.push({ name, ok: !!ok, detail: detail || '', level });

    const tmOk = IS_TM;
    add('运行环境', true, tmOk ? '检测到油猴 API（GM_getValue/GM_setValue 可用）' : '未检测到油猴 API：脚本可运行，但配置改存 localStorage（仅当前站点可见）', tmOk ? 'pass' : 'warn');

    const host = isFormHost();
    add('页面匹配', host.ok, 'host=' + location.hostname + ' | 路由判定=' + host.pathOk + ' | DOM 判定=' + host.domOk + ' | 匹配规则 *://*.kdocs.cn/* 等', host.ok ? 'pass' : 'warn');
    add('文档状态', document.readyState !== 'loading', 'readyState=' + document.readyState + '，body=' + !!document.body);
    add('表单根节点', !!document.getElementById('root'), document.getElementById('root') ? '找到 #root（React 挂载点）' : '未找到 #root（可能不是 WPS 表单页面）');
    if (isEditMode()) add('页面模式', false, '当前疑似“编辑/设计”模式（创建者视角），只读填写页才能自动填报', 'warn');

    const react = probeReact();
    const reactOk = react.fiberNodes > 0 || react.trackers > 0;
    add('React 受控组件', reactOk, reactOk
      ? '扫描 ' + react.scanned + '/' + react.total + ' 个节点：React 节点 ' + react.fiberNodes + ' 个、' + react.trackers + ' 个 _valueTracker（说明表单受控，必须用原型 setter 写入）'
      : '未检测到 React 痕迹（若表单确实未渲染完，请稍后重试）', reactOk ? 'pass' : 'warn');

    const setter = nativeValueSetter(document.createElement('input'));
    add('原生 value setter', !!setter, setter ? '可在 HTMLInputElement.prototype 上取得 → 能绕过 React 的值追踪（关键能力）' : '取不到原型 setter，将退回直接赋值', setter ? 'pass' : 'fail');

    const qs = collectQuestions();
    add('题目识别', qs.length > 0, qs.length ? '识别到 ' + qs.length + ' 道题：' + qs.slice(0, 8).map((q) => q.label).join(' / ') : '未识别到题目（脚本会持续尝试，页面渲染完成后自动重试）', qs.length ? 'pass' : 'fail');
    const byType = {};
    qs.forEach((q) => { byType[q.type] = (byType[q.type] || 0) + 1; });
    add('题型统计', qs.length > 0, qs.length ? JSON.stringify(byType) : '—', qs.length ? 'pass' : 'warn');

    const entries = answersFor(qs);
    const matched = entries.filter((e) => e.value != null && e.value !== '');
    add('配置匹配率', matched.length > 0 || !qs.length,
      qs.length ? '已匹配 ' + matched.length + '/' + qs.length + ' 道题' + (matched.length < qs.length ? '；未匹配：' + entries.filter((e) => !e.value).map((e) => e.q.label).slice(0, 6).join('、') : '') : '—',
      matched.length ? 'pass' : 'warn');

    const overlays = visibleOverlays();
    add('浮层探测能力', true, '当前可见浮层 ' + overlays.length + ' 个，探测选择器 ' + OVERLAY_SEL.split(',').length + ' 条（下拉/日期浮层通常挂在 body 的 portal 上）');

    const nextBtn = findNextButton();
    add('分页按钮', true, nextBtn ? '找到“' + textOf(nextBtn, { deep: false }).trim() + '”' : '未找到（单页表单属正常）');
    const submitBtn = findSubmitButton();
    add('提交按钮', !!submitBtn, submitBtn ? '找到“' + textOf(submitBtn, { deep: false }).trim() + '”' : '未找到（可能未渲染或文案不同）');
    add('自动提交开关', !currentSettings().autoSubmit, currentSettings().autoSubmit ? '已开启：全部必填通过后会自动提交（谨慎）' : '已关闭（推荐）：脚本填完后由你自己点提交', currentSettings().autoSubmit ? 'warn' : 'pass');

    const key = 'wpsfa.selftest.probe';
    store.set(key, { v: VERSION, t: Date.now() });
    const back = store.get(key, null);
    add('配置持久化', !!(back && back.v === VERSION), back ? (IS_TM ? 'GM 存储读写正常' : 'localStorage 读写正常') : '读写失败（隐私模式或存储被禁用）', back ? 'pass' : 'fail');

    if (deep) checks.push(await deepInputTest());

    // 逐题明细
    const detail = entries.map((e) => ({
      label: e.q.label, type: e.q.type, required: e.q.required,
      key: e.key || '—', source: e.source || '—',
      value: e.value == null ? '' : (typeof e.value === 'object' ? JSON.stringify(e.value) : String(e.value)),
      options: e.q.options.length, filled: isFilled(e.q),
    }));

    STATE.selftest = { at: Date.now(), checks, detail, version: VERSION, url: location.href, questions: qs.length };
    renderSelftest();
    log('自检结果', STATE.selftest);
    return STATE.selftest;
  }

  /** 深度检测：在第一个空文本框上做一次"写入→回读→还原"的真实测试 */
  async function deepInputTest() {
    const qs = collectQuestions();
    const target = qs.find((q) => (q.type === 'text' || q.type === 'textarea') && q.control && !q.control.value && !q.control.readOnly && !q.control.disabled);
    if (!target) return { name: '真实写入测试', ok: false, level: 'warn', detail: '没有可用于测试的空文本框（为避免打扰，检测不会覆盖已有内容）' };
    const ctrl = target.control;
    const before = ctrl.value;
    let gotInput = 0, gotChange = 0;
    const onInput = () => gotInput++;
    const onChange = () => gotChange++;
    ctrl.addEventListener('input', onInput);
    ctrl.addEventListener('change', onChange);
    const res = writeValue(ctrl, '自动填写自检', { humanize: false });
    ctrl.removeEventListener('input', onInput);
    ctrl.removeEventListener('change', onChange);
    const restored = writeValue(ctrl, before, { humanize: false });
    const ok = res.ok && gotInput > 0 && String(ctrl.value) === String(before);
    return {
      name: '真实写入测试（' + target.label + '）',
      ok,
      level: ok ? 'pass' : 'fail',
      detail: '写入策略=' + res.strategy + '，回读=' + JSON.stringify(res.readback) + '，input 事件 ' + gotInput + ' 次，change 事件 ' + gotChange + ' 次，已还原原值=' + (String(ctrl.value) === String(before)),
    };
  }

  /* ==========================================================================
   * 11. 悬浮面板（Shadow DOM，避免与站点样式互相污染）
   * ========================================================================== */

  const PANEL_CSS = [
    ':host{all:initial}',
    '*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}',
    '.wrap{position:fixed;right:16px;bottom:16px;z-index:2147483000;width:340px;max-height:78vh;display:flex;flex-direction:column;',
    'background:#fff;color:#1f2329;border:1px solid #e3e6eb;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.16);overflow:hidden;font-size:12px}',
    'header{display:flex;align-items:center;gap:6px;padding:9px 12px;background:linear-gradient(90deg,#0b8f5a,#12a06b);color:#fff;cursor:default}',
    'header b{font-size:13px;font-weight:600}',
    'header .ver{opacity:.85;font-size:11px}',
    'header .grow{flex:1}',
    'header button{all:unset;cursor:pointer;padding:2px 6px;border-radius:6px;background:rgba(255,255,255,.18);font-size:11px}',
    'header button:hover{background:rgba(255,255,255,.32)}',
    '.body{padding:10px 12px;overflow:auto}',
    '.row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}',
    '.row button{flex:1;min-width:72px;padding:7px 8px;border:1px solid #d7dbe0;border-radius:8px;background:#f7f8fa;cursor:pointer;font-size:12px}',
    '.row button.primary{background:#0b8f5a;border-color:#0b8f5a;color:#fff;font-weight:600}',
    '.row button:hover{border-color:#0b8f5a}',
    '.status{padding:6px 8px;background:#f2f7f4;border:1px solid #d9ebe2;border-radius:8px;color:#0b6b45;margin-bottom:8px;white-space:pre-wrap}',
    'details{border:1px solid #eceef1;border-radius:8px;margin-bottom:8px;overflow:hidden}',
    'summary{cursor:pointer;padding:7px 9px;background:#fafbfc;font-weight:600;color:#3b4148}',
    '.fields{padding:6px 9px 9px}',
    '.f{display:flex;align-items:center;gap:8px;margin:5px 0}',
    '.f label{width:92px;color:#5c636b;flex:none;text-align:right}',
    '.f input[type=text],.f input:not([type]){flex:1;min-width:0;padding:5px 7px;border:1px solid #dcdfe4;border-radius:6px;font-size:12px}',
    '.f input:focus{outline:1px solid #0b8f5a;border-color:#0b8f5a}',
    '.opts{padding:6px 9px 9px}',
    '.opts .o{display:flex;align-items:center;gap:6px;margin:4px 0;color:#4a5058}',
    '.opts input{accent-color:#0b8f5a}',
    '.tip{color:#8a9099;line-height:1.5;margin:6px 0 8px}',
    '.list{border-top:1px dashed #e6e8eb;margin-top:6px;padding-top:6px}',
    '.item{display:flex;gap:6px;align-items:flex-start;padding:4px 0;border-bottom:1px solid #f4f5f7}',
    '.item .tag{flex:none;width:34px;text-align:center;border-radius:4px;font-size:10px;padding:2px 0;color:#fff}',
    '.tag.ok{background:#0b8f5a}.tag.skip{background:#94a3b8}.tag.fail{background:#d93f3f}.tag.none{background:#c2c8d0}.tag.pass{background:#0b8f5a}.tag.warn{background:#e0a300}',
    '.item .txt{flex:1;min-width:0}',
    '.item .lb{font-weight:600;color:#33383d;word-break:break-all}',
    '.item .dt{color:#8a9099;word-break:break-all;margin-top:1px}',
    '.item .ov{width:96px;flex:none;padding:4px 6px;border:1px solid #dcdfe4;border-radius:6px;font-size:11px}',
    '.hidden{display:none}',
  ].join('');

  const PANEL_HTML = [
    '<div class="wrap">',
    '  <header><b>WPS 表单自动填写</b><span class="ver"></span><span class="grow"></span>',
    '    <button id="min" title="收起/展开">收起</button><button id="hide" title="隐藏面板（可在油猴菜单里重新打开）">×</button></header>',
    '  <div class="body">',
    '    <div class="row">',
    '      <button id="fill" class="primary">一键填写</button><button id="abort">停止</button><button id="save">保存配置</button><button id="self">兼容性自检</button>',
    '    </div>',
    '    <div class="status" id="status">就绪</div>',
    '    <details class="sec" open><summary>我的信息（全局，所有表单共用）</summary><div class="fields" id="fields"></div></details>',
    '    <details class="sec"><summary>行为设置</summary><div class="opts" id="opts"></div></details>',
    '    <details class="sec" open><summary>本表单结果 / 覆盖值</summary><div class="list" id="list"></div><div class="tip">右侧输入框可为本次表单单独指定答案（覆盖上面的全局信息，留空则忽略）。分页表单每次只填当前页，勾选“自动点下一页”可自动继续。</div></details>',
    '  </div>',
    '</div>',
  ].join('');

  const STATUS_ICON = { ok: '成功', skip: '跳过', fail: '失败', none: '未配', pass: '通过', warn: '注意' };

  function mountPanel() {
    if (STATE.panel || document.querySelector('[data-wpsfa-ui]')) return;
    const hostEl = document.createElement('div');
    hostEl.setAttribute('data-wpsfa-ui', '1');
    hostEl.style.cssText = 'all:initial;position:static';
    (document.body || document.documentElement).appendChild(hostEl);
    const shadow = hostEl.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = PANEL_CSS;
    const holder = document.createElement('div');
    holder.innerHTML = PANEL_HTML;
    shadow.appendChild(style);
    shadow.appendChild(holder);

    const $ = (sel) => shadow.querySelector(sel);
    STATE.panel = { host: hostEl, shadow, $ };

    $('.ver').textContent = 'v' + VERSION;
    $('header').title = 'WPS 表单 / 金山表单 自动填写助手 ' + VERSION;
    renderFields();
    renderOpts();
    renderResults();

    $('#min').addEventListener('click', () => {
      const body = $('.body');
      const hidden = body.classList.toggle('hidden');
      $('#min').textContent = hidden ? '展开' : '收起';
    });
    $('#hide').addEventListener('click', () => { hostEl.style.display = 'none'; saveSettings({ showPanel: false }); notify('面板已隐藏，可从油猴菜单重新打开'); });
    $('#fill').addEventListener('click', () => runFill({ force: true, reason: 'manual' }));
    $('#abort').addEventListener('click', () => { STATE.abort = true; setStatus('已请求停止…'); });
    $('#save').addEventListener('click', saveFromPanel);
    $('#self').addEventListener('click', () => { setStatus('自检中…'); runSelfTest({ deep: true }); });
    if (settings.debug) console.log(TAG, '面板已挂载');
  }

  function clearPanelHide() {
    if (STATE.panel && STATE.panel.host) STATE.panel.host.style.display = '';
  }

  function renderFields() {
    if (!STATE.panel) return;
    const box = STATE.panel.$('#fields');
    const profile = loadProfile();
    box.innerHTML = '';
    for (const key of Object.keys(PROFILE_LABELS)) {
      const row = document.createElement('div');
      row.className = 'f';
      const lab = document.createElement('label');
      lab.textContent = PROFILE_LABELS[key];
      lab.title = '内部字段：' + key;
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.dataset.key = key;
      const v = profile[key];
      inp.value = v == null ? '' : (typeof v === 'object' ? (v.option != null ? String(v.option) : v.index != null ? String(v.index) : v.value != null ? String(v.value) : '') : String(v));
      inp.placeholder = key === 'topic1' ? '选项文字或序号，如：数字媒体技术  或 3' : '';
      if (/phone|email/.test(key)) inp.addEventListener('blur', () => { inp.value = inp.value.trim(); });
      row.appendChild(lab); row.appendChild(inp);
      box.appendChild(row);
    }
  }

  function renderOpts() {
    if (!STATE.panel) return;
    const box = STATE.panel.$('#opts');
    const defs = [
      ['enabled', '开启脚本'],
      ['autoFill', '自动填写（打开表单即填）'],
      ['overwrite', '覆盖已填内容'],
      ['autoPaginate', '自动点“下一页”'],
      ['humanize', '模拟真人延迟'],
      ['autoSubmit', '⚠️ 自动提交（危险）'],
      ['debug', '控制台调试日志'],
    ];
    box.innerHTML = '';
    for (const [key, label] of defs) {
      const row = document.createElement('label');
      row.className = 'o';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!settings[key];
      cb.dataset.opt = key;
      cb.addEventListener('change', () => {
        saveSettings({ [key]: cb.checked });
        if (key === 'enabled' || key === 'autoFill') { if (cb.checked) autoRun('opt-on', 100); }
        if (key === 'debug') notify('调试日志：' + (cb.checked ? '已开启（控制台 ' + TAG + '）' : '已关闭'));
      });
      const span = document.createElement('span');
      span.textContent = label;
      row.appendChild(cb); row.appendChild(span);
      box.appendChild(row);
    }
  }

  function renderResults() {
    if (!STATE.panel) return;
    const list = STATE.panel.$('#list');
    const cfg = loadFormConfig();
    list.innerHTML = '';
    if (!STATE.results.length) {
      const t = document.createElement('div');
      t.className = 'tip';
      t.textContent = '还没有记录。点击“一键填写”后会在这里显示每道题的结果。';
      list.appendChild(t);
      return;
    }
    for (const r of STATE.results) {
      const item = document.createElement('div');
      item.className = 'item';
      const tag = document.createElement('span');
      tag.className = 'tag ' + (r.status || 'none');
      tag.textContent = STATUS_ICON[r.status] || r.status;
      const txt = document.createElement('div');
      txt.className = 'txt';
      const lb = document.createElement('div');
      lb.className = 'lb';
      lb.textContent = (r.required ? '＊' : '') + r.label + (r.key ? ' 〔' + r.key + '〕' : '');
      const dt = document.createElement('div');
      dt.className = 'dt';
      dt.textContent = r.detail || '';
      txt.appendChild(lb); txt.appendChild(dt);
      const ov = document.createElement('input');
      ov.className = 'ov';
      ov.type = 'text';
      ov.placeholder = '覆盖值';
      ov.value = (cfg.overrides && cfg.overrides[r.qid] != null) ? String(cfg.overrides[r.qid]) : '';
      ov.addEventListener('change', () => {
        const c = loadFormConfig();
        c.overrides = c.overrides || {};
        if (ov.value.trim() === '') delete c.overrides[r.qid];
        else c.overrides[r.qid] = ov.value.trim();
        c.savedAt = Date.now();
        saveFormConfig(c);
        notify('已保存本表单覆盖值：' + r.label);
      });
      item.appendChild(tag); item.appendChild(txt); item.appendChild(ov);
      list.appendChild(item);
    }
  }

  function renderSelftest() {
    if (!STATE.panel || !STATE.selftest) return;
    const st = STATE.selftest;
    STATE.results = st.checks.map((c, i) => ({
      qid: 'check' + i,
      label: c.name,
      key: null,
      status: c.ok ? 'ok' : (c.level === 'fail' ? 'fail' : 'skip'),
      detail: c.detail,
    })).concat(st.detail.map((d) => ({
      qid: 'q.' + d.label,
      label: d.label,
      key: d.key === '—' ? null : d.key,
      status: d.value ? 'ok' : 'none',
      detail: '题型=' + d.type + (d.required ? '（必填）' : '') + ' 来源=' + d.source + ' 选项数=' + d.options + ' 当前值=' + (d.filled ? '已有内容' : '空') + (d.value ? ' → ' + d.value : ''),
    })));
    renderResults();
    setStatus('自检完成：' + st.checks.filter((c) => c.ok).length + '/' + st.checks.length + ' 项通过');
  }

  function setStatus(text) {
    if (STATE.panel) { const el = STATE.panel.$('#status'); if (el) el.textContent = text; }
    log('status:', text);
  }

  function notify(text) {
    setStatus(text);
    try {
      if (IS_TM && typeof GM_notification === 'function' && currentSettings().notify) GM_notification(text, 'WPS 表单自动填写');
    } catch (e) { /* ignore */ }
  }

  function saveFromPanel() {
    if (!STATE.panel) return;
    const profile = loadProfile();
    let n = 0;
    for (const inp of STATE.panel.shadow.querySelectorAll('#fields input')) {
      const key = inp.dataset.key;
      const v = inp.value.trim();
      if (v === '') delete profile[key];
      else profile[key] = v;
      n++;
    }
    saveProfile(profile);
    notify('已保存 ' + n + ' 项个人信息');
  }

  /* ==========================================================================
   * 12. 触发与生命周期
   * ========================================================================== */

  function shouldRunHere() {
    const host = isFormHost();
    if (!host.hostOk) return false;
    return host.pathOk || host.domOk;
  }

  function installTriggers() {
    // 1) DOM 变化（题目渲染出来 / 分页切换）
    let timer = 0;
    const schedule = (reason, delay = 800) => {
      clearTimeout(timer);
      timer = setTimeout(() => { autoRun(reason).catch((e) => warn(e)); }, delay);
    };
    const mo = new MutationObserver(() => schedule('mutation', 800));
    try { mo.observe(document.documentElement, { childList: true, subtree: true, attributes: false, characterData: false }); } catch (e) { /* ignore */ }

    // 2) SPA 路由切换
    window.addEventListener('popstate', () => schedule('popstate', 500));
    window.addEventListener('hashchange', () => schedule('route', 500));
    try {
      const h = PAGE.history;
      if (h && !h.__wpsfaHooked) {
        for (const m of ['pushState', 'replaceState']) {
          const orig = h[m];
          h[m] = function () {
            const r = orig.apply(this, arguments);
            try { window.dispatchEvent(new Event('wpsfa:routechange')); } catch (e) { /* ignore */ }
            return r;
          };
        }
        h.__wpsfaHooked = true;
      }
    } catch (e) { /* ignore */ }
    window.addEventListener('wpsfa:routechange', () => {
      if (formId() !== STATE.formId) { STATE.formId = formId(); STATE.results = []; STATE.userEditedAt = 0; renderResults(); }
      schedule('routechange', 600);
    });

    // 3) 用户首次交互 / 页面重新可见时补一次（应对懒加载、分页、Tab 切回）
    const kick = () => { if (hasPendingWork()) schedule('interaction', 200); };
    for (const ev of ['pointerdown', 'click', 'keydown', 'wheel', 'touchstart', 'focusin', 'scroll', 'input']) {
      window.addEventListener(ev, kick, { passive: true, capture: true });
    }
    // 用户在表单里真实输入（isTrusted=true；脚本自己派发的事件是 false）→ 让路，避免把用户正在改的内容又填回去
    const markUserEdit = (ev) => { if (ev && ev.isTrusted) STATE.userEditedAt = Date.now(); };
    window.addEventListener('input', markUserEdit, { passive: true, capture: true });
    window.addEventListener('keydown', markUserEdit, { passive: true, capture: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule('visible', 400); });

    // 4) 兜底轮询：前 30 秒内每 2.5 秒检查一次（应对观察器未覆盖的渲染方式）
    let ticks = 0;
    const iv = setInterval(() => {
      ticks++;
      if (ticks > 12 || STATE.running) { if (ticks > 12) clearInterval(iv); return; }
      if (hasPendingWork()) schedule('poll', 50);
    }, 2500);
  }

  function expose() {
    const api = {
      version: VERSION,
      run: (opts) => runFill(Object.assign({ force: true, reason: 'api' }, opts || {})),
      autoRun: (reason) => autoRun(reason || 'api', 0),
      collect: () => collectQuestions(),
      plan: () => answersFor(collectQuestions()),
      selfTest: (opts) => runSelfTest(opts || {}),
      fillOne: (label, value) => {
        const q = collectQuestions().find((x) => x.key === norm(label) || norm(x.label) === norm(label));
        if (!q) return Promise.resolve({ ok: false, detail: '未找到题目：' + label });
        return fillQuestion(q, null, value, { humanize: false, force: true });
      },
      settings: {
        get: () => Object.assign({}, settings),
        set: (patch) => { const s = saveSettings(patch); renderOpts(); return s; },
      },
      profile: {
        get: loadProfile,
        set: (p) => { saveProfile(p); renderFields(); return loadProfile(); },
      },
      formId,
      state: STATE,
      ui: { mount: mountPanel, show: () => { clearPanelHide(); saveSettings({ showPanel: true }); }, render: () => { renderFields(); renderOpts(); renderResults(); } },
      // 供单元测试直接调用的内部函数
      test: {
        norm, isVisible, textOf, nativeValueSetter, setViaProtoSetter, valueTracker, writeValue, dispatchInput, valueMatches,
        parseSelectSpec, matchOption, scoreCandidates, planMatches, optionsOf, optionLabelOf, labelTextOf, typeOfItem, isRequired,
        collectQuestions, deriveItemsFromControls, answersFor, isFilled, visibleOverlays, overlayOptions, findNextButton, findSubmitButton,
        findCustomOptionTrigger, isFormHost, questionId, formId, toDateValue, asArray, simpleHash,
        fillQuestion, runFill, runSelfTest, fillDropdown, fillChoice, planMatchesRaw: planMatches,
        topicOrdinalOf, topicFamilyOrder, questionContainers,
      },
    };
    try { PAGE.__WPS_AUTOFILL__ = api; } catch (e) { /* ignore */ }
    try { window.__WPS_AUTOFILL__ = api; } catch (e) { /* ignore */ }
    return api;
  }

  async function bootstrap() {
    if (!shouldRunHere()) { log('当前页面不是 WPS 表单，脚本保持静默'); return; }
    await waitFor(() => document.body && rootEl(), { timeout: 20000, interval: 100 });
    STATE.formId = formId();
    if (settings.showPanel) mountPanel();
    installTriggers();
    expose();
    try {
      if (IS_TM && typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('① 立即填写当前表单', () => runFill({ force: true, reason: 'menu' }));
        GM_registerMenuCommand('② 显示/隐藏面板', () => {
          if (!STATE.panel) mountPanel();
          const hostEl = STATE.panel && STATE.panel.host;
          if (hostEl) {
            const nowHidden = hostEl.style.display === 'none';
            hostEl.style.display = nowHidden ? '' : 'none';
          }
          saveSettings({ showPanel: true });
        });
        GM_registerMenuCommand('③ 兼容性自检（含真实写入测试）', () => runSelfTest({ deep: true }));
        GM_registerMenuCommand('④ 清空本表单覆盖值', () => { store.del(KEYS.form(formId())); STATE.results = []; renderResults(); notify('已清空本表单覆盖值'); });
      }
    } catch (e) { /* ignore */ }
    setTimeout(() => { autoRun('start', 800).catch((e) => warn(e)); }, 900);
    if (settings.debug) console.log(TAG, 'v' + VERSION + ' 已加载于 ' + location.href);
  }

  /* ---- 测试宿主模式：给自动化测试用，不自动填充、不挂面板 ---- */
  const TEST_HOST = (() => { try { return PAGE.__WPS_AUTOFILL_TEST__ || window.__WPS_AUTOFILL_TEST__; } catch (e) { return null; } })();

  expose();
  if (!TEST_HOST) bootstrap();
  else log('测试宿主模式：已跳过自动初始化');
})();

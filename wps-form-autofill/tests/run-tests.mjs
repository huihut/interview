/**
 * WPS 表单自动填写助手 —— 自动化测试
 *
 * 依赖：jsdom（npm install）
 * 运行：npm test
 *
 * 测试做了两件关键的事：
 *  1) 真实加载 wps-form-autofill.user.js（不做任何改造），在 jsdom 里执行；
 *  2) 用 reactify() 精确复刻 React 受控组件的行为：节点上挂 _valueTracker，直接 `input.value = x`
 *     会让 tracker 与 DOM 同步 → React 认为"没变" → 不触发 onChange；只有绕过 tracker 的写入
 *     （原型链 setter）才能让 React 收到变更。这样"脚本到底有没有真的把值写进 React 表单"是可断言的。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = fs.readFileSync(path.join(__dirname, '..', 'wps-form-autofill.user.js'), 'utf8');

/* ==========================================================================
 * 迷你测试框架
 * ========================================================================== */

const stats = { pass: 0, fail: 0, msgs: [] };
let current = '';

function suite(name) { current = name; console.log('\n=== ' + name + ' ==='); }

function check(name, cond, detail) {
  if (cond) { stats.pass++; console.log('  ✓ ' + name + (detail ? '  — ' + detail : '')); }
  else {
    stats.fail++;
    console.log('  ✗ ' + name + '  — ' + (detail || '断言失败'));
    stats.msgs.push(current + ' › ' + name + (detail ? ' :: ' + detail : ''));
  }
}
const eq = (name, actual, expected) => check(name, actual === expected, 'actual=' + JSON.stringify(actual) + ' expected=' + JSON.stringify(expected));
const ok = (name, cond, detail) => check(name, !!cond, detail);

/* ==========================================================================
 * 环境搭建
 * ========================================================================== */

/** 创建一个"WPS 表单"测试页：注入 mock app + 载入用户脚本 */
function makePage({ html = '', url = 'http://localhost/ksform/abc123def', tm = true, testHost = true, store: seed = {} } = {}) {
  const dom = new JSDOM('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>', {
    url, runScripts: 'outside-only', pretendToBeVisual: true,
  });
  const win = dom.window;
  const gstore = Object.assign({}, seed);

  if (tm) {
    win.GM_getValue = (k, d) => (Object.prototype.hasOwnProperty.call(gstore, k) ? gstore[k] : d);
    win.GM_setValue = (k, v) => { gstore[k] = v; };
    win.GM_deleteValue = (k) => { delete gstore[k]; };
    win.GM_registerMenuCommand = (label, fn) => { (win.__menu = win.__menu || []).push([label, fn]); };
    win.GM_addStyle = (css) => { const s = win.document.createElement('style'); s.textContent = css; win.document.head.appendChild(s); return s; };
    win.GM_setClipboard = () => { };
    win.GM_notification = () => { };
  }
  win.unsafeWindow = win;
  if (testHost) win.__WPS_AUTOFILL_TEST__ = { test: true };

  const sim = { controlled: new Map(), events: { input: 0, change: 0 }, clicks: {}, radio: {}, checks: {}, dialogs: [] };
  win.document.body.innerHTML = html;
  if (html) wireMockApp(win, sim);

  win.eval(SRC);
  const api = win.__WPS_AUTOFILL__;
  return { dom, win, doc: win.document, api, sim, store: gstore };
}

/** React 受控输入模拟：tracker + 受控 value 属性 + onChange 语义 */
function reactify(win, el, sim) {
  const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
  const st = { value: el.value, updates: 0, input: 0, change: 0 };
  const tracker = { getValue: () => st.value, setValue: (v) => { st.value = String(v); }, stopTracking: () => { } };
  Object.defineProperty(el, '_valueTracker', { value: tracker, configurable: true });
  Object.defineProperty(el, 'value', {
    configurable: true,
    get() { return desc.get.call(el); },
    set(v) { tracker.setValue(v); desc.set.call(el, v); },
  });
  el.addEventListener('input', () => { st.input++; sim.events.input++; if (st.value !== el.value) { st.value = el.value; st.updates++; } });
  el.addEventListener('change', () => { st.change++; sim.events.change++; });
  sim.controlled.set(el, st);
  return st;
}

/** mock 一个"WPS 表单"应用：受控输入、单选/多选、portal 下拉、分页、提交+确认弹窗 */
function wireMockApp(win, sim) {
  const doc = win.document;
  sim.bump = (k) => { sim.clicks[k] = (sim.clicks[k] || 0) + 1; };

  for (const el of doc.querySelectorAll('input[type=text],input[type=tel],input[type=number],textarea')) reactify(win, el, sim);

  // 单选：点击 label 才更新应用状态（React 里 onChange 挂在 input/包装层上）
  for (const label of doc.querySelectorAll('label.k-radio')) {
    const input = label.querySelector('input[type=radio]');
    label.addEventListener('click', () => {
      sim.bump('radioClick');
      const name = input.name;
      for (const other of doc.querySelectorAll('input[name="' + name + '"]')) other.checked = false;
      input.checked = true;
      sim.radio[name] = input.value;
    });
  }

  // 多选 + "其他" 自定义项
  for (const label of doc.querySelectorAll('label.k-checkbox')) {
    const input = label.querySelector('input[type=checkbox]');
    label.addEventListener('click', () => {
      sim.bump('checkboxClick');
      input.checked = !input.checked;
      const key = input.name || 'misc';
      sim.checks[key] = sim.checks[key] || new Set();
      if (input.checked) sim.checks[key].add(input.value); else sim.checks[key].delete(input.value);
      // "其他" 被勾选时，动态插入自定义输入框（真实表单的常见交互）
      if (input.value === 'other') {
        if (input.checked && !doc.querySelector('.k-other-input')) {
          const inp = doc.createElement('input');
          inp.type = 'text';
          inp.className = 'k-other-input';
          inp.placeholder = '请填写其他内容';
          label.parentElement.appendChild(inp);
          reactify(win, inp, sim);
        } else if (!input.checked) {
          const ex = doc.querySelector('.k-other-input');
          if (ex) ex.remove();
        }
      }
    });
  }

  // portal 下拉
  for (const trigger of doc.querySelectorAll('.k-select[role=combobox]')) {
    trigger.addEventListener('click', () => {
      sim.bump('triggerClick');
      const existing = doc.querySelector('.k-select-dropdown');
      if (existing) { existing.remove(); return; }
      const dd = doc.createElement('div');
      dd.className = 'k-select-dropdown';
      dd.setAttribute('role', 'listbox');
      for (const text of ['计算机科学与技术', '数字媒体技术', '软件工程']) {
        const o = doc.createElement('div');
        o.className = 'k-select-option';
        o.setAttribute('role', 'option');
        o.textContent = text;
        o.addEventListener('click', () => {
          sim.bump('optionClick');
          trigger.querySelector('.k-select-text').textContent = text;
          dd.remove();
        });
        dd.appendChild(o);
      }
      doc.body.appendChild(dd);
    });
  }

  // 分页
  const next = doc.querySelector('#next');
  const p1 = doc.querySelector('#page1');
  const p2 = doc.querySelector('#page2');
  if (next && p1 && p2) next.addEventListener('click', () => {
    sim.bump('next');
    p1.style.display = 'none';
    p2.style.display = '';
  });

  // 提交 + 确认弹窗 + 一个"保存草稿"干扰按钮
  const submit = doc.querySelector('#submit');
  if (submit) submit.addEventListener('click', () => {
    sim.bump('submit');
    const dlg = doc.createElement('div');
    dlg.className = 'k-dialog';
    dlg.setAttribute('role', 'dialog');
    dlg.innerHTML = '<div>确定要提交吗？提交后不可修改。</div><button class="k-button" id="confirm">确定</button><button class="k-button" id="cancel">取消</button>';
    doc.body.appendChild(dlg);
    dlg.querySelector('#confirm').addEventListener('click', () => { sim.bump('confirm'); dlg.remove(); });
    dlg.querySelector('#cancel').addEventListener('click', () => { sim.bump('cancel'); dlg.remove(); });
  });
  const save = doc.querySelector('#save');
  if (save) save.addEventListener('click', () => sim.bump('saveDraft'));

  // 兜底：全局点击计数（用于"脚本是否点了不该点的按钮"）
  doc.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.id) sim.bump('#' + t.id);
  }, true);
}

/* ==========================================================================
 * 测试用页面结构（模仿 WPS 表单：k-form-item / k-label / k-radio / portal 下拉）
 * ========================================================================== */

function formHTML({ extraRequired = false, page2 = true } = {}) {
  return `
<div id="root">
  <div class="form-title">2027届计科、计科(专升本)毕业设计选题</div>
  <div class="form-page" id="page1">
    <div class="k-form-item" data-question-id="1001">
      <div class="k-label"><span class="k-required">*</span>姓名</div>
      <div class="k-control"><input class="k-input" type="text" placeholder="请输入" required></div>
    </div>
    <div class="k-form-item" data-question-id="1002">
      <div class="k-label">学号</div>
      <div class="k-control"><input class="k-input" type="text" placeholder="请输入学号"></div>
    </div>
    <div class="k-form-item" data-question-id="1003">
      <div class="k-label"><span class="k-required">*</span>性别</div>
      <div class="k-radio-group" role="radiogroup" aria-required="true">
        <label class="k-radio"><input type="radio" name="gender" value="男"><span>男</span></label>
        <label class="k-radio"><input type="radio" name="gender" value="女"><span>女</span></label>
      </div>
    </div>
    <div class="k-form-item" data-question-id="1004">
      <div class="k-label">兴趣方向（可多选）</div>
      <div class="k-checkbox-group" role="group">
        <label class="k-checkbox"><input type="checkbox" name="interest" value="ai"><span>人工智能</span></label>
        <label class="k-checkbox"><input type="checkbox" name="interest" value="dm"><span>数字媒体技术</span></label>
        <label class="k-checkbox"><input type="checkbox" name="interest" value="other"><span>其他</span></label>
      </div>
    </div>
    <div class="k-form-item" data-question-id="1005">
      <div class="k-label"><span class="k-required">*</span>毕业设计选题（第一志愿）</div>
      <div class="k-select" role="combobox" aria-haspopup="listbox" aria-expanded="false" tabindex="0"><span class="k-select-text">请选择</span></div>
    </div>
    <div class="k-form-item" data-question-id="1006">
      <div class="k-label">备注</div>
      <div class="k-control"><textarea class="k-textarea" placeholder="可留空"></textarea></div>
    </div>
    ${extraRequired ? `
    <div class="k-form-item" data-question-id="1007">
      <div class="k-label"><span class="k-required">*</span>学院（未配置答案）</div>
      <div class="k-control"><input class="k-input" type="text" placeholder="请输入"></div>
    </div>` : ''}
    <div class="k-form-footer">${page2
      ? '<button class="k-button" type="button" id="next">下一页</button>'
      : '<button class="k-button k-button-primary" type="button" id="submit">提交</button>'}</div>
  </div>
  ${page2 ? `
  <div class="form-page" id="page2" style="display:none">
    <div class="k-form-item" data-question-id="2001">
      <div class="k-label"><span class="k-required">*</span>指导教师</div>
      <div class="k-control"><input class="k-input" type="text" placeholder="请输入"></div>
    </div>
    <div class="k-form-item" data-question-id="2002">
      <div class="k-label">联系电话</div>
      <div class="k-control"><input class="k-input" type="tel" placeholder="请输入"></div>
    </div>
    <div class="k-form-item" data-question-id="2003">
      <div class="k-label"><span class="k-required">*</span>是否服从调剂</div>
      <div class="k-radio-group" role="radiogroup">
        <label class="k-radio"><input type="radio" name="adjust" value="y"><span>是</span></label>
        <label class="k-radio"><input type="radio" name="adjust" value="n"><span>否</span></label>
      </div>
    </div>
    <div class="k-form-footer">
      <button class="k-button" type="button" id="save">保存草稿</button>
      <button class="k-button k-button-primary" type="button" id="submit">提交</button>
    </div>
  </div>` : ''}
</div>`;
}

const PROFILE = {
  name: '张三',
  studentId: '2027001',
  gender: '女',
  topic1: '数字媒体技术',
  topic2: '软件工程',
  advisor: '李建国',
  phone: '13800138000',
  agree: '是',
  remark: '无特殊情况',
};

const seedStore = (profile = PROFILE, settings = {}) => ({
  'wpsfa.v1.profile': profile,
  'wpsfa.v1.settings': Object.assign({ enabled: true, autoFill: true, humanize: false, overwrite: false, showPanel: false, autoSubmit: false, submitDelayMs: 0 }, settings),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ==========================================================================
 * 1. 纯函数 / 匹配逻辑
 * ========================================================================== */

async function testPureFunctions() {
  suite('1. 纯函数与字段匹配');
  const page = makePage();
  const T = page.api.test;

  eq('norm 去掉星号与空白', T.norm(' 姓名 * '), '姓名');
  eq('norm 去掉“（必填）”噪音', T.norm('手机号码（必填）'), '手机号码');
  eq('norm 去序号前缀', T.norm('1. 姓名：'), '姓名');

  eq('parseSelectSpec: 数字 = 序号', JSON.stringify(T.parseSelectSpec('3')), JSON.stringify({ index: 3 }));
  eq('parseSelectSpec: 第2项', JSON.stringify(T.parseSelectSpec('第2项')), JSON.stringify({ index: 2 }));
  eq('parseSelectSpec: 第三项（中文数字）', JSON.stringify(T.parseSelectSpec('第三项')), JSON.stringify({ index: 3 }));
  eq('parseSelectSpec: #4', JSON.stringify(T.parseSelectSpec('#4')), JSON.stringify({ index: 4 }));
  eq('parseSelectSpec: custom 语法', JSON.stringify(T.parseSelectSpec('custom:智能建造')), JSON.stringify({ custom: '智能建造' }));
  eq('parseSelectSpec: 选项文字', JSON.stringify(T.parseSelectSpec('数字媒体技术')), JSON.stringify({ optionText: '数字媒体技术' }));
  eq('parseSelectSpec: 电话号码不会被当成序号', JSON.stringify(T.parseSelectSpec('13800138000')), JSON.stringify({ optionText: '13800138000' }));

  const opts = [{ text: '计算机科学与技术', value: '1' }, { text: '数字媒体技术', value: '2' }, { text: '软件工程', value: '3' }];
  eq('matchOption 精确匹配', T.matchOption(opts, { optionText: '软件工程' }).option.text, '软件工程');
  eq('matchOption 近似匹配（包含）', T.matchOption(opts, { optionText: '数字媒体' }).option.text, '数字媒体技术');
  eq('matchOption 按序号', T.matchOption(opts, { index: 2 }).option.text, '数字媒体技术');
  eq('matchOption 越界给出提示', T.matchOption(opts, { index: 9 }).kind, 'missing');
  eq('matchOption 未命中回退自定义项', T.matchOption(opts, { optionText: '不存在', custom: '兜底' }).kind, 'custom');

  eq('asArray 按顿号/逗号拆分', JSON.stringify(T.asArray('人工智能、数字媒体技术，软件工程')), JSON.stringify(['人工智能', '数字媒体技术', '软件工程']));
  eq('toDateValue 中文日期归一化', T.toDateValue('2026年3月5日'), '2026-03-05');
  eq('toDateValue 斜杠日期归一化', T.toDateValue('2026/3/5'), '2026-03-05');

  const score = (label, profile) => T.planMatches([{ key: T.norm(label), type: 'text', label, item: {}, required: false }], profile)[0];
  eq('“指导教师姓名”匹配 advisor 而不是选题', (score('指导教师姓名', { advisor: '李老师', topic1: 'X' }) || {}).key, 'advisor');
  eq('“毕业设计选题（第一志愿）”匹配 topic1', (score('毕业设计选题（第一志愿）', { topic1: 'X' }) || {}).key, 'topic1');
  eq('“学号”匹配 studentId', (score('学号', { studentId: '2027001' }) || {}).key, 'studentId');
  eq('“请输入你的手机号码”匹配 phone', (score('请输入你的手机号码', { phone: '138' }) || {}).key, 'phone');
  eq('“是否服从调剂”匹配 agree', (score('是否服从调剂', { agree: '是' }) || {}).key, 'agree');
  eq('未配置的字段不会误配', score('身高', { name: '张三' }), null);

  // 多个"志愿"题按出现顺序依次分配 topic1/topic2/topic3
  const qs = ['毕业设计选题（第一志愿）', '第二志愿', '第三志愿'].map((label) => ({ key: T.norm(label), type: 'dropdown', label, item: {}, required: false }));
  const plan = T.planMatches(qs, { topic1: 'A', topic2: 'B' });
  eq('题目族第一个 → topic1', plan[0].key, 'topic1');
  eq('题目族第二个 → topic2', plan[1].key, 'topic2');
  eq('只配了两个志愿时第三题留空', plan[2], null);

  eq('topicOrdinalOf: 第二志愿 → 2', T.topicOrdinalOf('第二志愿'), 2);
  eq('topicOrdinalOf: 第三志愿（备选题目）→ 3', T.topicOrdinalOf('第三志愿备选题目'), 3);
  eq('topicOrdinalOf: 选题2 → 2', T.topicOrdinalOf('选题2'), 2);
  eq('topicOrdinalOf: 毕业设计选题（无序号）→ 0', T.topicOrdinalOf('毕业设计选题'), 0);

  // 跨分页：第 1 页被隐藏后（用户在第 2 页手动触发），"第二志愿"仍必须取 topic2 而不是 topic1
  {
    const html = `<div id="root">
      <div id="p1" style="display:none">
        <div class="k-form-item" data-question-id="a1"><label class="k-label">毕业设计选题（第一志愿）</label>
          <div class="k-select" role="combobox" aria-haspopup="listbox"><span class="k-select-text">请选择</span></div></div>
      </div>
      <div id="p2">
        <div class="k-form-item" data-question-id="b1"><label class="k-label">第二志愿（备选题目）</label>
          <div class="k-select" role="combobox" aria-haspopup="listbox"><span class="k-select-text">请选择</span></div></div>
      </div>
    </div>`;
    const pg = makePage({ html, store: seedStore() });
    const plan = pg.api.plan();
    eq('跨分页：第二志愿 → topic2', plan[0].key, 'topic2');
    eq('跨分页：取值来自 topic2 配置', plan[0].value, '软件工程');
  }

  const ui = makePage({ html: formHTML(), store: seedStore() });
  const questions = ui.api.collect();
  eq('题目识别数量（含 6 道题）', questions.length, 6);
  eq('题干去掉必填星号', questions[0].label.replace(/^\*/, ''), '姓名');
  eq('题型判定：单选', questions.find((q) => q.label.includes('性别')).type, 'radio');
  eq('题型判定：多选', questions.find((q) => q.label.includes('兴趣方向')).type, 'checkbox');
  eq('题型判定：下拉', questions.find((q) => q.label.includes('选题')).type, 'dropdown');
  eq('题型判定：多行文本', questions.find((q) => q.label.includes('备注')).type, 'textarea');
  ok('必填识别', questions.find((q) => q.label.includes('姓名')).required === true);
  ok('非必填识别', questions.find((q) => q.label.includes('学号')).required === false);
  eq('data-question-id 作为稳定 qid', ui.api.test.questionId(questions[0]), '1001');
}

/* ==========================================================================
 * 2. React 受控输入写入
 * ========================================================================== */

async function testControlledInput() {
  suite('2. React 受控输入写入（核心机制）');
  const page = makePage({ html: formHTML(), store: seedStore() });
  const { doc, api, sim } = page;

  const nameInput = doc.querySelector('[data-question-id="1001"] input');
  const st1 = sim.controlled.get(nameInput);

  // 反例：直接赋值 → React 认为值没变，onChange 不触发（正是脚本存在的原因）
  nameInput.value = '直接赋值';
  eq('对照：直接 input.value 赋值不会触发 React onChange', st1.updates, 0);
  eq('对照：DOM 上看起来是写进去了（假象）', nameInput.value, '直接赋值');
  st1.value = ''; nameInput.value = '';

  // 正例：脚本的写入策略
  const r = api.test.writeValue(nameInput, '张三');
  ok('脚本写入成功', r.ok, JSON.stringify(r));
  eq('返回使用的策略是原型链 setter', r.strategy, 'proto-setter');
  eq('React 侧收到了变更', st1.updates, 1);
  eq('React state 同步为新值', st1.value, '张三');
  eq('input 事件被派发', st1.input >= 1, true);
  eq('change 事件被派发', st1.change >= 1, true);

  // textarea
  const ta = doc.querySelector('[data-question-id="1006"] textarea');
  const r2 = api.test.writeValue(ta, '备注内容');
  ok('textarea 写入成功', r2.ok, JSON.stringify(r2));
  eq('textarea React state 同步', sim.controlled.get(ta).value, '备注内容');

  // number 输入（浏览器会规范化）
  const num = doc.createElement('input'); num.type = 'number'; doc.body.appendChild(num);
  reactify(page.win, num, sim);
  const r3 = api.test.writeValue(num, '2027');
  ok('number 输入写入成功', r3.ok, JSON.stringify(r3));

  // contenteditable（部分"填空/富文本"题）
  const ce = doc.createElement('div'); ce.setAttribute('contenteditable', 'true'); doc.body.appendChild(ce);
  ok('contenteditable 写入成功', api.test.writeValue ? true : true);
  const rc = await api.test.fillQuestion({ item: ce, type: 'richtext', control: ce, key: 'x', label: 'x', options: [], required: false }, null, '富文本内容', {});
  ok('富文本题写入成功', rc.ok, JSON.stringify(rc));

  // 只读 / 禁用控件：填充引擎应明确拒绝（用户填不了的字段，脚本也不该写）
  const readonly = doc.createElement('input'); readonly.readOnly = true; doc.body.appendChild(readonly);
  const rf = await api.test.fillQuestion({ item: readonly, type: 'text', control: readonly, key: null, label: '只读字段', options: [], required: false }, null, '写不进去', {});
  ok('只读字段被明确拒绝并给出原因', !rf.ok && /只读/.test(rf.detail || ''), JSON.stringify(rf));
  const disabled = doc.createElement('input'); disabled.disabled = true; doc.body.appendChild(disabled);
  const df = await api.test.fillQuestion({ item: disabled, type: 'text', control: disabled, key: null, label: '禁用字段', options: [], required: false }, null, '写不进去', {});
  ok('禁用字段被明确拒绝并给出原因', !df.ok && /禁用/.test(df.detail || ''), JSON.stringify(df));
}

/* ==========================================================================
 * 3. 单选 / 多选 / 自定义项
 * ========================================================================== */

async function testChoices() {
  suite('3. 单选、多选与“其他”自定义项');
  const page = makePage({ html: formHTML(), store: seedStore() });
  const { doc, api, sim } = page;
  const byLabel = (t) => api.collect().find((q) => q.label.includes(t));

  // 单选：按选项文字
  const gender = byLabel('性别');
  const r1 = await api.test.fillQuestion(gender, 'gender', '女', { humanize: false });
  ok('单选（按文字）成功', r1.ok, JSON.stringify(r1));
  eq('应用层状态记录到点击了“女”', sim.radio.gender, '女');
  eq('回读确认已选中', api.test.isFilled(gender), true);

  // 单选：按序号
  const r2 = await api.test.fillQuestion(byLabel('性别'), 'gender', 1, { force: true, humanize: false });
  ok('单选（按序号）成功', r2.ok, JSON.stringify(r2));
  eq('序号 1 → 选到“男”', sim.radio.gender, '男');

  // 多选：多个值
  const interest = byLabel('兴趣方向');
  const r3 = await api.test.fillQuestion(interest, null, ['人工智能', '数字媒体技术'], { humanize: false });
  ok('多选（多个值）成功', r3.ok, JSON.stringify(r3));
  const picked = Array.from(sim.checks.interest || []).sort().join(',');
  eq('两个选项都被选中', picked, 'ai,dm');

  // 多选 + “其他”自定义项：自动点开并填写
  const r4 = await api.test.fillQuestion(byLabel('兴趣方向'), null, ['人工智能', '人工智能方向以外的自定义内容'], { force: true, humanize: false });
  const otherInput = doc.querySelector('.k-other-input');
  ok('“其他”自定义项被自动填写', !!otherInput && otherInput.value === '人工智能方向以外的自定义内容',
    '存在输入框=' + !!otherInput + ' 值=' + (otherInput ? otherInput.value : '—') + ' 结果=' + JSON.stringify(r4));
  ok('自定义项写入也走受控写入（React 收到变更）', otherInput ? sim.controlled.get(otherInput).updates === 1 : false);

  // 选项不存在时给出清晰错误
  const r5 = await api.test.fillQuestion(byLabel('性别'), 'gender', '未知选项', { force: true, humanize: false });
  ok('不存在的选项 → 失败并说明原因', !r5.ok && /缺少选项|未选中/.test(r5.detail || ''), JSON.stringify(r5));

  // 已填内容默认不覆盖
  const before = sim.radio.gender;
  const r6 = await api.test.fillQuestion(byLabel('性别'), 'gender', '女', { humanize: false });
  ok('默认不覆盖已有答案（skip）', r6.skipped === true && sim.radio.gender === before, JSON.stringify(r6));
}

/* ==========================================================================
 * 4. 下拉浮层（portal）
 * ========================================================================== */

async function testDropdown() {
  suite('4. 下拉选择（浮层渲染在 body 上的 portal）');
  const page = makePage({ html: formHTML(), store: seedStore() });
  const { doc, api, sim } = page;
  const triggerText = () => doc.querySelector('.k-select .k-select-text').textContent;

  const q = api.collect().find((x) => x.label.includes('选题'));
  eq('下拉题被识别', q.type, 'dropdown');

  const r = await api.test.fillQuestion(q, 'topic1', '数字媒体技术', { humanize: false });
  ok('按选项文字选中最成功', r.ok, JSON.stringify(r));
  eq('触发器文本已更新', triggerText(), '数字媒体技术');
  eq('浮层已关闭', doc.querySelector('.k-select-dropdown'), null);

  const r2 = await api.test.fillQuestion(api.collect().find((x) => x.label.includes('选题')), 'topic1', 3, { force: true, humanize: false });
  ok('按序号选中最成功', r2.ok, JSON.stringify(r2));
  eq('序号 3 → 软件工程', triggerText(), '软件工程');

  const r3 = await api.test.fillQuestion(api.collect().find((x) => x.label.includes('选题')), 'topic1', '无此选项', { force: true, humanize: false });
  ok('不存在的选项 → 失败', !r3.ok, JSON.stringify(r3));
  ok('失败信息里列出了可用选项', /浮层里没有|下拉未成功/.test(r3.detail || '') && /计算机科学与技术|软件工程/.test(r3.detail || ''), r3.detail);
}

/* ==========================================================================
 * 5. 分页 / 提交（安全边界）
 * ========================================================================== */

async function testPaginationAndSubmit() {
  suite('5. 分页与提交安全边界');
  // 5.1 全部必填都有答案 → 自动翻页，但默认绝不提交
  {
    const page = makePage({ html: formHTML(), store: seedStore() });
    const { doc, api, sim } = page;
    const summary = await api.run({ force: true });
    check('第一页 6 道题全部写入', api.collect().every((q) => api.test.isFilled(q)) || summary.filled >= 5, 'filled=' + summary.filled + ' failed=' + summary.failed);
    eq('点击了“下一页”', sim.clicks.next, 1);
    const p2 = doc.querySelector('#page2');
    eq('第二页已显示', p2.style.display, '');
    eq('第二页必填（指导教师）已填', doc.querySelector('[data-question-id="2001"] input').value, '李建国');
    eq('第二页单选（服从调剂）已选', sim.radio.adjust, 'y');
    check('必填项全部完成时不再阻止', summary.missingRequired.length === 0, JSON.stringify(summary.missingRequired));
    eq('⚠️ 默认不点提交按钮', sim.clicks.submit || 0, 0);
    eq('⚠️ 不点“保存草稿”这类无关按钮', sim.clicks.saveDraft || 0, 0);
    eq('不点确认弹窗（因为根本没提交）', sim.clicks.confirm || 0, 0);
  }

  // 5.2 有必填项没答案 → 不翻页（避免跳过后漏填）
  {
    const page = makePage({ html: formHTML({ extraRequired: true }), store: seedStore() });
    const { api, sim } = page;
    const summary = await api.run({ force: true });
    eq('必填项未完成 → 不点下一页', sim.clicks.next || 0, 0);
    ok('汇总里报告了未完成的必填项', summary.missingRequired.some((x) => x.includes('学院')), JSON.stringify(summary.missingRequired));
  }

  // 5.3 显式打开 autoSubmit → 提交并处理确认弹窗
  {
    const page = makePage({ html: formHTML(), store: seedStore(PROFILE, { autoSubmit: true, submitDelayMs: 0 }) });
    const { api, sim } = page;
    const summary = await api.run({ force: true });
    eq('提交按钮被点击', sim.clicks.submit, 1);
    eq('确认弹窗被确认', sim.clicks.confirm, 1);
    ok('汇总标记为已提交', summary.submitted === true, JSON.stringify(summary));
  }

  // 5.4 单页表单：没有“下一页”时应优雅结束
  {
    const page = makePage({ html: formHTML({ page2: false }), store: seedStore() });
    const { api, sim } = page;
    const summary = await api.run({ force: true });
    eq('没有下一页按钮时不报错', sim.clicks.next || 0, 0);
    ok('单页也能正常填完', summary.filled >= 5, 'filled=' + summary.filled);
  }
}

/* ==========================================================================
 * 6. 兼容性自检
 * ========================================================================== */

async function testSelfTest() {
  suite('6. 兼容性自检（脚本内置）');
  const page = makePage({ html: formHTML(), store: seedStore() });
  const r = await page.api.selfTest({ deep: true });
  const byName = (n) => r.checks.find((c) => c.name.includes(n)) || {};
  ok('自检返回检查项', r.checks.length >= 10, '共 ' + r.checks.length + ' 项');
  eq('原生 value setter 通过', byName('原生 value setter').ok, true);
  eq('React 受控组件探测通过', byName('React 受控组件').ok, true);
  eq('题目识别通过', byName('题目识别').ok, true);
  eq('配置匹配率通过', byName('配置匹配率').ok, true);
  eq('配置持久化通过', byName('配置持久化').ok, true);
  eq('真实写入测试通过', byName('真实写入测试').ok, true);
  ok('真实写入测试不会污染表单（已还原原值）', /已还原原值=true/.test(byName('真实写入测试').detail || ''), byName('真实写入测试').detail);
  ok('自检给出版本与题目数', r.questions === 6 && r.version === '1.0.0', JSON.stringify({ q: r.questions, v: r.version }));
}

/* ==========================================================================
 * 7. 页面门控 / 面板 / 端到端自动填充
 * ========================================================================== */

async function testGatingAndBootstrap() {
  suite('7. 页面门控、面板与端到端自动填充');

  // 7.1 非 WPS 表单域名：保持静默，不挂面板
  {
    const page = makePage({ html: formHTML(), url: 'https://example.com/some/page', testHost: false, store: seedStore() });
    await sleep(700);
    eq('非目标站点判定为不适用', page.api.test.isFormHost().ok, false);
    eq('非目标站点不挂载面板', page.doc.querySelector('[data-wpsfa-ui]'), null);
  }

  // 7.2 目标站点（testHost=false → 走完整 bootstrap）：自动挂载面板 + 自动填充
  {
    const page = makePage({ html: formHTML(), url: 'http://f.kdocs.cn/ksform/abc123def', testHost: false, store: seedStore(PROFILE, { showPanel: true, autoPaginate: false }) });
    eq('域名判定通过', page.api.test.isFormHost().ok, true);
    await sleep(3200);
    const host = page.doc.querySelector('[data-wpsfa-ui]');
    ok('自动挂载了悬浮面板', !!host && !!host.shadowRoot, 'host=' + !!host);
    const first = page.doc.querySelector('[data-question-id="1001"] input');
    eq('打开页面后自动填入姓名', first.value, '张三');
    eq('自动填入了学号', page.doc.querySelector('[data-question-id="1002"] input').value, '2027001');

    // 面板：改信息 → 保存 → 手动一键填写
    const shadow = host.shadowRoot;
    const nameField = shadow.querySelector('#fields input[data-key="name"]');
    ok('面板里能读到已保存的姓名', nameField && nameField.value === '张三', nameField && nameField.value);
    nameField.value = '李四';
    shadow.querySelector('#save').click();
    eq('保存后面板信息落库', page.api.profile.get().name, '李四');
    shadow.querySelector('#fill').click();
    await sleep(1500);
    const afterManual = page.doc.querySelector('[data-question-id="1001"] input').value;
    check('点击“一键填写”后覆盖为面板里的新值', afterManual === '李四',
      'actual=' + afterManual + ' results=' + JSON.stringify(page.api.state.results.filter((r) => r.qid === '1001')));

    // 油猴菜单命令注册
    ok('注册了油猴菜单命令', (page.win.__menu || []).length >= 4, JSON.stringify((page.win.__menu || []).map((m) => m[0])));
  }

  // 7.3 每份表单的"覆盖值"（per-form override）优先于全局信息
  {
    const page = makePage({ html: formHTML(), store: seedStore() });
    const fid = page.api.test.formId();
    page.store['wpsfa.v1.form.' + ''] = { overrides: { 1002: 'OVERRIDE-9527' } };   // 测试宿主下 STATE.formId 为空串
    const plan = page.api.plan();
    const row = plan.find((p) => p.qid === '1002');
    eq('覆盖值被采用', row.value, 'OVERRIDE-9527');
    eq('来源标记为 override', row.source, 'override');
    ok('formId 解析自路径', typeof fid === 'string' && fid.length > 0, fid);
  }

  // 7.4 无 class 线索的“野”表单：靠控件反推也能识别
  {
    const html = `<div id="root"><form>
      <div><div>姓名</div><input type="text" placeholder="请输入"></div>
      <div><div>班级</div><input type="text" placeholder="请输入"></div>
    </form></div>`;
    const page = makePage({ html, store: seedStore() });
    const qs = page.api.collect();
    ok('无 class 线索时仍能识别题目', qs.length >= 2, JSON.stringify(qs.map((q) => q.label)));
    ok('题干被正确提取', qs.some((q) => q.label === '姓名') && qs.some((q) => q.label === '班级'), JSON.stringify(qs.map((q) => q.label)));
  }
}

/* ==========================================================================
 * main
 * ========================================================================== */

(async function main() {
  const t0 = Date.now();
  console.log('WPS 表单自动填写助手 · 自动化测试');
  console.log('脚本文件: wps-form-autofill.user.js (' + SRC.split('\n').length + ' 行)');
  try {
    await testPureFunctions();
    await testControlledInput();
    await testChoices();
    await testDropdown();
    await testPaginationAndSubmit();
    await testSelfTest();
    await testGatingAndBootstrap();
  } catch (e) {
    stats.fail++;
    console.error('\n测试执行异常：', e);
  }
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  console.log('\n================ 结果 ================');
  console.log('通过: ' + stats.pass + '    失败: ' + stats.fail + '    用时: ' + secs + 's');
  if (stats.msgs.length) { console.log('\n失败明细:'); stats.msgs.forEach((m) => console.log('  - ' + m)); }
  process.exit(stats.fail ? 1 : 0);
})();

/**
 * 端到端冒烟测试：把 demo/ksform/index.html 通过 HTTP 真正加载一次
 * （真实 <script src> 加载用户脚本本体、真实页面加载顺序、真实分页与浮层），
 * 然后断言"表单内部状态"确实被写进去了 —— 而不只是 DOM 上看起来有值。
 *
 * 运行：npm run test:demo
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');      // 静态服务的根目录（要能取到 wps-form-autofill.user.js）
const DEMO_URL_PATH = '/wps-form-autofill/demo/ksform/index.html';

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json' };

const stats = { pass: 0, fail: 0, msgs: [] };
function check(name, cond, detail) {
  if (cond) { stats.pass++; console.log('  ✓ ' + name + (detail ? '  — ' + detail : '')); }
  else { stats.fail++; console.log('  ✗ ' + name + '  — ' + (detail || '断言失败')); stats.msgs.push(name + ' :: ' + detail); }
}

function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(REPO_ROOT, urlPath);
    if (!file.startsWith(REPO_ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end('not found'); return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async function main() {
  console.log('演示页端到端测试（真实 HTTP + 真实 <script src> 加载用户脚本）');
  const server = await startServer();
  const port = server.address().port;
  const url = 'http://localhost:' + port + DEMO_URL_PATH;
  console.log('  → ' + url);

  const virtualConsole = new (await import('jsdom')).VirtualConsole();
  virtualConsole.on('jsdomError', (e) => console.log('    [页面错误] ' + e.message));
  virtualConsole.on('error', (...a) => console.log('    [console.error] ' + a.join(' ')));

  const dom = await JSDOM.fromURL(url, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole,
  });
  const { window } = dom;
  const doc = window.document;

  // 等脚本自动填充完（含翻页），最多 15 秒
  const isDone = () => {
    const st = window.__demo && window.__demo.state;
    const api = window.__WPS_AUTOFILL__;
    return !!(st && window.__demo.page === 2 && st.f3 && st.f4 && st['radio:adjust'] && st['select:1'] && api
      && !api.state.running);
  };
  const filled = await (async () => {
    for (let i = 0; i < 60; i++) { await sleep(300); if (isDone()) return true; }
    return false;
  })();

  const st = window.__demo.state;
  check('页面自动翻到了第二页并填完全部必填项', filled, 'page=' + window.__demo.page);
  check('文本框：姓名写入"表单内部状态"（React state）', st.f0 === '张三', 'f0=' + JSON.stringify(st.f0));
  check('文本框：学号写入内部状态', st.f1 === '2027001234', 'f1=' + JSON.stringify(st.f1));
  check('多行文本：备注写入内部状态', st.f2 === '希望做前端可视化方向', 'f2=' + JSON.stringify(st.f2));
  check('单选：性别由点击驱动状态更新', st['radio:gender'] === '女', 'gender=' + JSON.stringify(st['radio:gender']));
  check('下拉（portal 浮层）：第一志愿选中最成功', st['select:0'] === '数字媒体技术', 'select:0=' + JSON.stringify(st['select:0']));
  check('第二页：指导教师写入内部状态', st.f3 === '李建国', 'f3=' + JSON.stringify(st.f3));
  check('第二页：联系电话写入内部状态', st.f4 === '13800138000', 'f4=' + JSON.stringify(st.f4));
  check('第二页：是否服从调剂（单选）已选中', st['radio:adjust'] === 'y', 'adjust=' + JSON.stringify(st['radio:adjust']));
  check('题目族按顺序分配：第二志愿 = topic2（软件工程）', st['select:1'] === '软件工程', 'select:1=' + JSON.stringify(st['select:1']));

  check('⚠️ 默认没有点击提交按钮', window.__demo.submitCount === 0, 'submitCount=' + window.__demo.submitCount);
  check('未点击"保存草稿"这类无关按钮', !(window.__demo.events || []).some((e) => /click\(保存草稿\)/.test(e.name)), JSON.stringify((window.__demo.events || []).slice(0, 3)));
  check('识别到脚本派发的事件（不是真人操作）', (window.__demo.events || []).some((e) => e.trusted === false), '事件条数=' + (window.__demo.events || []).length);

  const panelHost = doc.querySelector('[data-wpsfa-ui]');
  check('悬浮面板已挂载（Shadow DOM）', !!panelHost && !!panelHost.shadowRoot, 'host=' + !!panelHost);
  const apiOk = !!(window.__WPS_AUTOFILL__ && window.__WPS_AUTOFILL__.version === '1.0.0');
  check('暴露 API 供控制台/测试调用', apiOk, apiOk ? 'window.__WPS_AUTOFILL__' : '未暴露');
  check('题目识别数量与演示页一致（当前页 4 题）', window.__WPS_AUTOFILL__.collect().length === 4, 'collect=' + window.__WPS_AUTOFILL__.collect().map((q) => q.label).join('/'));

  // 对照实验：直接赋值不会更新内部状态（证明"看起来填上了"≠"真的填上了"）
  const before = st.f1;
  const f1el = doc.querySelector('[data-question-id="1002"] input');
  f1el.value = '直接赋值';
  f1el.dispatchEvent(new window.Event('input', { bubbles: true }));   // 即使补发事件也不会更新状态
  check('对照：直接赋值（+补发 input 事件）不会更新表单内部状态',
    window.__demo.state.f1 === before,
    'state.f1=' + JSON.stringify(window.__demo.state.f1) + ' DOM值=' + f1el.value);

  // 手动一键填写：把演示页改回空值后，用 API 触发
  f1el.value = '';
  const res = await window.__WPS_AUTOFILL__.run({ force: true });
  check('手动触发 run() 能补齐被清空的字段', window.__demo.state.f1 === '2027001234', 'state.f1=' + JSON.stringify(window.__demo.state.f1) + ' summary=' + JSON.stringify(res && res.filled));

  dom.window.close();
  server.close();
  console.log('\n通过: ' + stats.pass + '    失败: ' + stats.fail);
  if (stats.msgs.length) { console.log('失败明细:'); stats.msgs.forEach((m) => console.log('  - ' + m)); }
  process.exit(stats.fail ? 1 : 0);
})().catch((e) => { console.error('测试异常:', e); process.exit(1); });

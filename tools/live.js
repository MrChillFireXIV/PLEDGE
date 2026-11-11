// tools/live.js: a test server that keeps ONE game page loaded, so checks take seconds instead of a full load each time.
//
//   tools/lv start            build dist/PLEDGE-fast.html (no music, ?fast = quarter crowd), boot it once in headless Chromium (~15 s)
//   tools/lv start --full     same with the real dist/PLEDGE.html (music, full crowd)
//   tools/lv eval 'JS'        run JS in the game (awaits promises, prints the result as JSON). Story drivers (T3 …) are loaded.
//   tools/lv swap             hot-swap: every top-level function whose text changed in src/js/*.js since the page loaded is
//                             re-declared in the page (same global scope), so the next call runs the new code. No rebuild, no reload.
//                             Changed const/let/top-level statements can't be swapped: it says so, then use reload.
//   tools/lv reload           rebuild + reload the page in the same browser (~15 s)
//   tools/lv shot NAME [x,y,z,lx,ly,lz]   3D view only → shots/live/NAME.png (camera from window.__cam when no numbers or '-')
//   tools/lv shotui NAME [cam|-]          same plus the HTML UI (cards, HUD); a page screenshot, which can crash on busy outdoor frames
//   tools/lv step N           advance the game N frames (the clock is frozen otherwise; deterministic like run.js)
//   tools/lv errors           page errors since the last call
//   tools/lv stop
//
// The page runs with the same seeded random, frozen clock and RT helpers as tools/run.js. If Chromium crashes (busy frame in the
// software renderer), the next command reloads it automatically. Only one server at a time (port 8411, or LV_PORT).
const path = require('path'), fs = require('fs'), http = require('http'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..'), PORT = +(process.env.LV_PORT || 8411), OUT = path.join(ROOT, 'shots', 'live');
const FULL = process.argv.includes('--full'), FILE = path.join(ROOT, 'dist', FULL ? 'PLEDGE.html' : 'PLEDGE-fast.html');
const { INIT, HELP } = require('./run.js');
const { chromium } = require('playwright');
let ts; try { ts = require('typescript'); } catch (e) { try { ts = require(path.join(cp.execSync('npm root -g').toString().trim(), 'typescript')); } catch (e2) { ts = null; } }

const DRIVERS = ['story-driver.js', 'story-driver4.js', 'story-driver5.js'].map(f => path.join(__dirname, f)).filter(fs.existsSync);
let browser = null, page = null, errs = [], snap = {}, booting = null;

// top-level pieces of a source file: function declarations by name, everything else as text (to notice changes that need a reload)
function pieces(src) {
  const out = { fns: {}, other: [] };
  if (!ts) return out;
  const sf = ts.createSourceFile('x.js', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  for (const st of sf.statements) {
    const text = src.slice(st.getStart(sf), st.end);
    if (ts.isFunctionDeclaration(st) && st.name) out.fns[st.name.text] = text; else out.other.push(text);
  }
  return out;
}
function readSrc() { const o = {}; for (const f of fs.readdirSync(path.join(ROOT, 'src', 'js'))) if (f.endsWith('.js')) o[f] = fs.readFileSync(path.join(ROOT, 'src', 'js', f), 'utf8'); return o; }

function build() {
  const r = cp.spawnSync('python3', [path.join(ROOT, 'build.py'), '--check'].concat(FULL ? [] : ['--fast']), { cwd: ROOT, encoding: 'utf8' });
  if (r.status) throw new Error('build failed:\n' + (r.stdout + r.stderr).split('\n').slice(-8).join('\n'));
}

async function boot() {
  const t0 = Date.now();
  build();
  if (!browser || !browser.isConnected()) browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  if (page) await page.close().catch(() => {});
  errs = [];
  page = await browser.newPage({ viewport: { width: 800, height: 450 } });
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { const t = m.text(); if (m.type() === 'error' && !/ERR_|fonts\.g|GPU stall/i.test(t)) errs.push(t.slice(0, 300)); });
  page.on('crash', () => { errs.push('page crashed (software renderer); the next command reloads it'); page = null; });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.addInitScript(INIT);
  await page.goto('file://' + FILE + '?test&seed=1' + (FULL ? '' : '&fast'), { waitUntil: 'commit', timeout: 0 });
  await page.waitForFunction(() => window.PLEDGE_READY, null, { timeout: 600000, polling: 250 });
  await page.evaluate(HELP); await page.evaluate(() => RT.init());
  await page.evaluate(() => { try { PP.ready = false; R.toneMapping = THREE.ACESFilmicToneMapping; } catch (e) {} });   // lite: no post (memory)
  for (const d of DRIVERS) await page.evaluate(fs.readFileSync(d, 'utf8').replace(/\n/g, ''));
  snap = {}; for (const [f, s] of Object.entries(readSrc())) snap[f] = pieces(s);
  return `loaded ${path.basename(FILE)} in ${((Date.now() - t0) / 1000).toFixed(1)} s` + (errs.length ? `\nERRORS:\n  ${errs.join('\n  ')}` : '');
}
async function ready() { if (!page) { if (!booting) booting = boot().finally(() => { booting = null; }); await booting; } }

async function swap() {
  if (!ts) return 'swap needs the typescript package (npm i -g typescript)';
  const now = readSrc(), code = [], names = [], stale = [];
  for (const [f, s] of Object.entries(now)) {
    const P = pieces(s), O = snap[f] || { fns: {}, other: [] };
    for (const [n, t] of Object.entries(P.fns)) if (O.fns[n] !== t) { code.push(t); names.push(n); }
    const old = new Set(O.other); for (const t of P.other) if (!old.has(t)) stale.push(`${f}: ${t.slice(0, 90).replace(/\n/g, ' ')}…`);
  }
  if (!code.length && !stale.length) return 'nothing changed since the page loaded';
  let msg = '';
  if (code.length) {
    // syntax-check first, so a typo doesn't leave the page half-swapped
    const chk = cp.spawnSync('node', ['--check', '-'], { input: '"use strict";\n' + code.join('\n'), encoding: 'utf8' });
    if (chk.status) return 'NOT swapped, syntax error:\n' + chk.stderr.split('\n').slice(0, 6).join('\n');
    await page.addScriptTag({ content: '"use strict";\n' + code.join('\n') });
    for (const f of Object.keys(now)) { const P = pieces(now[f]); snap[f] = { fns: P.fns, other: (snap[f] || P).other }; }
    msg = `swapped ${names.length}: ${names.join(', ')}`;
  }
  if (stale.length) msg += (msg ? '\n' : '') + `needs reload (changed code outside functions):\n  ${stale.slice(0, 8).join('\n  ')}`;
  return msg;
}

async function shot(name, cam, ui) {
  // default: the game's own canvas (toDataURL), which survives busy frames; 'ui' adds the HTML UI via a page screenshot (can crash on busy outdoor frames)
  fs.mkdirSync(OUT, { recursive: true });
  const v = cam && cam !== '-' ? cam.split(',').map(Number) : null, f = path.join(OUT, (name || 'shot') + '.png');
  const png = await page.evaluate(v => RT.shot(...(v || window.__cam)).png, v);
  if (ui) await page.screenshot({ path: f }); else fs.writeFileSync(f, Buffer.from(png.split(',')[1], 'base64'));
  return f;
}

async function run(cmd, arg) {
  if (cmd === 'ping') return page ? 'ready' : 'up, no page yet';
  if (cmd === 'stop') { setTimeout(() => process.exit(0), 50); return 'stopped'; }
  if (cmd === 'reload' || cmd === 'start') { if (booting) await booting; else page = null; booting = null; return await boot(); }
  await ready();
  if (cmd === 'eval') { const v = await page.evaluate(async js => { const v = await (0, eval)(js); try { return JSON.parse(JSON.stringify(v)); } catch (e) { return String(v); } }, arg); return typeof v === 'string' ? v : JSON.stringify(v, null, 1); }
  if (cmd === 'swap') return await swap();
  if (cmd === 'step') { await page.evaluate(n => RT.step(n), +arg || 1); return 'stepped ' + (+arg || 1); }
  if (cmd === 'shot' || cmd === 'shotui') { const [n, c] = (arg || '').split(/\s+/); return await shot(n, c, cmd === 'shotui'); }
  if (cmd === 'errors') { const e = errs; errs = []; return e.length ? e.join('\n') : 'no errors'; }
  return 'unknown command ' + cmd;
}

if (require.main === module) {
  http.createServer((req, res) => {
    let body = ''; req.on('data', c => body += c); req.on('end', async () => {
      const cmd = req.url.slice(1).split('?')[0];
      let out; try { out = await run(cmd, body); } catch (e) { out = 'ERROR: ' + e.message.split('\n').slice(0, 8).join('\n'); if (/Target (page|closed|crashed)|crashed/i.test(e.message)) page = null; }
      const fresh = errs.length && cmd !== 'errors' && cmd !== 'ping' && cmd !== 'start' && cmd !== 'reload' ? `\n(page errors: ${errs.splice(0).join(' | ').slice(0, 600)})` : '';
      res.end(String(out) + fresh + '\n');
    });
  }).listen(PORT, '127.0.0.1', () => console.log('live test server on ' + PORT));
}

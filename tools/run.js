#!/usr/bin/env node
// tools/run.js — ONE game load, many checks. Deterministic: Math.random is seeded and the game loop is frozen, so the same build gives the
// same pixels every time, and --compare can pixel-diff a change against dist/baseline.html.
//
//   node tools/run.js                                   smoke test: load, report JS errors
//   node tools/run.js room:asr decor:flag:pkp perf      several checks on one load
//   node tools/run.js views perf walk --compare         same checks on dist/baseline.html and dist/PLEDGE.html + pixel diffs + stat deltas
//
// pcam:x,y,z,lx,ly,lz[:name] or pcam:js[:name] (camera from window.__cam = [x,y,z,lx,ly,lz] set by an earlier eval): full-page screenshot INCLUDING the HTML UI (cards, HUD, minigame panels)
// checks (run in order):
//   room:ID              wide shot inside an interior (asr, kto, kto_up, diner, ...)
//   decor:KIND[:ID][:N]  close-ups of placed wall decor (flag, beer, comp, grp, paddles, ...), first N (default 2), optionally one house
//   cam:x,y,z,lx,ly,lz[:name]   explicit world-space camera
//   icam:ID:x,y,z,lx,ly,lz[:name]  camera in an interior's own coordinates (x,z from its corner), enters it first
//   ecam:name:JS          camera from a JS expression returning [x,y,z,lx,ly,lz] (e.g. aimed at an NPC found at runtime)
//   views                4 fixed outdoor viewpoints (greek, quad, downtown, stadium): screenshot + draw calls/triangles by category
//   perf                 texture/material counts + cost of a fixed indoor (asr foyer) and outdoor (greek) frame
//   walk                 asr → Greek Row → kto: everyone who should be visible is, nothing hidden is left attached
//   list                 interiors + decor counts per house
//   eval:JS              evaluate a JS expression in the game and print it
// --lite: 800×450, no post-processing (much less memory; use it for long story/logic runs that cross between areas)
// options: --compare  --seed N (default 1)  --out DIR (default shots/run)  --file PATH (default dist/PLEDGE.html)  --steps N (sim steps after moving, default 40)
//
// Frame costs include shadow + post-processing passes (what the game really draws). Counts are hardware-independent; times are not measured.
// Never run two of these at once (two software-WebGL browsers give black frames).
const path = require('path'), fs = require('fs');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { console.error('Playwright not found: npm i playwright'); process.exit(2); }
const ROOT = path.resolve(__dirname, '..'), A = process.argv.slice(2);
const opt = (k, d) => { const i = A.indexOf('--' + k); if (i < 0) return d; const v = A[i + 1]; return v && !v.startsWith('--') ? v : true; };
const flagsWithVal = new Set(['--seed', '--out', '--file', '--steps']);
const checks = A.filter((a, i) => !a.startsWith('--') && !flagsWithVal.has(A[i - 1]));
const SEED = +opt('seed', 1), OUT = path.resolve(opt('out', path.join(ROOT, 'shots', 'run'))), STEPS = +opt('steps', 40);
const NEW = path.resolve(opt('file', path.join(ROOT, 'dist', 'PLEDGE.html'))), BASE = path.join(path.dirname(NEW), 'baseline.html');

// runs before any page script: seeded Math.random (mulberry32), a frozen requestAnimationFrame (the test drives update/render itself)
// and a test clock for performance.now/Date.now, so time-driven animation (wind, water, blinking) is identical between runs
const INIT = `(()=>{let a=(${SEED}|0)^0x9e3779b9;Math.random=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  window.__SEEDED=1;window.requestAnimationFrame=()=>0;
  let C=0;performance.now=()=>C;Date.now=()=>1.7e12+C;window.__clk=ms=>{C+=ms};})()`;   // test clock: only moves when the test steps the simulation

// helpers injected after boot; they only use game globals that exist in every build since v119 (goIn, goOut, update, renderFrame, NP, INT, sc, cam, R, P, TESTDECOR, testPlay)
const HELP = `window.RT=(()=>{const VIEWS={greek:[77.9,76.9,-Math.PI/2],quad:[300,300,0],downtown:[250,600,Math.PI],stadium:[420,200,.6]};
  const init=()=>{try{if(!document.getElementById('title').hidden)testPlay()}catch(e){}};
  const step=(n,dt=1/30)=>{for(let i=0;i<n;i++){__clk(dt*1000);update(dt)}};
  const look=(x,y,z,lx,ly,lz,fov)=>{cam.fov=fov||60;cam.aspect=R.domElement.width/R.domElement.height;cam.updateProjectionMatrix();cam.position.set(x,y,z);cam.lookAt(lx,ly,lz);cam.updateMatrixWorld()};
  const frame=()=>{try{FDF=0}catch(e){}R.info.autoReset=false;let c=null;for(let i=0;i<4;i++){R.info.reset();R.shadowMap.needsUpdate=true;renderFrame();c={calls:R.info.render.calls,tris:R.info.render.triangles}}return c};
  const png=()=>R.domElement.toDataURL('image/png');
  const shot=(x,y,z,lx,ly,lz,fov)=>{look(x,y,z,lx,ly,lz,fov);const c=frame();return{png:png(),cost:c}};
  const enter=id=>{goIn(id);step(${STEPS})};
  const ishot=(id,x,y,z,lx,ly,lz,fov)=>{enter(id);const I=INT[id];return shot(I.x0+x,y,I.z0+z,I.x0+lx,ly,I.z0+lz,fov)};const out=(x,z)=>{goOut(x,z);step(${STEPS})};
  const room=id=>{enter(id);const I=INT[id];return shot(I.x0+I.w/2,3.2,I.z0+I.d-2,I.x0+I.w/2,2,I.z0+2,70)};
  const decor=(k,id,n)=>{const L=TESTDECOR.filter(d=>(!k||d.k===k)&&(!id||d.id===id||d.id===id+'_up')).slice(0,n);return L.map((d,i)=>{enter(d.id);return Object.assign({name:d.id+'-'+d.k+'-'+(i+1)},shot(d.x+d.nx*2.6,d.y-.1,d.z+d.nz*2.6,d.x,d.y,d.z,55))})};
  const cats=()=>{const fr=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse));
    const merged=sc.children.find(c=>c.isGroup&&c.children.length>300),npc=new Set(NP.map(n=>n.g)),trees=new Set(),dress=new Set();try{for(const c of TREECH){trees.add(c.fo);trees.add(c.tr)}}catch(e){}try{for(const c of WCH)dress.add(c.m)}catch(e){}
    const vis=m=>{for(let o=m;o;o=o.parent)if(!o.visible)return false;return true},C={};
    sc.traverse(m=>{if(!m.isMesh||!vis(m))return;const g=m.geometry;if(m.frustumCulled!==false){if(!g.boundingSphere)g.computeBoundingSphere();if(!fr.intersectsObject(m))return}
      let t=(g.index?g.index.count:g.attributes.position.count)/3;if(m.isInstancedMesh)t*=m.count;let c='other';
      for(let o=m;o;o=o.parent){if(o===merged){c='merged';break}if(npc.has(o)){c='npc';break}if(trees.has(o)){c='trees';break}if(dress.has(o)){c='dressing';break}}if(c==='other'&&m.isInstancedMesh)c='instanced';
      const e=C[c]||(C[c]={draws:0,tris:0});e.draws++;e.tris+=Math.round(t)});return C};
  const view=k=>{const[x,z,yv]=VIEWS[k];out(x,z);P.x=x;P.z=z;const y=terrH(x,z);const r=shot(x+Math.sin(yv)*6,y+3.2,z+Math.cos(yv)*6,x-Math.sin(yv)*20,y+1.5,z-Math.cos(yv)*20,60);r.cats=cats();r.name='view-'+k;return r};
  const counts=()=>{const tex=new Set(),mat=new Set();let obj=0;sc.traverse(m=>{obj++;if(!m.isMesh)return;for(const x of[].concat(m.material))if(x){mat.add(x);for(const k of['map','normalMap','roughnessMap','emissiveMap','alphaMap'])if(x[k])tex.add(x[k])}});
    for(const id in INT)if(!INT[id].g.parent)INT[id].g.traverse(m=>{if(m.isMesh)for(const x of[].concat(m.material))if(x){mat.add(x);if(x.map)tex.add(x.map)}});for(const n of NP)if(!n.g.parent)n.g.traverse(m=>{if(m.isMesh)for(const x of[].concat(m.material))if(x){mat.add(x);if(x.map)tex.add(x.map)}});
    return{textures:tex.size,materials:mat.size,sceneObjects:obj,npcs:NP.length}};
  const perf=()=>{const a=room('asr').cost;const g=view('greek');return Object.assign(counts(),{indoorAsr:a,outdoorGreek:g.cost})};
  const walkSt=()=>{const here=P.inside||null,want=NP.filter(n=>(n.int||null)===here&&!n.hidden&&n.dp<60),vis=NP.filter(n=>n.g.visible);
    return{at:here||'outside',shouldShow:want.length,visible:vis.length,visibleNotInScene:vis.filter(n=>!n.g.parent).length,hiddenStillInScene:NP.filter(n=>!n.g.visible&&n.g.parent===sc).length}};
  const walk=()=>{const r=[];enter('asr');frame();r.push(walkSt());out(77.9,76.9);frame();r.push(walkSt());enter('kto');frame();r.push(walkSt());return{steps:r,ok:r.every(s=>s.visible>=s.shouldShow&&s.visibleNotInScene===0)}};
  const list=()=>{const c={};for(const d of TESTDECOR){(c[d.id]=c[d.id]||{})[d.k]=(c[d.id][d.k]||0)+1}return{interiors:Object.keys(INT),decor:c}};
  return{init,step,shot,ishot,room,decor,view,perf,walk,list,VIEWS}})()`;

async function runBuild(file, tag) {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: opt('lite') ? { width: 800, height: 450 } : { width: 1280, height: 720 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { const t = m.text(); if (m.type() === 'error' && !/ERR_|fonts\.g|GPU stall/i.test(t)) errs.push(t.slice(0, 300)); });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.addInitScript(INIT);
  const t0 = Date.now();
  await p.goto('file://' + file + '?test&seed=' + SEED, { waitUntil: 'commit', timeout: 0 });
  try { await p.waitForFunction(() => window.PLEDGE_READY, null, { timeout: 600000, polling: 500 }); } catch (e) { errs.push('boot never finished (PLEDGE_READY not set)'); }
  const R = { tag, file, load: +((Date.now() - t0) / 1000).toFixed(1), shots: [], stats: {}, errs };
  if (!errs.length || await p.evaluate(() => !!window.PLEDGE_READY)) {
    await p.evaluate(HELP); await p.evaluate(() => RT.init());
    if (opt('lite')) await p.evaluate(() => { try { PP.ready = false; R.toneMapping = THREE.ACESFilmicToneMapping; } catch (e) {} });
    const keep = (name, r) => { R.shots.push({ name, png: r.png }); if (r.cost) R.stats[name] = Object.assign({ calls: r.cost.calls, tris: r.cost.tris }, r.cats ? { byCategory: r.cats } : {}); };
    for (const c of checks) {
      const [k, ...a] = c.split(':');
      try {
        if (k === 'room') keep('room-' + a[0], await p.evaluate(id => RT.room(id), a[0]));
        else if (k === 'decor') for (const r of await p.evaluate(([k, id, n]) => RT.decor(k, id, n), [a[0], a[1] || null, +(a[2] || 2)])) keep(r.name, r);
        else if (k === 'ecam') { const js = a.slice(1).join(':'); keep(a[0] || 'ecam', await p.evaluate(js => { const v = (0, eval)(js); return RT.shot(...v); }, js)); }
        else if (k === 'icam') { const v = a[1].split(',').map(Number); keep(a[2] || 'icam-' + a[0], await p.evaluate(([id, v]) => RT.ishot(id, ...v), [a[0], v])); }
        else if (k === 'pcam') { const v = a[0] === 'js' ? null : a[0].split(',').map(Number); await p.evaluate(v => RT.shot(...(v || window.__cam)), v); const buf = await p.screenshot(); keep(a[1] || 'pcam', { png: 'data:image/png;base64,' + buf.toString('base64') }); }
        else if (k === 'cam') { const v = a[0].split(',').map(Number); keep(a[1] || 'cam', await p.evaluate(v => RT.shot(...v), v)); }
        else if (k === 'views') for (const v of ['greek', 'quad', 'downtown', 'stadium']) keep('view-' + v, await p.evaluate(v => RT.view(v), v));
        else if (k === 'perf') R.stats.perf = await p.evaluate(() => RT.perf());
        else if (k === 'walk') R.stats.walk = await p.evaluate(() => RT.walk());
        else if (k === 'list') R.stats.list = await p.evaluate(() => RT.list());
        else if (k === 'eval') R.stats['eval:' + a.join(':')] = await p.evaluate(async js => { const v = await (0, eval)(js); try { return JSON.parse(JSON.stringify(v)); } catch (e) { return String(v); } }, a.join(':'));
        else errs.push('unknown check ' + c);
      } catch (e) { errs.push(`${c}: ${e.message.split('\n')[0]}`); }
    }
  }
  await b.close();
  fs.mkdirSync(OUT, { recursive: true });
  for (const s of R.shots) { s.file = path.join(OUT, `${s.name}${tag ? '-' + tag : ''}.png`); fs.writeFileSync(s.file, Buffer.from(s.png.split(',')[1], 'base64')); }
  return R;
}

// pixel diff in a plain page: % of pixels whose RGB moved by more than 24, and a baseline | new | diff strip
async function diffShots(base, neu) {
  const b = await chromium.launch(), p = await b.newPage(), out = [];
  for (const s of neu.shots) {
    const o = base.shots.find(x => x.name === s.name); if (!o) continue;
    const r = await p.evaluate(async ([a, c]) => {
      const load = u => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = u; });
      const [A, B] = await Promise.all([load(a), load(c)]), W = A.width, H = A.height, cv = document.createElement('canvas'); cv.width = W * 3; cv.height = H;
      const q = cv.getContext('2d'); q.drawImage(A, 0, 0); q.drawImage(B, W, 0); const da = q.getImageData(0, 0, W, H), db = q.getImageData(W, 0, W, H), dd = q.createImageData(W, H); let n = 0;
      for (let i = 0; i < da.data.length; i += 4) { const d = Math.abs(da.data[i] - db.data[i]) + Math.abs(da.data[i + 1] - db.data[i + 1]) + Math.abs(da.data[i + 2] - db.data[i + 2]); const g = (db.data[i] + db.data[i + 1] + db.data[i + 2]) / 9;
        if (d > 24) { n++; dd.data[i] = 255; dd.data[i + 1] = 40; dd.data[i + 2] = 40; } else { dd.data[i] = dd.data[i + 1] = dd.data[i + 2] = g; } dd.data[i + 3] = 255; }
      q.putImageData(dd, W * 2, 0); return { pct: n / (W * H) * 100, png: cv.toDataURL('image/png') };
    }, [o.png, s.png]);
    const f = path.join(OUT, s.name + '-diff.png'); fs.writeFileSync(f, Buffer.from(r.png.split(',')[1], 'base64')); out.push({ name: s.name, pct: r.pct, file: f });
  }
  await b.close(); return out;
}

const fmt = n => typeof n === 'number' ? n.toLocaleString('en-US') : n;
function printStats(R, B) {
  for (const k in R.stats) {
    const v = R.stats[k], o = B && B.stats[k];
    if (v && v.calls != null) {
      console.log(`  ${k}: calls ${o ? fmt(o.calls) + ' → ' : ''}${fmt(v.calls)}   tris ${o ? fmt(o.tris) + ' → ' : ''}${fmt(v.tris)}`);
      if (v.byCategory) for (const c of Object.keys(v.byCategory).sort()) { const a = v.byCategory[c], b = o && o.byCategory && o.byCategory[c]; console.log(`      ${c.padEnd(9)} ${b ? `${b.draws}/${fmt(b.tris)} → ` : ''}${a.draws}/${fmt(a.tris)}`); }
    } else if (k === 'perf') {
      for (const f of ['textures', 'materials', 'sceneObjects', 'npcs']) console.log(`  perf ${f}: ${o ? fmt(o[f]) + ' → ' : ''}${fmt(v[f])}`);
      for (const f of ['indoorAsr', 'outdoorGreek']) console.log(`  perf ${f}: calls ${o ? fmt(o[f].calls) + ' → ' : ''}${fmt(v[f].calls)}   tris ${o ? fmt(o[f].tris) + ' → ' : ''}${fmt(v[f].tris)}`);
    } else if (k === 'walk') { console.log(`  walk: ${v.ok ? 'OK' : 'FAIL'}`); for (const s of v.steps) console.log('      ' + JSON.stringify(s)); }
    else if (k === 'list') { console.log('  interiors: ' + v.interiors.join(' ')); for (const id in v.decor) console.log(`      ${id.padEnd(10)} ` + Object.entries(v.decor[id]).map(([a, n]) => a + '×' + n).join(' ')); }
    else console.log(`  ${k}: ${JSON.stringify(v)}`);
  }
}

module.exports = { INIT, HELP, SEED, STEPS };
if (require.main === module) (async () => {
  let B = null;
  if (opt('compare')) {
    if (!fs.existsSync(BASE)) { console.error(`no baseline at ${BASE} — run: python3 build.py --baseline (before your change), then rebuild`); process.exit(2); }
    B = await runBuild(BASE, 'base'); console.log(`baseline: load ${B.load} s${B.errs.length ? '  ERRORS: ' + B.errs.join(' | ') : ''}`);
  }
  const N = await runBuild(NEW, B ? 'new' : '');
  console.log(`${B ? 'new' : 'build'}: load ${N.load} s, seed ${SEED}`);
  printStats(N, B);
  for (const s of N.shots) if (!B) console.log('  shot: ' + s.file);
  if (B) for (const d of await diffShots(B, N)) console.log(`  diff ${d.name}: ${d.pct.toFixed(3)}% pixels changed → ${d.file}`);
  const res = { seed: SEED, checks, new: { ...N, shots: N.shots.map(s => s.file) }, baseline: B && { ...B, shots: B.shots.map(s => s.file) } };
  fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(res, null, 1));
  const E = [...(B ? B.errs.map(e => 'baseline: ' + e) : []), ...N.errs];
  console.log(E.length ? `ERRORS (${E.length}):\n  ` + E.slice(0, 12).join('\n  ') : 'no JS errors');
  process.exit(N.errs.length || (N.stats.walk && !N.stats.walk.ok) ? 1 : 0);
})();

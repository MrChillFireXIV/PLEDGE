#!/usr/bin/env node
// tools/tex.js — 2D preview of the game's canvas textures (flags, posters, signs, ...) in a couple of seconds, without loading the 3D world.
// It pulls the named texture function(s) straight out of src/js, runs them in a plain page with a stub ctex() that just returns the canvas,
// and writes one labelled contact-sheet PNG.
//
//   node tools/tex.js fratFlagTex --houses 'o=>[o.letters,o.shield,[o.rug2,o.rug,o.low]]' --with flagPal
//        one tile per fraternity house (sororities skipped; add --all-houses to include them), args built from each house's colour object
//   node tools/tex.js beerTex --args '[[0],[1],[2],[3],[4],[5]]' --with BEERS
//        explicit argument lists (JSON; "0x..." strings become numbers)
//   options: --with a,b   extra functions/consts the texture needs (copied from src/js)   --cols N (default 4)   --scale S (default .5)
//            --out FILE (default shots/tex-<name>.png)
// Stubs provided: ctex, hexS, PI, TAU, HTEX, GC, rnd, pick, clamp. If it says "X is not defined", add X with --with.
const path = require('path'), fs = require('fs');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { console.error('Playwright not found: npm i playwright'); process.exit(2); }
const A = process.argv.slice(2), opt = k => { const i = A.indexOf('--' + k); return i < 0 ? null : (A[i + 1] && !A[i + 1].startsWith('--') ? A[i + 1] : true); };
const ROOT = path.resolve(__dirname, '..'), name = A[0];
if (!name || name.startsWith('--')) { console.error('usage: node tools/tex.js <textureFunction> (--args JSON | --houses "o=>[...]") [--with a,b]'); process.exit(2); }
const SRC = fs.readFileSync(path.join(ROOT, 'src', 'order.txt'), 'utf8').split('\n').filter(Boolean).map(n => fs.readFileSync(path.join(ROOT, 'src', n), 'utf8')).join('\n');

// copy a top-level `function NAME(...){...}` or `const NAME=...;` out of the source by bracket matching
function grab(n) {
  let i = SRC.search(new RegExp('(^|[;\\n}])\\s*function ' + n + '\\('));
  if (i >= 0) { i = SRC.indexOf('function ' + n + '(', i); let d = 0, j = SRC.indexOf('{', i); for (; j < SRC.length; j++) { if (SRC[j] === '{') d++; else if (SRC[j] === '}' && !--d) break; } return SRC.slice(i, j + 1); }
  i = SRC.search(new RegExp('(^|[;\\n])\\s*(const|let) ' + n + '='));
  if (i >= 0) { i = SRC.indexOf(n + '=', i); let d = 0, j = i; for (; j < SRC.length; j++) { const c = SRC[j]; if ('([{'.includes(c)) d++; else if (')]}'.includes(c)) d--; else if ((c === ';' || c === '\n') && d === 0 && j > i + n.length + 1) break; } return 'const ' + SRC.slice(i, j) + ';'; }
  throw new Error('could not find ' + n + ' in src/js');
}
const code = [name, ...String(opt('with') || '').split(',').filter(Boolean)].map(grab).join('\n');
const fix = v => Array.isArray(v) ? v.map(fix) : typeof v === 'string' && /^0x[0-9a-f]+$/i.test(v) ? parseInt(v, 16) : v;

// house colour objects from src/js/17-interiors.js (houseInt / upInt / the house list), sororities from FRATS cl:'sororities'
function houses() {
  const s = fs.readFileSync(path.join(ROOT, 'src/js/17-interiors.js'), 'utf8'), f = fs.readFileSync(path.join(ROOT, 'src/js/14-npcs-cliques-bosses.js'), 'utf8');
  const soro = new Set([...f.matchAll(/\{id:'(\w+)',L:'[^']+',cl:'sororities'/g)].map(m => m[1]).concat(['dlp', 'tz']));
  const out = new Map();
  for (const m of s.matchAll(/[(\[]'(\w+)',(\{name:'[^']+'[^}]*\})/g)) {
    if (out.has(m[1]) || (!opt('all-houses') && soro.has(m[1]))) continue;
    try { const o = Function('return ' + m[2])(); if (o.shield != null && o.letters) out.set(m[1], o); } catch (e) {}
  }
  return [...out].map(([id, o]) => ({ id, ...o }));
}
let tiles;
if (opt('houses')) { const fn = Function('return ' + opt('houses'))(); tiles = houses().map(o => ({ label: o.id + ' ' + o.letters, args: fn(o) })); }
else if (opt('args')) tiles = fix(JSON.parse(opt('args'))).map(a => ({ label: JSON.stringify(a).slice(0, 40), args: a }));
else { console.error('give --args or --houses'); process.exit(2); }

(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.setContent('<body style="margin:0;background:#2a2a2e;font:13px sans-serif;color:#ddd"><div id="g" style="display:inline-grid;gap:14px;padding:14px"></div></body>');
  const n = await p.evaluate(({ code, name, tiles, cols, scale }) => {
    const PI = Math.PI, TAU = PI * 2, HTEX = {}, GC = {}, rnd = Math.random, pick = a => a[Math.floor(Math.random() * a.length)], clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const hexS = c => '#' + (c >>> 0).toString(16).padStart(6, '0');
    const ctex = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); return { image: c }; };
    const fn = eval(code + '\n;' + name);
    const g = document.getElementById('g'); g.style.gridTemplateColumns = `repeat(${cols},auto)`; let k = 0;
    for (const t of tiles) {
      const d = document.createElement('div'); try { const c = fn(...t.args).image; c.style.width = c.width * scale + 'px'; c.style.boxShadow = '0 2px 8px #0008'; d.appendChild(c); k++; }
      catch (e) { d.textContent = 'ERROR: ' + e.message; d.style.color = '#f88'; }
      const l = document.createElement('div'); l.textContent = t.label; l.style.marginTop = '4px'; d.appendChild(l); g.appendChild(d);
    }
    return k;
  }, { code, name, tiles, cols: +(opt('cols') || 4), scale: +(opt('scale') || .5) });
  const out = path.resolve(opt('out') || path.join(ROOT, 'shots', 'tex-' + name + '.png')); fs.mkdirSync(path.dirname(out), { recursive: true });
  await (await p.$('#g')).screenshot({ path: out });
  console.log(`${n}/${tiles.length} drawn → ${out}`); if (errs.length) console.log('ERRORS:\n  ' + errs.join('\n  '));
  await b.close(); process.exit(errs.length || n < tiles.length ? 1 : 0);
})();

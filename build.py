#!/usr/bin/env python3
"""Rebuild dist/PLEDGE.html (single self-contained file) from src/.

Usage:  python3 build.py            # build
        python3 build.py --check    # build + syntax-check the JS with node
        python3 build.py --cdn      # load THREE.js from the CDN instead of inlining vendor/three-r128.min.js
        python3 build.py --fast     # test build: dist/PLEDGE-fast.html without the 1 MB music (open it with ?test&fast; used by tools/live.js)
        python3 build.py --baseline # first save the current dist/PLEDGE.html as dist/baseline.html (do this at the START of a change)

Baseline: tools/run.js --compare diffs dist/PLEDGE.html against dist/baseline.html. If there is no baseline yet, the build that is about
to be overwritten becomes it automatically. --baseline replaces it with the current build (the "before" of the change you're starting).

THREE.js r128 is inlined from vendor/ by default, so dist/PLEDGE.html works offline and in sandboxes
without internet (fonts still come from Google Fonts and fall back to system fonts when offline).
"""
import re, os, sys, shutil, subprocess, tempfile
ROOT = os.path.dirname(os.path.abspath(__file__))
S = lambda *p: os.path.join(ROOT, 'src', *p)
rd = lambda p: open(p, encoding='utf-8', newline='').read()

tpl = rd(S('template.html'))
assert tpl.count('{{CSS}}') == 1 and tpl.count('{{JS}}') == 1 and tpl.count('{{THREE}}') == 1
CDN = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'
if '--cdn' in sys.argv:
    three = CDN
else:
    lib = rd(os.path.join(ROOT, 'vendor', 'three-r128.min.js'))
    assert '</script' not in lib.lower()
    # V442 (console branch): every THREE object made two matrices, an "up" vector and an id string up front. Loading builds ~100k scenery pieces that
    # are merged away and never drawn, so these are now made the first time anything asks for them (same values, same behaviour): ~400 bytes less
    # per piece, a lower loading peak. Each patch must match exactly once.
    def _p(src, a, b):
        assert src.count(a) == 1, ('three patch', a)
        return src.replace(a, b)
    _lz = lambda k, mk: ('Object.defineProperty(Ce.prototype,"%s",{configurable:!0,get(){const v=%s;Object.defineProperty(this,"%s",{value:v,writable:!0,configurable:!0,enumerable:!0});return v},'
                         'set(v){Object.defineProperty(this,"%s",{value:v,writable:!0,configurable:!0,enumerable:!0})}});' % (k, mk, k, k))
    lib = _p(lib, ',modelViewMatrix:{value:new se},normalMatrix:{value:new yt}', '')
    lib = _p(lib, ',this.up=Ce.DefaultUp.clone()', '')
    lib = _p(lib, 'this.uuid=ct(),this.name="",this.type="Object3D"', 'this.name="",this.type="Object3D"')
    lib = _p(lib, 'Ce.DefaultUp=new Lt(0,1,0),Ce.DefaultMatrixAutoUpdate=!0,Ce.prototype.isObject3D=!0;',
             'Ce.DefaultUp=new Lt(0,1,0),Ce.DefaultMatrixAutoUpdate=!0,Ce.prototype.isObject3D=!0;' + _lz('modelViewMatrix', 'new se') + _lz('normalMatrix', 'new yt') + _lz('up', 'Ce.DefaultUp.clone()') + _lz('uuid', 'ct()'))
    three = '<script>\n' + lib + '\n</script>'
tpl = tpl.replace('{{THREE}}', three)
pre, rest = tpl.split('{{CSS}}')
mid, post = rest.split('{{JS}}')

css = rd(S('style.css'))[:-1]                      # drop the one trailing "\n"
names = [l.strip() for l in rd(S('order.txt')).split('\n') if l.strip()]
FAST = '--fast' in sys.argv
rdp = lambda n: ('/* music left out of the --fast test build */\n' if FAST and n.endswith('music.js') else rd(S(n)))
js = '\n'.join(rdp(n)[:-1] for n in names)       # parts are joined by "\n"

# V442 (console branch): keep the page pure ASCII. A few thousand Greek letters, dots and dashes made the browser keep the whole 5 MB page and
# its script as 2-byte text (twice the memory, several copies). Same characters, written as escapes: \uXXXX in the script, \XXXXXX in CSS,
# &#x...; in the page's HTML.
def _u16(c):
    o = ord(c)
    if o < 0x10000: return '\\u%04x' % o
    o -= 0x10000
    return '\\u%04x\\u%04x' % (0xD800 + (o >> 10), 0xDC00 + (o & 0x3FF))
asc_js = lambda t: re.sub(r'[^\x00-\x7f]', lambda m: _u16(m.group(0)), t)
asc_css = lambda t: re.sub(r'[^\x00-\x7f]', lambda m: '\\%06x' % ord(m.group(0)), t)
asc_html = lambda t: re.sub(r'[^\x00-\x7f]', lambda m: '&#x%x;' % ord(m.group(0)), t)
js, css, pre, mid, post = asc_js(js), asc_css(css), asc_html(pre), asc_html(mid), asc_html(post)

out = (pre + '<style>\n' + css + '\n</style>' + mid
       + '<script>\n"use strict";\n' + js + '\n</script>' + post)

os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
dst = os.path.join(ROOT, 'dist', 'PLEDGE-fast.html' if FAST else 'PLEDGE.html')
base = os.path.join(ROOT, 'dist', 'baseline.html')
if not FAST and os.path.exists(dst) and ('--baseline' in sys.argv or not os.path.exists(base)):
    shutil.copyfile(dst, base)
    print(f'baseline: saved the previous build as {base}')
elif not FAST and os.path.exists(base):
    import time
    print(f'baseline: {base} (from {time.strftime("%Y-%m-%d %H:%M", time.localtime(os.path.getmtime(base)))})')
open(dst, 'w', encoding='utf-8', newline='').write(out)
print(f'built {dst}  ({len(out):,} bytes, {len(names)} js parts)')

if '--check' in sys.argv:
    if not shutil.which('node'):
        sys.exit('node not found; skipping syntax check')
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
        f.write('"use strict";\n' + js)
    r = subprocess.run(['node', '--check', f.name], capture_output=True, text=True)
    os.unlink(f.name)
    print('syntax OK' if r.returncode == 0 else 'SYNTAX ERROR:\n' + r.stderr)
    sys.exit(r.returncode)

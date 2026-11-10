#!/usr/bin/env python3
"""Rebuild dist/PLEDGE.html (single self-contained file) from src/.

Usage:  python3 build.py            # build
        python3 build.py --check    # build + syntax-check the JS with node
        python3 build.py --cdn      # load THREE.js from the CDN instead of inlining vendor/three-r128.min.js
        python3 build.py --baseline # first save the current dist/PLEDGE.html as dist/baseline.html (do this at the START of a change)

Baseline: tools/run.js --compare diffs dist/PLEDGE.html against dist/baseline.html. If there is no baseline yet, the build that is about
to be overwritten becomes it automatically. --baseline replaces it with the current build (the "before" of the change you're starting).

THREE.js r128 is inlined from vendor/ by default, so dist/PLEDGE.html works offline and in sandboxes
without internet (fonts still come from Google Fonts and fall back to system fonts when offline).
"""
import os, sys, shutil, subprocess, tempfile
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
    three = '<script>\n' + lib + '\n</script>'
tpl = tpl.replace('{{THREE}}', three)
pre, rest = tpl.split('{{CSS}}')
mid, post = rest.split('{{JS}}')

css = rd(S('style.css'))[:-1]                      # drop the one trailing "\n"
names = [l.strip() for l in rd(S('order.txt')).split('\n') if l.strip()]
js = '\n'.join(rd(S(n))[:-1] for n in names)       # parts are joined by "\n"

out = (pre + '<style>\n' + css + '\n</style>' + mid
       + '<script>\n"use strict";\n' + js + '\n</script>' + post)

os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
dst = os.path.join(ROOT, 'dist', 'PLEDGE.html')
base = os.path.join(ROOT, 'dist', 'baseline.html')
if os.path.exists(dst) and ('--baseline' in sys.argv or not os.path.exists(base)):
    shutil.copyfile(dst, base)
    print(f'baseline: saved the previous build as {base}')
elif os.path.exists(base):
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

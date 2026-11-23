#!/usr/bin/env python3
"""Build the GitHub Pages site into _site/ (run by .github/workflows/pages.yml on every push).

    python3 pages/publish.py
    python3 pages/publish.py --preview --out _site/preview     (test build at /PLEDGE/preview/: own save storage, PREVIEW badge, not indexed)

1. Runs build.py --check (builds dist/PLEDGE.html and syntax-checks the JS).
2. Stops if the save keys changed. Players' saves live under these keys, so renaming them would
   make everyone's progress look gone. If that's ever on purpose, add a migration and update SAVE_KEYS.
3. Writes _site/index.html (the game with pages/save-guard.js added), _site/version.json and _site/.nojekyll.
"""
import json, os, re, shutil, subprocess, sys, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PREVIEW = '--preview' in sys.argv
SITE = os.path.abspath(sys.argv[sys.argv.index('--out') + 1]) if '--out' in sys.argv else os.path.join(ROOT, '_site')
SAVE_KEYS = ["'pledge.save.v1'", "'pledge.save.s'", "'pledge.slot'"]


def version():
    """Newest 'Vnnn' line in docs/HISTORY.md, e.g. 'V289'."""
    try:
        txt = open(os.path.join(ROOT, 'docs', 'HISTORY.md'), encoding='utf-8').read()
        nums = [int(n) for n in re.findall(r'^- V(\d+)\b', txt, re.M)]
        if nums:
            return 'V%d' % max(nums)
    except OSError:
        pass
    return datetime.datetime.now(datetime.timezone.utc).strftime('build-%Y%m%d%H%M')


def main():
    r = subprocess.run([sys.executable, os.path.join(ROOT, 'build.py'), '--check'], cwd=ROOT)
    if r.returncode:
        sys.exit('build failed, so the site was not updated (players keep the previous version)')

    html = open(os.path.join(ROOT, 'dist', 'PLEDGE.html'), encoding='utf-8', newline='').read()

    missing = [k for k in SAVE_KEYS if k not in html]
    if missing:
        sys.exit('STOP: the save keys %s are gone from the game code. Players would lose their saves. '
                 'Keep the old keys (or add a migration) and update SAVE_KEYS in pages/publish.py.' % ', '.join(missing))

    v = version() + ('-preview' if PREVIEW else '')
    guard = open(os.path.join(ROOT, 'pages', 'save-guard.js'), encoding='utf-8').read().replace('__PLEDGE_VERSION__', v)
    assert '</script' not in guard.lower()
    tag = '<script>\n' + guard + '\n</script>'
    if PREVIEW:
        iso = open(os.path.join(ROOT, 'pages', 'preview-storage.js'), encoding='utf-8').read()
        assert '</script' not in iso.lower()
        tag = '<meta name="robots" content="noindex"><script>\n' + iso + '\n</script>' + tag   # storage first, so the guard and the game only see preview keys
    i = html.lower().find('<head>')
    if i < 0:
        sys.exit('no <head> in dist/PLEDGE.html')
    i += len('<head>')
    m = re.match(r'\s*<meta charset[^>]*>', html[i:], re.I)   # keep the charset tag first
    if m:
        i += m.end()
    html = html[:i] + tag + html[i:]

    shutil.rmtree(SITE, ignore_errors=True)
    os.makedirs(SITE)
    open(os.path.join(SITE, 'index.html'), 'w', encoding='utf-8', newline='').write(html)
    json.dump({'version': v, 'built': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')},
              open(os.path.join(SITE, 'version.json'), 'w'))
    open(os.path.join(SITE, '.nojekyll'), 'w').close()
    print('site ready: %s/index.html (%s, %s bytes)' % (os.path.relpath(SITE, ROOT), v, format(len(html), ',')))


if __name__ == '__main__':
    main()

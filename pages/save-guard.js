/* PLEDGE save guard (added by pages/publish.py to the GitHub Pages build only, never to src/).
   - Saves live in this browser's localStorage under "pledge.*". GitHub Pages keeps the same web address
     for every version, so a new version reads the same saves. Nothing here deletes them.
   - The first time a new version opens, it copies every pledge.* key into a backup
     (pledge.backup.<old version>.<time>), keeping the newest 3. Open the game with ?restore to put one back.
   - It asks the browser to keep this site's storage (navigator.storage.persist) so it isn't cleared to free space.
   - Every few minutes it checks version.json. When a newer version is out, a small bar offers to save and reload. */
(function () {
  'use strict';
  var V = '__PLEDGE_VERSION__', BK = 'pledge.backup.', KEEP = 3;
  var ls; try { ls = window.localStorage; ls.getItem('x'); } catch (e) { return; }

  function gameKeys() {
    var out = [];
    for (var i = 0; i < ls.length; i++) { var k = ls.key(i); if (k && k.indexOf('pledge.') === 0 && k.indexOf(BK) !== 0) out.push(k); }
    return out;
  }
  function backups() {
    var out = [];
    for (var i = 0; i < ls.length; i++) { var k = ls.key(i); if (k && k.indexOf(BK) === 0) out.push(k); }
    return out.sort(function (a, b) { return +b.split('.').pop() - +a.split('.').pop(); });
  }
  function snapshot(label) {
    var keys = gameKeys(), snap = {}, any = false;
    keys.forEach(function (k) { snap[k] = ls.getItem(k); if (k.indexOf('pledge.save.') === 0) any = true; });
    if (!any) return;
    var key = BK + label + '.' + Date.now(), val = JSON.stringify(snap);
    backups().slice(KEEP - 1).forEach(function (k) { ls.removeItem(k); });
    for (var tries = 0; tries < KEEP; tries++) {
      try { ls.setItem(key, val); return; } catch (e) { var b = backups(); if (!b.length) return; ls.removeItem(b[b.length - 1]); }
    }
  }

  try {
    var last = ls.getItem('pledge.siteVersion');
    if (last !== V) { snapshot(last || 'before-site'); ls.setItem('pledge.siteVersion', V); }
  } catch (e) {}

  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {}); } catch (e) {}

  function bar(html, buttons) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483647;max-width:min(560px,calc(100vw - 32px));' +
      'background:#111;color:#fff;border:1px solid #444;border-radius:10px;padding:10px 14px;font:14px -apple-system,BlinkMacSystemFont,sans-serif;' +
      'box-shadow:0 6px 24px rgba(0,0,0,.4);display:flex;gap:10px;align-items:center;flex-wrap:wrap';
    var t = document.createElement('div'); t.style.flex = '1 1 220px'; t.innerHTML = html; d.appendChild(t);
    buttons.forEach(function (b) {
      var x = document.createElement('button'); x.textContent = b[0];
      x.style.cssText = 'font:inherit;padding:6px 12px;border-radius:7px;border:0;cursor:pointer;' + (b[2] ? 'background:#ffd54a;color:#000' : 'background:#333;color:#fff');
      x.onclick = function (e) { e.stopPropagation(); b[1](d); }; d.appendChild(x);
    });
    (document.body || document.documentElement).appendChild(d);
    return d;
  }

  /* ?restore : pick a backup to put back */
  if (/[?&]restore\b/.test(location.search)) {
    window.__PLEDGE_RESTORE = true;
    document.addEventListener('DOMContentLoaded', function () {
      var b = backups();
      if (!b.length) { bar('No save backups in this browser yet.', [['Close', function (d) { d.remove(); }]]); return; }
      var list = b.map(function (k, i) {
        var p = k.slice(BK.length).split('.'), when = new Date(+p.pop()).toLocaleString(), info = [];
        try {
          var snap = JSON.parse(ls.getItem(k));
          Object.keys(snap).filter(function (s) { return s.indexOf('pledge.save.') === 0; }).sort().forEach(function (s) {
            var S = (JSON.parse(snap[s]) || {}).S || {};
            info.push('slot ' + (s === 'pledge.save.v1' ? 1 : s.slice(-1)) + ': ch ' + (S.ch || 1) + (S.lvl ? ', lvl ' + S.lvl : ''));
          });
        } catch (e) {}
        return '<label style="display:block;margin:4px 0"><input type="radio" name="pbk" value="' + i + '"' + (i ? '' : ' checked') + '> ' +
          when + ' (from ' + p.join('.') + ')' + (info.length ? '<br><span style="opacity:.7;margin-left:22px">' + info.join(' · ') + '</span>' : '') + '</label>';
      }).join('');
      bar('<b>Restore a save backup</b><br>This replaces your current saves (they are backed up first).' + list, [
        ['Restore', function (d) {
          var i = +(d.querySelector('input[name=pbk]:checked') || {}).value || 0, data;
          try { data = JSON.parse(ls.getItem(b[i])); } catch (e) { return; }
          snapshot('before-restore');
          gameKeys().forEach(function (k) { if (k !== 'pledge.siteVersion') ls.removeItem(k); });
          Object.keys(data).forEach(function (k) { ls.setItem(k, data[k]); });
          location.replace(location.pathname);
        }, 1],
        ['Cancel', function () { location.replace(location.pathname); }]
      ]);
    });
  }

  /* New-version check */
  var shown = false;
  function check() {
    if (shown || !window.fetch || location.protocol === 'file:') return;
    fetch('version.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.version || j.version === V || shown) return;
      shown = true;
      bar('<b>New version ' + j.version + ' is out.</b> Your progress is kept.', [
        ['Save & reload', function () { try { if (typeof window.saveGame === 'function') window.saveGame(); } catch (e) {} location.reload(); }, 1],
        ['Later', function (d) { d.remove(); }]
      ]);
    }).catch(function () {});
  }
  setTimeout(check, 60000); setInterval(check, 5 * 60000);
})();

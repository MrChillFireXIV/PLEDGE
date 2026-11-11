/* PLEDGE preview build only (pages/publish.py --preview). The preview lives at /PLEDGE/preview/ on the same site as the real
   game, so it would share the browser's saved data. This gives it its own storage: every key is stored as "preview~<key>",
   so testing a preview can never read, change or back up a player's real saves. Also shows a small PREVIEW badge. */
(function () {
  'use strict';
  var real; try { real = window.localStorage; real.getItem('x'); } catch (e) { return; }
  var P = 'preview~';
  var own = function () { var o = []; for (var i = 0; i < real.length; i++) { var k = real.key(i); if (k && k.indexOf(P) === 0) o.push(k.slice(P.length)); } return o; };
  var S = {
    getItem: function (k) { return real.getItem(P + k); },
    setItem: function (k, v) { real.setItem(P + k, String(v)); },
    removeItem: function (k) { real.removeItem(P + k); },
    clear: function () { own().forEach(function (k) { real.removeItem(P + k); }); },
    key: function (i) { var o = own(); return i < o.length ? o[i] : null; }
  };
  Object.defineProperty(S, 'length', { get: function () { return own().length; } });
  Object.defineProperty(window, 'localStorage', { configurable: true, get: function () { return S; } });
  window.PLEDGE_PREVIEW = 1;
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('div');
    b.textContent = 'PREVIEW · separate saves';
    b.style.cssText = 'position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#c0392b;color:#fff;font:700 11px sans-serif;letter-spacing:.08em;padding:3px 10px;border-radius:99px;pointer-events:none;opacity:.85';
    document.body.appendChild(b);
  });
})();

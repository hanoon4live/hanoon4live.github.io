/* Auto-refresh: when you upload new files to GitHub, anyone who has the site open
   gets the new version by itself (within about 30 seconds). */
(function () {
  var FILES = ['index.html', 'box.js', 'intro.js', 'notify.js']; /* files to watch */
  var EVERY = 20000;                                              /* check every 20 seconds */
  var base = location.href.split('#')[0].split('?')[0].replace(/[^\/]*$/, '');
  var first = null, busy = false;

  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h; }

  function snapshot() {
    return Promise.all(FILES.map(function (f) {
      return fetch(base + f + '?_=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (t) { return f + ':' + hash(t); })
        .catch(function () { return f + ':err'; });
    })).then(function (a) { return a.join('|'); });
  }

  function safeToReload() {
    /* don't cut her off while the password, the box or the intro is on screen */
    return !document.getElementById('gate') && !document.getElementById('msgbox') && !document.getElementById('intro');
  }

  function check() {
    if (busy || document.hidden && first === null) return;
    busy = true;
    snapshot().then(function (now) {
      busy = false;
      if (/:err/.test(now)) return;
      if (first === null) { first = now; return; }
      if (now === first) return;
      if (!safeToReload()) return;                 /* try again on the next check */
      try {
        var last = +sessionStorage.getItem('hn_reload') || 0;
        if (Date.now() - last < 15000) return;     /* avoid reload loops */
        sessionStorage.setItem('hn_reload', String(Date.now()));
      } catch (e) {}
      location.reload();
    }).catch(function () { busy = false; });
  }

  check();
  setInterval(check, EVERY);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
})();

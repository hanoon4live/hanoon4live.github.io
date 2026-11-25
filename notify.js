/* Sends an email (web3forms) whenever any button or link is pressed on the site. */
(function () {
  var KEY = '70dfd492-87d0-4969-9898-ab2c7b368b8e';
  var last = '', lastT = 0;

  function device() {
    var u = navigator.userAgent, os = 'Unknown device', br = 'Unknown browser';
    if (/iPhone/.test(u)) os = 'iPhone'; else if (/iPad/.test(u)) os = 'iPad';
    else if (/Android/.test(u)) os = 'Android'; else if (/Windows/.test(u)) os = 'Windows';
    else if (/Mac OS X/.test(u)) os = 'Mac'; else if (/Linux/.test(u)) os = 'Linux';
    if (/EdgA?\/|Edg\//.test(u)) br = 'Edge'; else if (/OPR\//.test(u)) br = 'Opera';
    else if (/CriOS|Chrome\//.test(u)) br = 'Chrome'; else if (/FxiOS|Firefox\//.test(u)) br = 'Firefox';
    else if (/Safari\//.test(u)) br = 'Safari';
    return os + ', ' + br;
  }

  function label(el) {
    var t = el.getAttribute('aria-label') || (el.innerText || el.textContent || '').trim() || el.id || el.className || 'button';
    t = String(t).replace(/\s+/g, ' ').slice(0, 80);
    var href = el.getAttribute && el.getAttribute('href');
    return href ? t + ' (-> ' + href + ')' : t;
  }

  function send(name) {
    var page = location.pathname.split('/').pop() || 'index.html';
    var now = Date.now();
    var sig = page + '|' + name;
    if (sig === last && now - lastT < 1500) return; /* ignore double taps */
    last = sig; lastT = now;
    try {
      var when = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Cairo', dateStyle: 'full', timeStyle: 'medium' });
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          access_key: KEY,
          subject: 'Button pressed: ' + name.slice(0, 50),
          from_name: 'Your love website',
          message: 'Button: ' + name + '\nPage: ' + page + '\nTime: ' + when + ' (Cairo)\nDevice: ' + device()
        })
      }).catch(function () {});
    } catch (e) {}
  }

  var onUs = /(^|\/)us(\.html)?$/.test(location.pathname);

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;

    /* photos: only the photos on the Us page send an email */
    if (t.tagName === 'IMG' && !t.closest('button, a, .lb, #lb')) {
      if (onUs) send('Us photo: ' + ((t.currentSrc || t.src || '').split('/').pop().split('?')[0] || 'photo'));
      return;
    }

    var el = t.closest('button, a[href], [role="button"], label.pick, .star');
    if (!el) return;
    if (el.classList.contains('star')) return;      /* no email for stars */
    if (el.classList.contains('fph')) return;       /* no email for food photos */
    if (el.id === 'yes' || el.id === 'go') return;  /* these already send their own email */
    if (el.matches('a[href="donate.html"]') && /(^|\/)(index\.html)?$/.test(location.pathname)) return;
    send(label(el));
  }, true);
})();

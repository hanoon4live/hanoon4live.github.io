/* Password gate for every page. Unlocks once per device, then stays unlocked.
   The password is stored only as a hash. */
(function () {
  var HASH = '06e0fe6c349b6144d6a3857ea5c8299e132c25ac1c9460c20dfcfa96cdab48d4';
  var KEY = 'hn_unlock';

  var ok = false;
  try { ok = localStorage.getItem(KEY) === HASH; } catch (e) {}
  if (ok) return;

  var root = document.documentElement;
  root.style.visibility = 'hidden';

  function sha(s) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  function build() {
    var st = document.createElement('style');
    st.textContent =
      '#gate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;' +
      'background:linear-gradient(#1c110c,#3b2418);font-family:"Karla",system-ui,-apple-system,"Segoe UI",sans-serif;color:#eadccf}' +
      '#gate .box{width:100%;max-width:340px;text-align:center}' +
      '#gate h1{margin:0 0 .4rem;font-family:"Fraunces",Georgia,serif;font-style:italic;font-weight:300;font-size:2.4rem;color:#fff}' +
      '#gate p{margin:0 0 1.6rem;color:#a58b78;font-size:.98rem;line-height:1.5}' +
      '#gate input{width:100%;font:inherit;font-size:1.3rem;letter-spacing:.3em;text-align:center;padding:14px 16px;border-radius:999px;' +
      'border:1px solid #e8c4a0;background:#00000033;color:#fff;outline:none}' +
      '#gate input:focus{box-shadow:0 0 0 3px #e8c4a055}' +
      '#gate button{margin-top:14px;width:100%;font:500 1rem inherit;font-family:inherit;padding:14px;border-radius:999px;border:0;cursor:pointer;background:#e8c4a0;color:#1c110c}' +
      '#gate button:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
      '#gate .err{min-height:1.4em;margin:12px 0 0;color:#e8c4a0;font-size:.95rem}' +
      '#gate .box.shake{animation:gshake .35s}' +
      '@keyframes gshake{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}' +
      '@media (prefers-reduced-motion:reduce){#gate .box.shake{animation:none}}';
    document.head.appendChild(st);

    var g = document.createElement('div');
    g.id = 'gate';
    g.innerHTML =
      '<div class="box"><h1>For Hanoon</h1>' +
      '<p>Just for you.</p>' +
      '<input id="gpw" type="password" inputmode="numeric" autocomplete="off" aria-label="Password">' +
      '<button id="gbtn" type="button">Open</button>' +
      '<div class="err" id="gerr" aria-live="polite"></div></div>';
    document.body.appendChild(g);
    document.body.style.overflow = 'hidden';
    root.style.visibility = 'visible';

    var inp = document.getElementById('gpw'), err = document.getElementById('gerr'), box = g.firstChild;

    function unlock() {
      if (!window.crypto || !crypto.subtle) { err.textContent = 'Please open this from the website link.'; return; }
      sha('hanoon:' + inp.value.trim()).then(function (h) {
        if (h === HASH) {
          try { localStorage.setItem(KEY, HASH); } catch (e) {}
          g.remove();
          document.body.style.overflow = '';
        } else {
          err.textContent = 'Not quite. Try again.';
          box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
          inp.select();
        }
      });
    }
    document.getElementById('gbtn').addEventListener('click', unlock);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') unlock(); });
    inp.focus();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();

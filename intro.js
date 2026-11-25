/* Big "I love you" intro. Shows every time the page loads or refreshes (after the password),
   then fades into the page. Tap anywhere to skip. */
(function () {
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var st = document.createElement('style');
  st.textContent =
    '#intro{position:fixed;inset:0;z-index:90000;display:flex;align-items:center;justify-content:center;flex-direction:column;overflow:hidden;cursor:pointer;' +
    'background:radial-gradient(ellipse at 50% 55%,#5a3a26 0%,#2b1a11 55%,#140b07 100%);color:#fff;text-align:center;padding:24px;' +
    'opacity:1;transition:opacity .9s ease;overscroll-behavior:contain;touch-action:none}' +
    '#intro.out{opacity:0;pointer-events:none}' +
    '#intro .rings{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none}' +
    '#intro .ring{position:absolute;left:-26vmin;top:-26vmin;width:52vmin;height:52vmin;border-radius:50%;border:2px solid #e8c4a0;opacity:0}' +
    '#intro.beat .ring{animation:iring 2.4s ease-out infinite}' +
    '#intro.beat .ring:nth-child(2){animation-delay:.8s}#intro.beat .ring:nth-child(3){animation-delay:1.6s}' +
    '@keyframes iring{0%{transform:scale(.35);opacity:.55}100%{transform:scale(2.3);opacity:0}}' +
    '#intro .to{position:relative;font-family:"Fraunces",Georgia,serif;font-style:italic;font-weight:300;font-size:clamp(1.3rem,5vw,2rem);color:#e8c4a0;margin:0 0 .4em;opacity:0;transition:opacity 1s ease .2s}' +
    '#intro.go .to{opacity:1}' +
    '#intro .big{position:relative;margin:0;font-family:"Fraunces",Georgia,serif;font-style:italic;font-weight:400;line-height:1.02;' +
    'font-size:clamp(3.4rem,18vw,9.5rem);max-width:94vw;text-shadow:0 0 28px #e8c4a0aa,0 0 90px #d4a26a88}' +
    '#intro .w{display:inline-block;white-space:nowrap;margin:0 .12em}' +
    '#intro .l{display:inline-block;opacity:0}' +
    '#intro.go .l{animation:islam .9s cubic-bezier(.2,1.4,.4,1) forwards}' +
    '@keyframes islam{0%{opacity:0;transform:translateY(.5em) scale(.4);filter:blur(16px)}60%{opacity:1;filter:blur(0)}100%{opacity:1;transform:none;filter:blur(0)}}' +
    '#intro.beat .big{animation:ibeat 1.2s ease-in-out infinite}' +
    '@keyframes ibeat{0%,100%{transform:scale(1)}18%{transform:scale(1.045)}32%{transform:scale(1)}46%{transform:scale(1.03)}}' +
    '#intro .tap{position:relative;margin-top:2.2em;font:500 1rem "Karla",system-ui,-apple-system,"Segoe UI",sans-serif;color:#a58b78;background:none;border:1px solid #a58b7866;' +
    'border-radius:999px;padding:10px 26px;opacity:0;transition:opacity 1s ease;cursor:pointer}' +
    '#intro.hint .tap{opacity:1}' +
    '#intro .tap:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
    '#intro .heart{position:absolute;bottom:-40px;color:#e8c4a0;pointer-events:none;animation:irise linear forwards;will-change:transform}' +
    '@keyframes irise{0%{transform:translate(0,0) scale(.7);opacity:0}10%{opacity:.85}100%{transform:translate(var(--dx),-112vh) scale(1.2);opacity:0}}' +
    '@media (prefers-reduced-motion:reduce){#intro .l{opacity:1;animation:none!important}#intro.beat .big,#intro.beat .ring{animation:none}}';
  document.head.appendChild(st);

  var box = document.createElement('div');
  box.id = 'intro';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'I love you');

  var rings = document.createElement('div'); rings.className = 'rings';
  for (var r = 0; r < 3; r++) { var rg = document.createElement('div'); rg.className = 'ring'; rings.appendChild(rg); }
  box.appendChild(rings);

  var to = document.createElement('p'); to.className = 'to'; to.textContent = 'Hanoon,'; box.appendChild(to);

  var big = document.createElement('h1'); big.className = 'big';
  var idx = 0;
  ['I', 'love', 'you'].forEach(function (word) {
    var w = document.createElement('span'); w.className = 'w';
    word.split('').forEach(function (ch) {
      var l = document.createElement('span'); l.className = 'l'; l.textContent = ch;
      l.style.animationDelay = (0.35 + idx * 0.1) + 's'; idx++;
      w.appendChild(l);
    });
    big.appendChild(w);
    idx += 2;
  });
  box.appendChild(big);

  var tap = document.createElement('button'); tap.type = 'button'; tap.className = 'tap'; tap.textContent = 'Tap to open';
  box.appendChild(tap);
  document.body.appendChild(box);

  var timers = [], hearts = null, closed = false;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function close() {
    if (closed) return; closed = true;
    timers.forEach(clearTimeout); if (hearts) clearInterval(hearts);
    box.classList.add('out');
    setTimeout(function () { box.remove(); st.remove(); }, 1000);
  }
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter') close(); });

  function start() {
    box.classList.add('go');
    later(function () { box.classList.add('beat'); }, 1900);
    later(function () { box.classList.add('hint'); }, 3200);
    later(close, 11000);
    if (!calm) {
      hearts = setInterval(function () {
        var h = document.createElement('div'); h.className = 'heart'; h.textContent = '\u2665';
        h.style.left = (Math.random() * 100) + 'vw';
        h.style.fontSize = (14 + Math.random() * 30) + 'px';
        h.style.setProperty('--dx', ((Math.random() - 0.5) * 120) + 'px');
        h.style.animationDuration = (4 + Math.random() * 3) + 's';
        box.appendChild(h);
        setTimeout(function () { h.remove(); }, 7200);
      }, 320);
    }
  }

  // wait until the password screen is gone (if there is one), then play
  (function wait() {
    if (document.getElementById('gate')) { setTimeout(wait, 120); } else { start(); }
  })();
})();

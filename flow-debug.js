/* ── ZERO full flow · the one debug bar ────────────────────────────────────
   Four stops, one control, on every page of the flow:

     Onboarding       index.html          the voice onboarding, from the top
     Post-onboarding  index.html#post     straight to the roadmap + portfolio
     Home             home.html           the world map and the scenario card
     Stage            workspace.html      the scenario workspace

   Each page already ships its OWN stepper (the onboarding's 18 steps, the
   workspace's stage jumps). This one sits above them and moves between the
   four apps, which nothing else could do — the flow spans three documents, so
   a jump is a navigation, not a function call.

   Ctrl+H (or Cmd+H) hides and shows it, and the choice is remembered across
   the jump, because a bar that reappears on every navigation is not hidden. */
(function () {
  var KEY = 'zffDebugHidden';
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var STOPS = [
    { id: 'onboarding', label: 'Onboarding', href: 'index.html' },
    { id: 'post', label: 'Post-onboarding', href: 'index.html#post' },
    { id: 'home', label: 'Home', href: 'home.html' },
    { id: 'stage', label: 'Stage', href: 'workspace.html' }
  ];
  /* which stop we are standing on, so the bar can show it rather than guess */
  var at = here.indexOf('workspace') === 0 ? 'stage'
         : here.indexOf('home') === 0 ? 'home'
         : (location.hash === '#post' ? 'post' : 'onboarding');

  var css = document.createElement('style');
  css.textContent =
    '#zffDbg{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000;' +
      'display:flex;align-items:center;gap:2px;padding:5px;border-radius:999px;' +
      'background:rgba(20,19,18,.86);-webkit-backdrop-filter:blur(22px) saturate(1.3);' +
      'backdrop-filter:blur(22px) saturate(1.3);border:1px solid rgba(255,255,255,.10);' +
      'box-shadow:0 12px 40px rgba(0,0,0,.42);font:500 12px/1 ui-sans-serif,system-ui,-apple-system,sans-serif;' +
      'transition:opacity .2s ease,transform .2s ease}' +
    '#zffDbg[hidden]{display:none}' +
    '#zffDbg.out{opacity:0;transform:translateX(-50%) translateY(8px);pointer-events:none}' +
    '#zffDbg b{color:rgba(255,255,255,.34);font-weight:600;letter-spacing:.10em;text-transform:uppercase;' +
      'font-size:9px;padding:0 8px 0 10px;white-space:nowrap}' +
    '#zffDbg a{appearance:none;border:0;cursor:pointer;color:rgba(255,255,255,.72);text-decoration:none;' +
      'background:transparent;padding:7px 12px;border-radius:999px;white-space:nowrap;' +
      'transition:background .16s ease,color .16s ease}' +
    '#zffDbg a:hover{background:rgba(255,255,255,.09);color:#fff}' +
    '#zffDbg a.on{background:#fff;color:#141312;font-weight:600}' +
    '#zffDbg i{width:1px;height:16px;background:rgba(255,255,255,.10);margin:0 4px;display:block}' +
    '#zffDbg kbd{color:rgba(255,255,255,.30);font:inherit;font-size:9.5px;padding:0 9px 0 4px;letter-spacing:.04em}';
  document.head.appendChild(css);

  var bar = document.createElement('nav');
  bar.id = 'zffDbg';
  bar.setAttribute('aria-label', 'Flow debug');
  var html = '<b>Flow</b>';
  STOPS.forEach(function (s) {
    html += '<a href="' + s.href + '" data-id="' + s.id + '"' + (s.id === at ? ' class="on"' : '') + '>' + s.label + '</a>';
  });
  html += '<i></i><kbd>⌃H</kbd>';
  bar.innerHTML = html;
  (document.body || document.documentElement).appendChild(bar);

  /* the post-onboarding stop is a step inside THIS page, so it jumps rather
     than reloads when we are already here */
  bar.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-id]');
    if (!a) return;
    if (a.dataset.id === 'post' && at.indexOf('onboarding') === 0 || (a.dataset.id === 'post' && at === 'post')) {
      e.preventDefault();
      location.hash = 'post';
      goPost();
    }
  });

  /* the onboarding owns an 18 step stepper; 13 is where the roadmap and the
     portfolio live, which is what "post-onboarding" means to a reviewer */
  function goPost() {
    var tries = 0;
    (function run() {
      if (typeof window.dbgGoto === 'function') { try { window.dbgGoto(13); } catch (err) {} return; }
      if (++tries < 80) setTimeout(run, 150);
    })();
  }
  if (at === 'post') goPost();

  function setHidden(v) {
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (err) {}
    bar.classList.toggle('out', !!v);
  }
  var hidden = false;
  try { hidden = localStorage.getItem(KEY) === '1'; } catch (err) {}
  if (hidden) bar.classList.add('out');

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'h' && e.key !== 'H') return;
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    /* never steal the key from something the learner is typing into */
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return;
    e.preventDefault();
    setHidden(!bar.classList.contains('out'));
  }, true);
})();

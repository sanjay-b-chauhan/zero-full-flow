/* ── ZERO full flow · the flow jumps, inside the page's own settings ───────
   Four stops, on every page of the flow:

     Onboarding       index.html        the voice onboarding, from the top
     Post-onboarding  home.html#welcome the welcome page, after the onboarding
     World            home.html#world   the world map and the scenario card
     Stage            workspace.html    the scenario workspace

   The flow spans three documents, so a jump is a navigation, not a function
   call — the one thing no per-page stepper here could do. But it is still
   debug chrome, so it belongs in the gear with the rest of it rather than
   floating in its own rail on top of the dock. Every page here already has a
   settings panel behind a gear (#dbg / #dbgPanel), so this prepends a Flow
   block to it. Where there is no panel to prepend to (the world map is a
   product bundle, not ours) it puts up its own gear in the same corner.

   The welcome page and the world are two BEATS of the home's own first run,
   not separate URLs, and the app exposes no way to start at one. So this
   drives the real controls: tick the consent box, sign in, and stop at
   welcome — or carry on through to reach the world. Using the product's own
   path means these stops cannot drift out of sync with it.

   Ctrl+H (or Cmd+H) hides EVERY piece of debug chrome on the page, the gear
   included, and remembers the choice across the jump. */
(function () {
  var KEY = 'zffDebugHidden';
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var hash = (location.hash || '').replace('#', '');
  var onHome = here.indexOf('home') === 0;
  var onWorkspace = here.indexOf('workspace') === 0;
  var STOPS = [
    { id: 'onboarding', label: 'Onboarding', href: 'index.html' },
    { id: 'welcome', label: 'Post-onboarding', href: 'home.html#welcome' },
    { id: 'world', label: 'World', href: 'home.html#world' },
    { id: 'stage', label: 'Stage', href: 'workspace.html' }
  ];
  var at = onWorkspace ? 'stage' : onHome ? (hash === 'welcome' ? 'welcome' : 'world') : 'onboarding';

  /* every debug affordance on this page, so one shortcut can take them all */
  var CHROME = '#zffFlow,#zffGear,#dbg,#dbgFab,.dbg-fab,#stageNav,.stage-nav,#fbHandle,.fb-handle';

  var css = document.createElement('style');
  css.textContent =
    '#zffFlow{display:block;margin:0 0 10px}' +
    '#zffFlow .zf-h{font:600 9px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em;' +
      'text-transform:uppercase;opacity:.45;padding:0 0 7px}' +
    '#zffFlow .zf-g{display:grid;grid-template-columns:1fr 1fr;gap:4px}' +
    '#zffFlow a{display:block;text-align:left;text-decoration:none;cursor:pointer;' +
      'font:500 11.5px/1 ui-sans-serif,system-ui,sans-serif;padding:8px 9px;border-radius:9px;' +
      'border:1px solid rgba(128,128,128,.28);color:inherit;opacity:.72;' +
      'transition:opacity .16s ease,background .16s ease}' +
    '#zffFlow a:hover{opacity:1;background:rgba(128,128,128,.14)}' +
    '#zffFlow a.on{opacity:1;background:currentColor;border-color:currentColor}' +
    '#zffFlow a.on span{color:#fff;mix-blend-mode:difference}' +
    '#zffFlow .zf-k{font:500 9px/1 ui-sans-serif,system-ui,sans-serif;opacity:.4;padding:8px 0 0}' +
    /* our own gear, only where the page has no settings panel of its own */
    '#zffGear{position:fixed;left:16px;bottom:16px;z-index:2147483000;width:38px;height:38px;' +
      'border-radius:50%;display:grid;place-items:center;cursor:pointer;' +
      'background:rgba(20,19,18,.86);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);' +
      'border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.8);' +
      'box-shadow:0 10px 30px rgba(0,0,0,.4)}' +
    '#zffGear:hover{color:#fff}' +
    '#zffGear .zf-pop{position:absolute;left:0;bottom:46px;width:236px;padding:11px;' +
      'border-radius:16px;background:rgba(20,19,18,.94);-webkit-backdrop-filter:blur(24px);' +
      'backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.10);' +
      'box-shadow:0 16px 44px rgba(0,0,0,.5);color:#fff;display:none;cursor:default}' +
    '#zffGear.open .zf-pop{display:block}' +
    'body.zff-nodebug ' + CHROME.split(',').join(',body.zff-nodebug ') + '{display:none!important}';
  document.head.appendChild(css);

  function flowBlock() {
    var el = document.createElement('div');
    el.id = 'zffFlow';
    var g = '<div class="zf-h">Flow</div><div class="zf-g">';
    STOPS.forEach(function (s) {
      g += '<a href="' + s.href + '" data-id="' + s.id + '"' + (s.id === at ? ' class="on"' : '') +
           '><span>' + s.label + '</span></a>';
    });
    el.innerHTML = g + '</div><div class="zf-k">⌃H hides every debug control</div>';
    el.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-id]');
      if (!a || !onHome) return;
      var id = a.dataset.id;
      if (id !== 'welcome' && id !== 'world') return;
      /* already on the home: the first run only plays forward, so switching
         beats has to be a reload rather than a rewind */
      e.preventDefault();
      location.hash = id;
      location.reload();
    });
    return el;
  }

  /* prefer the page's own settings panel; fall back to a gear of our own */
  var tries = 0;
  (function mount() {
    var panel = document.getElementById('dbgPanel')
             || (onWorkspace ? document.getElementById('dbg') : null);
    if (panel) { panel.insertBefore(flowBlock(), panel.firstChild); return; }
    if (++tries < 40) { setTimeout(mount, 200); return; }
    var gear = document.createElement('div');
    gear.id = 'zffGear';
    gear.setAttribute('role', 'button');
    gear.setAttribute('aria-label', 'Flow controls');
    gear.innerHTML = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/>' +
      '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 ' +
      '1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 ' +
      '1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 ' +
      '4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 ' +
      '1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 ' +
      '1.65 0 0 0 19.4 9c.14.35.4.64.73.83H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    var pop = document.createElement('div');
    pop.className = 'zf-pop';
    pop.appendChild(flowBlock());
    gear.appendChild(pop);
    gear.addEventListener('click', function (e) {
      if (pop.contains(e.target)) return;
      gear.classList.toggle('open');
    });
    document.addEventListener('click', function (e) { if (!gear.contains(e.target)) gear.classList.remove('open'); });
    document.body.appendChild(gear);
  })();

  /* ── drive the home's first run to the beat we were asked for ───────── */
  function btnBy(re) {
    var all = document.querySelectorAll('button');
    for (var i = 0; i < all.length; i++) if (re.test(all[i].textContent || '')) return all[i];
    return null;
  }
  function driveHome(target) {
    var n = 0;
    (function step() {
      if (++n > 200) return;                   /* ~40s, then give up quietly */
      var zfr = document.getElementById('zfr');
      if (!zfr) return;                        /* first run over: the world */
      var beat = zfr.dataset.beat || '';
      if (beat === 'login') {
        var cb = document.querySelector('.zfr-consent input');
        if (cb && !cb.checked) cb.click();
        /* the button only enables on the re-render AFTER the box is ticked, so
           never latch on the first attempt — retry until the beat moves */
        var sg = btnBy(/sign in with google/i);
        if (sg && !sg.disabled) sg.click();
      } else if (target === 'world') {
        var cta = document.querySelector('.zfr-cta');   /* welcome and journey each have one */
        if (cta) cta.click();
      } else if (beat === 'welcome') {
        return;                                /* the welcome page: stop here */
      }
      setTimeout(step, 200);
    })();
  }
  if (onHome && (hash === 'welcome' || hash === 'world')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { driveHome(hash); });
    else driveHome(hash);
  }

  function setHidden(v) {
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (err) {}
    document.body.classList.toggle('zff-nodebug', !!v);
  }
  var hidden = false;
  try { hidden = localStorage.getItem(KEY) === '1'; } catch (err) {}
  if (hidden) document.body.classList.add('zff-nodebug');

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'h' && e.key !== 'H') return;
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return;
    e.preventDefault();
    setHidden(!document.body.classList.contains('zff-nodebug'));
  }, true);
})();

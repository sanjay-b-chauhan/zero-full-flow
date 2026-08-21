/* ── ZERO full flow · ONE debug control, the same on every page ────────────
   Every screen here shipped its own debug affordance — the workspace a gear
   over a long prototype panel, the onboarding a stepper bar with its own gear,
   the world map nothing at all. This replaces all three with a single gear in
   the same corner, holding the same four categories:

     Onboarding       index.html        the voice onboarding, from the top
     Post-onboarding  home.html#welcome the welcome page, after the onboarding
     Home             home.html#world   the world map and the scenario card
     Stage            workspace.html    the scenario workspace

   The flow spans three documents, so a jump is a navigation, not a function
   call — the one thing no per-page stepper could do.

   The page's OWN controls are not thrown away: its native panel is folded in
   behind "This screen", so there is still exactly one gear to find. The native
   gear button itself is hidden, because two gears was the complaint.

   Post-onboarding and Home are two BEATS of the map's own first run, not
   separate URLs, and the app exposes no way to start at one. So this drives
   the real controls — tick the consent box, sign in, then the beat CTAs —
   which means these stops cannot drift out of sync with the product.

   Ctrl+H (or Cmd+H) hides every debug control on the page, this gear
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
    { id: 'world', label: 'Home', href: 'home.html#world' },
    { id: 'stage', label: 'Stage', href: 'workspace.html' }
  ];
  var HOME_BEATS = { welcome: 1, world: 1 };
  var at = onWorkspace ? 'stage' : onHome ? (hash === 'welcome' ? 'welcome' : 'world') : 'onboarding';

  /* every other debug entry point on the page, hidden so ours is the only one.
     The map's compass ("Prototype tour") is one of these: it opened a second
     menu of screens and popups in the opposite corner. Its useful half — the
     HUD popovers — moved into this panel instead of being thrown away. */
  var NATIVE_GEAR = '#dbgFab,.dbg-fab,#dbgBtn,button[aria-label="Prototype tour"]';
  /* everything debug, so one shortcut takes it all */
  var CHROME = '#zffGear,#dbg,#dbgFab,.dbg-fab,.dbgbar,#stageNav,.stage-nav,#fbHandle,.fb-handle';

  var css = document.createElement('style');
  css.textContent =
    '#zffGear{position:fixed;left:16px;bottom:16px;z-index:2147483000;width:38px;height:38px;' +
      'border-radius:50%;display:grid;place-items:center;cursor:pointer;' +
      'background:rgba(20,19,18,.88);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);' +
      'border:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.82);' +
      'box-shadow:0 10px 30px rgba(0,0,0,.4);transition:color .16s ease}' +
    '#zffGear:hover{color:#fff}' +
    '#zffGear .zf-pop{position:absolute;left:0;bottom:48px;width:250px;padding:12px;' +
      'border-radius:18px;background:rgba(20,19,18,.95);-webkit-backdrop-filter:blur(26px);' +
      'backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,.11);' +
      'box-shadow:0 18px 48px rgba(0,0,0,.55);color:#fff;display:none;cursor:default;' +
      'font:500 12px/1 ui-sans-serif,system-ui,-apple-system,sans-serif}' +
    '#zffGear.open .zf-pop{display:block}' +
    '#zffGear .zf-h{font-size:8.5px;letter-spacing:.13em;text-transform:uppercase;opacity:.42;' +
      'font-weight:600;padding:1px 2px 8px}' +
    '#zffGear .zf-g{display:grid;grid-template-columns:1fr 1fr;gap:5px}' +
    '#zffGear a{display:block;text-align:left;text-decoration:none;cursor:pointer;color:#fff;' +
      'font-size:11.5px;padding:9px 10px;border-radius:11px;opacity:.66;' +
      'border:1px solid rgba(255,255,255,.16);transition:opacity .16s ease,background .16s ease}' +
    '#zffGear a:hover{opacity:1;background:rgba(255,255,255,.10)}' +
    '#zffGear a.on{opacity:1;background:#fff;color:#141312;border-color:#fff;font-weight:600}' +
    '#zffGear .zf-screen{margin-top:9px;width:100%;text-align:left;cursor:pointer;color:#fff;' +
      'font:500 11.5px/1 ui-sans-serif,system-ui,sans-serif;padding:9px 10px;border-radius:11px;' +
      'background:transparent;border:1px solid rgba(255,255,255,.16);opacity:.66}' +
    '#zffGear .zf-screen:hover{opacity:1;background:rgba(255,255,255,.10)}' +
    '#zffGear .zf-k{font-size:9px;opacity:.36;padding:9px 2px 1px}' +
    'body.zff-nodebug ' + CHROME.split(',').join(',body.zff-nodebug ') + '{display:none!important}' +
    /* one gear only: the page's own is folded in behind This screen */
    NATIVE_GEAR.split(',').join(',') + '{display:none!important}';
  document.head.appendChild(css);

  var gear = document.createElement('div');
  gear.id = 'zffGear';
  gear.setAttribute('role', 'button');
  gear.setAttribute('aria-label', 'Debug controls');
  var stops = '';
  STOPS.forEach(function (s) {
    stops += '<a href="' + s.href + '" data-id="' + s.id + '"' + (s.id === at ? ' class="on"' : '') + '>' + s.label + '</a>';
  });
  gear.innerHTML =
    '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden><circle cx="12" cy="12" r="3"/>' +
      '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 ' +
      '1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 ' +
      '1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 ' +
      '4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 ' +
      '1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 ' +
      '1.65 0 0 0 19.4 9c.14.35.4.64.73.83H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' +
    '<div class="zf-pop"><div class="zf-h">Flow</div><div class="zf-g">' + stops + '</div>' +
      '<div class="zf-h" style="padding-top:11px">Popups</div><div class="zf-g" id="zffPops"></div>' +
      '<button class="zf-screen" type="button" data-screen>This screen’s controls</button>' +
      '<div class="zf-k">← → step this screen · ⌃H hides every debug control</div></div>';
  (document.body || document.documentElement).appendChild(gear);

  var pop = gear.querySelector('.zf-pop');

  /* the HUD popovers, driven by their own chips rather than reimplemented —
     they live in the product bundle and only it knows how to open them */
  var POPS = [
    { label: 'XP', re: /^Level \d+\./ },
    { label: 'Streak', re: /day streak/i },
    { label: 'Credits', re: /^Credits,/ }
  ];
  /* the HUD chips are a mix of <button> and role="button" divs — sweeping only
     buttons found Credits and missed both of the others */
  function chipBy(re) {
    var all = document.querySelectorAll('[aria-label]');
    for (var i = 0; i < all.length; i++) {
      var l = all[i].getAttribute('aria-label');
      if (l && re.test(l) && (all[i].tagName === 'BUTTON' || all[i].getAttribute('role') === 'button' ||
          typeof all[i].onclick === 'function' || all[i].tabIndex >= 0)) return all[i];
    }
    return null;
  }
  (function fillPops(tries) {
    var host = gear.querySelector('#zffPops');
    if (!host) return;
    var found = 0, html = '';
    POPS.forEach(function (pp) {
      if (chipBy(pp.re)) { found++; html += '<a href="#" data-pop="' + pp.label + '">' + pp.label + '</a>'; }
    });
    if (!found) {                             /* the HUD mounts after the first run */
      if ((tries || 0) < 60) return void setTimeout(function () { fillPops((tries || 0) + 1); }, 300);
      host.previousElementSibling.remove(); host.remove(); return;
    }
    host.innerHTML = html;
    host.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-pop]');
      if (!a) return;
      e.preventDefault();
      var want = POPS.filter(function (x) { return x.label === a.dataset.pop; })[0];
      var hit = chipBy(want.re); if (hit) hit.click();
      gear.classList.remove('open');
    });
  })(0);
  gear.addEventListener('click', function (e) {
    if (e.target.closest('[data-screen]')) {
      /* hand straight to whatever this page already had */
      var native = document.getElementById('dbg') || document.getElementById('dbgPanel');
      if (native) {
        if (native.id === 'dbgPanel') native.classList.toggle('open');
        else native.classList.toggle('open'), native.style.display = native.style.display === 'block' ? '' : 'block';
      }
      gear.classList.remove('open');
      return;
    }
    if (pop.contains(e.target)) return;
    gear.classList.toggle('open');
  });
  document.addEventListener('click', function (e) { if (!gear.contains(e.target)) gear.classList.remove('open'); });

  /* already on the map: the first run only plays forward, so switching beats
     has to be a reload rather than a rewind */
  pop.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-id]');
    if (!a || !onHome || !HOME_BEATS[a.dataset.id]) return;
    e.preventDefault();
    location.hash = a.dataset.id;
    location.reload();
  });

  function btnBy(re) {
    var all = document.querySelectorAll('button');
    for (var i = 0; i < all.length; i++) if (re.test(all[i].textContent || '')) return all[i];
    return null;
  }
  function driveHome(target) {
    var n = 0, seen = false;
    (function step() {
      if (++n > 200) return;
      var zfr = document.getElementById('zfr');
      if (!zfr) {
        /* NOT MOUNTED YET is not the same as FINISHED. This script is deferred
           and the app renders its first run afterwards, so on the very first
           tick #zfr does not exist — and the old guard read that as "already
           at the map" and quit. Which is why Home and Post-onboarding both sat
           on the login screen and never advanced. Only treat a missing #zfr as
           the end once we have actually seen it. */
        if (seen) return;
        return void setTimeout(step, 200);
      }
      seen = true;
      var beat = zfr.dataset.beat || '';
      if (beat === 'login') {
        var cb = document.querySelector('.zfr-consent input');
        if (cb && !cb.checked) cb.click();
        /* the button only enables on the re-render AFTER the box is ticked, so
           never latch on the first attempt — retry until the beat moves */
        var sg = btnBy(/sign in with google/i);
        if (sg && !sg.disabled) sg.click();
      } else if (target === 'world') {
        var cta = document.querySelector('.zfr-cta');
        if (cta) cta.click();
      } else if (beat === 'welcome') {
        return;
      }
      setTimeout(step, 200);
    })();
  }
  if (onHome && HOME_BEATS[hash]) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { driveHome(hash); });
    else driveHome(hash);
  }

  /* ── ← → step the screen, whether or not the controls are on show ────────
     Each page has its own idea of a step: the workspace moves a beat of the
     scenario, the onboarding moves one of its eighteen steps, the map moves
     between scenarios. Arrow keys drive whichever of those this page has.

     This keeps working while the debug chrome is hidden, and not by accident:
     a display:none element still answers to .click(), so we drive the page's
     REAL control rather than reaching for the function behind it. One code
     path whether you clicked it or pressed a key, so they can never diverge. */
  /* ── ← → step the screen, and the screens are a chain ──────────────────
     Each page has its own idea of a step: the workspace moves a beat of the
     scenario, the onboarding moves one of its eighteen steps, the map moves
     between scenarios. Arrows drive whichever of those this page has.

     And when a page runs out of steps, forward means the NEXT SCREEN, not the
     last step again. Pressing past the end of the onboarding used to re-enter
     its final step, which re-ran the handoff and stacked another Download the
     app card every time. A flow that reads onboarding, post-onboarding, world,
     stage should walk exactly that way.

     This keeps working while the debug chrome is hidden, and not by accident:
     a display:none element still answers to .click(), so we drive the page's
     REAL control rather than reaching for the function behind it. One code
     path whether you clicked it or pressed a key, so they cannot diverge. */
  var CHAIN = ['onboarding', 'welcome', 'world', 'stage'];
  var HREF = {};
  STOPS.forEach(function (s2) { HREF[s2.id] = s2.href; });

  function localStepper() {
    /* while a deck is being presented, the arrows are the presenter's clicker:
       they step SLIDES (and their cursor walk), not the scenario beat */
    if (document.getElementById('dnNext')) return { prev: '#dnPrev', next: '#dnNext' };
    if (onWorkspace) return { prev: '#stageNav .sn-prev', next: '#stageNav .sn-next' };
    if (onHome) return null;              /* the map's steps are its own beats */
    return { prev: '#dbgPrev', next: '#dbgNext' };
  }
  /* where we stand in the chain right now — on the home that depends on
     whether the first run is still playing */
  function whereAmI() {
    if (onWorkspace) return 'stage';
    if (!onHome) return 'onboarding';
    return document.getElementById('zfr') ? 'welcome' : 'world';
  }
  function goStop(id) { if (HREF[id]) location.href = HREF[id]; }

  function step(dir) {
    var here = whereAmI(), st = localStepper();
    if (st) {
      var el = document.querySelector(st[dir]);
      /* a live control takes it; a disabled one means this screen is spent */
      if (el && !el.disabled) { el.click(); return true; }
    } else if (onHome && here === 'welcome') {
      /* mid first run: its own CTA is the step forward */
      var cta = document.querySelector('.zfr-cta');
      if (dir === 'next' && cta) { cta.click(); return true; }
    }
    /* out of steps: move along the chain rather than repeating the last one */
    var i = CHAIN.indexOf(here);
    if (i < 0) return false;
    var j = dir === 'next' ? i + 1 : i - 1;
    if (j < 0 || j >= CHAIN.length) return false;   /* the ends are the ends */
    goStop(CHAIN[j]);
    return true;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    /* never steal the key from a caret, a form control, or a real shortcut */
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return;
    if (t && t.closest && t.closest('[role="slider"],[data-noarrow]')) return;
    if (step(e.key === 'ArrowLeft' ? 'prev' : 'next')) e.preventDefault();
  }, true);

  function setHidden(v) {
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (err) {}
    document.body.classList.toggle('zff-nodebug', !!v);
  }
  try { if (localStorage.getItem(KEY) === '1') document.body.classList.add('zff-nodebug'); } catch (err) {}

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'h' && e.key !== 'H') return;
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return;
    e.preventDefault();
    setHidden(!document.body.classList.contains('zff-nodebug'));
  }, true);
})();

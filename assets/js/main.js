/* ============================================================
   Portfolio runtime — no dependencies.
   Every module is isolated in its own try/catch, and nothing in the
   CSS hides content unless this script explicitly opts in, so a
   failure here degrades to a static (fully readable) page.
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const safe = (name, fn) => { try { fn(); } catch (err) { console.warn('[' + name + ']', err); } };

  document.addEventListener('DOMContentLoaded', () => {
    safe('reveal', initReveal);
    safe('menu', initMenu);
    safe('arm', initArm);
    safe('scroll', initScroll);
    safe('projects', initProjectPin);
  });

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    if (!('IntersectionObserver' in window) || reduced) return;
    const els = document.querySelectorAll('.rv');
    els.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => io.observe(el));
    // Safety net: anything still hidden after 4 s gets shown regardless.
    setTimeout(() => els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight) el.classList.add('in');
    }), 4000);
  }

  /* ---------------- Mobile menu ---------------- */
  function initMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    const close = document.getElementById('mobile-menu-close');
    if (!toggle || !menu || !backdrop) return;
    const open = () => { menu.classList.add('open'); backdrop.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; };
    const shut = () => { menu.classList.remove('open'); backdrop.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
    toggle.addEventListener('click', () => menu.classList.contains('open') ? shut() : open());
    if (close) close.addEventListener('click', shut);
    backdrop.addEventListener('click', shut);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
    addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
  }

  /* ---------------- Scroll: chapter rail, progress, timeline, hero exit ---------------- */
  function initScroll() {
    const chapters = [
      ['home', 'Home'], ['operator', '00 · About'], ['experience', '01 · Experience'],
      ['projects', '02 · Projects'], ['publications', '03 · Publications'], ['education', '04 · Education'],
      ['awards', '05 · Awards'], ['skills', '06 · Skills'], ['contact', '07 · Contact']
    ].map(([id, label]) => ({ el: document.getElementById(id), id, label })).filter(c => c.el);

    const railLabel = document.getElementById('rail-label');
    const railFill = document.getElementById('rail-fill');
    const railT = document.getElementById('rail-t');
    const topFill = document.getElementById('topbar-fill');
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    const tl = document.getElementById('timeline');
    const tlFill = document.getElementById('tl-fill');
    const logs = tl ? Array.from(tl.querySelectorAll('.log')) : [];
    const heroContent = document.getElementById('hero-content');
    const heroHint = document.querySelector('.hero-hint');
    const telemetry = document.querySelector('.telemetry');

    let current = '';
    let ticking = false;

    function update() {
      ticking = false;
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? clamp(y / max, 0, 1) : 0;

      if (railFill) railFill.style.height = (p * 100) + '%';
      if (topFill) topFill.style.width = (p * 100) + '%';
      if (railT) railT.textContent = 't = ' + p.toFixed(2);

      const probe = innerHeight * 0.4;
      let active = chapters[0];
      chapters.forEach(c => { if (c.el.getBoundingClientRect().top <= probe) active = c; });
      if (active && active.id !== current) {
        current = active.id;
        if (railLabel) railLabel.textContent = active.label;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
      }

      if (tl && tlFill) {
        const r = tl.getBoundingClientRect();
        const mid = innerHeight * 0.55;
        tlFill.style.height = (clamp((mid - r.top) / r.height, 0, 1) * 100) + '%';
        logs.forEach(l => l.classList.toggle('passed', l.getBoundingClientRect().top + 40 < mid));
      }

      // Hero exit: text drifts *up* (never down into the bottom-anchored hint
      // and arm base) and fades; the hint and telemetry fade out quickly.
      if (heroContent && !reduced) {
        const k = clamp(y / (innerHeight * 0.7), 0, 1);
        heroContent.style.transform = 'translate3d(0,' + (-y * 0.12).toFixed(1) + 'px,0)';
        heroContent.style.opacity = (1 - k).toFixed(3);
        const q = clamp(1 - y / (innerHeight * 0.25), 0, 1).toFixed(3);
        if (heroHint) heroHint.style.opacity = q;
        if (telemetry) telemetry.style.opacity = clamp(1 - y / (innerHeight * 0.5), 0, 1).toFixed(3);
      }
    }

    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
  }

  /* ---------------- Projects: pinned horizontal track ---------------- */
  function initProjectPin() {
    const pin = document.getElementById('proj-pin');
    const track = document.getElementById('proj-track');
    const fill = document.getElementById('proj-progress-fill');
    if (!pin || !track) return;

    let dist = 0, top = 0, enabled = false;

    function measure() {
      let want = innerWidth >= 1024 && innerHeight >= 640 && !reduced;
      pin.classList.toggle('is-pinned', want);
      track.style.transform = '';
      // Only pin if the whole panel actually fits in the viewport; otherwise
      // fall back to the static grid rather than clipping content.
      const sticky = pin.querySelector('.proj-sticky');
      const need = sticky ? Array.from(sticky.children).reduce((h, c) => h + c.getBoundingClientRect().height, 0)
        + (parseFloat(getComputedStyle(sticky).paddingTop) || 0) + 56 : 0; // + progress bar margin & breathing room
      if (want && need > innerHeight) {
        want = false; pin.classList.remove('is-pinned');
      }
      if (!want) { pin.style.height = ''; enabled = false; if (fill) fill.style.width = ''; return; }

      const items = track.children;
      const last = items[items.length - 1];
      const padR = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const content = last.getBoundingClientRect().right - track.getBoundingClientRect().left + padR;
      dist = Math.max(0, content - track.clientWidth);
      pin.style.height = (innerHeight + dist) + 'px';
      top = pin.getBoundingClientRect().top + scrollY;
      enabled = dist > 0;
      apply();
    }

    function apply() {
      if (!enabled) return;
      const p = clamp((scrollY - top) / dist, 0, 1);
      track.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
      if (fill) fill.style.width = (p * 100) + '%';
    }

    let raf = 0;
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; apply(); }); }, { passive: true });
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 120); });
    addEventListener('load', measure); // images change layout
    measure();
  }

  /* ---------------- Hero: live 4-DOF planar arm, DLS IK ----------------
     Task: 2-D end-effector position (m = 2), n = 4 revolute joints, r = 2.
       Δq = J# e + (I − J# J) Δq₀,   J# = Jᵀ (J Jᵀ + λ² I)⁻¹
     Adaptive damping (Maciejewski / Nakamura style):
       λ² = λ_max² (1 − (σ_min/ε)²)  if σ_min < ε, else 0
     Δq₀ = −k (q − q_rest) keeps a natural posture in the null space.
     Units are normalized so that Σ Lᵢ = 1 (the reach). */
  function initArm() {
    const canvas = document.getElementById('arm-canvas');
    const hero = document.getElementById('home');
    if (!canvas || !hero || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');

    const L = [0.34, 0.29, 0.22, 0.15];
    const N = L.length;
    const qRest = [-1.75, 0.55, 0.55, 0.45];
    const q = qRest.slice();
    const EPS = 0.12, LMAX = 0.10, STEP = 0.06, K0 = 0.03, QLIM = 2.3; // ±132°: links can't fold back over each other

    const SIG = '92,225,230', AMB = '255,181,71';
    let W = 0, H = 0, R = 1, base = { x: 0, y: 0 }, mobile = false, stageRect = null;
    let goal = { x: -0.15, y: -0.6 };     // desired (pointer or idle path)
    let tgt = { x: -0.15, y: -0.6 };      // smoothed target the solver sees
    let lastPointer = -1e9;
    const trail = [];
    let stats = { en: 0, w: 0, kappa: 0, lam: 0, dist: 0 };

    const tm = {};
    ['q1', 'q2', 'q3', 'q4', 'e', 'w', 'k', 'l', 'state'].forEach(k => tm[k] = document.getElementById('tm-' + k));

    function resize() {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mobile = W < 860;
      stageRect = null;
      const st = document.getElementById('arm-stage');
      if (mobile && st && st.offsetParent !== null) {
        const s = st.getBoundingClientRect();
        stageRect = { x: s.left - r.left, y: s.top - r.top, w: s.width, h: s.height };
        base = { x: stageRect.x + stageRect.w * 0.5, y: stageRect.y + stageRect.h - 34 };
        R = Math.min(240, stageRect.h - 70, stageRect.w * 0.62);
      } else if (mobile) { base = { x: W * 0.3, y: H - 76 }; R = Math.min(260, W * 0.56, H * 0.32); }
      else { base = { x: W * 0.72, y: H * 0.95 }; R = Math.min(H * 0.68, W * 0.36); }
    }

    function setGoalFromClient(cx, cy) {
      const r = canvas.getBoundingClientRect();
      if (cy < r.top || cy > r.bottom) return;
      if (stageRect) { // mobile: only taps inside the stage steer the arm
        const lx = cx - r.left, ly = cy - r.top;
        if (lx < stageRect.x || lx > stageRect.x + stageRect.w || ly < stageRect.y || ly > stageRect.y + stageRect.h) return;
      }
      goal ={ x: (cx - r.left - base.x) / R, y: (cy - r.top - base.y) / R };
      lastPointer = performance.now();
    }
    addEventListener('pointermove', e => setGoalFromClient(e.clientX, e.clientY), { passive: true });
    canvas.addEventListener('pointerdown', e => setGoalFromClient(e.clientX, e.clientY), { passive: true });

    function solve() {
      // forward kinematics + Jacobian (relative joint angles)
      const c = new Array(N), s = new Array(N);
      let th = 0, px = 0, py = 0;
      for (let i = 0; i < N; i++) { th += q[i]; c[i] = Math.cos(th); s[i] = Math.sin(th); px += L[i] * c[i]; py += L[i] * s[i]; }
      const J0 = new Array(N), J1 = new Array(N);
      let sx = 0, sy = 0;
      for (let i = N - 1; i >= 0; i--) { sx += L[i] * s[i]; sy += L[i] * c[i]; J0[i] = -sx; J1[i] = sy; }

      let ex = tgt.x - px, ey = tgt.y - py;
      const en = Math.hypot(ex, ey);
      if (en > STEP) { ex *= STEP / en; ey *= STEP / en; }

      // Singular values of the full J (reported: w, κ)
      const sv = (A0, A1) => {
        let a11 = 0, a12 = 0, a22 = 0;
        for (let i = 0; i < N; i++) { a11 += A0[i] * A0[i]; a12 += A0[i] * A1[i]; a22 += A1[i] * A1[i]; }
        const tr = a11 + a22, det = a11 * a22 - a12 * a12;
        const disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
        return { a11, a12, a22, det, smax: Math.sqrt(tr / 2 + disc), smin: Math.sqrt(Math.max(0, tr / 2 - disc)) };
      };
      const full = sv(J0, J1);

      // Saturation handling: a joint at its limit whose step would push it
      // further out is removed from the task (its Jacobian column zeroed) and
      // the step is recomputed. It then lives entirely in the null space, where
      // the posture term pulls it back off the limit. Clamping after the fact
      // instead leaves the arm stuck in a folded local minimum.
      const active = new Array(N).fill(true);
      const dq = new Array(N);
      let lam2 = 0;
      for (let pass = 0; pass < N; pass++) {
        const A0 = J0.map((v, i) => active[i] ? v : 0), A1 = J1.map((v, i) => active[i] ? v : 0);
        const m = sv(A0, A1);
        lam2 = (m.smin < EPS ? LMAX * LMAX * (1 - (m.smin / EPS) ** 2) : 0) + 1e-8;
        const m11 = m.a11 + lam2, m22 = m.a22 + lam2, d = m11 * m22 - m.a12 * m.a12;
        const i11 = m22 / d, i12 = -m.a12 / d, i22 = m11 / d;
        // Δq = J# e + (I − J# J) g ,  J# = Jᵀ (J Jᵀ + λ² I)⁻¹
        const g = q.map((qi, i) => -K0 * (qi - qRest[i]));
        let Jg0 = 0, Jg1 = 0;
        for (let i = 0; i < N; i++) { Jg0 += A0[i] * g[i]; Jg1 += A1[i] * g[i]; }
        for (let i = 0; i < N; i++) {
          const s0 = A0[i] * i11 + A1[i] * i12, s1 = A0[i] * i12 + A1[i] * i22;
          dq[i] = s0 * ex + s1 * ey + g[i] - (s0 * Jg0 + s1 * Jg1);
        }
        let changed = false;
        for (let i = 1; i < N; i++) {
          if (active[i] && Math.abs(q[i] + dq[i]) > QLIM && Math.sign(dq[i]) === Math.sign(q[i])) { active[i] = false; changed = true; }
        }
        if (!changed) break;
      }
      let limited = false;
      for (let i = 0; i < N; i++) {
        q[i] += dq[i];
        if (i > 0) { const c2 = clamp(q[i], -QLIM, QLIM); if (c2 !== q[i]) limited = true; q[i] = c2; }
        if (!active[i]) limited = true;
      }
      return {
        en, w: Math.sqrt(Math.max(full.det, 0)),
        kappa: full.smin > 1e-9 ? full.smax / full.smin : Infinity,
        lam: Math.sqrt(lam2), dist: Math.hypot(tgt.x, tgt.y), limited
      };
    }

    function joints() {
      const pts = [{ x: base.x, y: base.y }];
      let th = 0, x = base.x, y = base.y;
      for (let i = 0; i < N; i++) { th += q[i]; x += L[i] * R * Math.cos(th); y += L[i] * R * Math.sin(th); pts.push({ x, y, th }); }
      return pts;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (stageRect) { // confine the arm to its stage on mobile
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(stageRect.x + 1, stageRect.y + 1, stageRect.w - 2, stageRect.h - 2, 13);
        else ctx.rect(stageRect.x + 1, stageRect.y + 1, stageRect.w - 2, stageRect.h - 2);
        ctx.clip();
      }
      const warn =stats.dist > 0.995 || stats.kappa > 22;
      const col = warn ? AMB : SIG;

      // workspace boundary ∂W: |p| = ΣLᵢ
      ctx.save();
      ctx.setLineDash([3, 9]); ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(' + SIG + ',0.16)';
      ctx.beginPath(); ctx.arc(base.x, base.y, R, Math.PI, 2 * Math.PI); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath(); ctx.arc(base.x, base.y, R * 0.5, Math.PI, 2 * Math.PI); ctx.stroke();
      ctx.restore();
      if (!mobile) {
        ctx.font = '11px "JetBrains Mono", monospace'; ctx.fillStyle = 'rgba(154,163,172,0.55)'; ctx.textAlign = 'center';
        ctx.fillText('∂W  ·  ‖p‖ = ΣLᵢ', base.x, base.y - R - 10);
        // base frame
        ctx.strokeStyle = 'rgba(' + SIG + ',0.55)'; ctx.lineWidth = 1.2;
        arrow(base.x + 26, base.y - 8, base.x + 66, base.y - 8);
        arrow(base.x + 26, base.y - 8, base.x + 26, base.y - 48);
        ctx.fillStyle = 'rgba(' + SIG + ',0.7)'; ctx.textAlign = 'left';
        ctx.fillText('x₀', base.x + 70, base.y - 4); ctx.fillText('y₀', base.x + 30, base.y - 52);
      }

      // ground hatch
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(base.x - 46, base.y + 1); ctx.lineTo(base.x + 46, base.y + 1); ctx.stroke();
      for (let k = -40; k <= 40; k += 10) { ctx.beginPath(); ctx.moveTo(base.x + k, base.y + 1); ctx.lineTo(base.x + k - 8, base.y + 10); ctx.stroke(); }

      const P = joints();
      const ee = P[N];

      // end-effector trail
      trail.push({ x: ee.x, y: ee.y }); if (trail.length > 90) trail.shift();
      for (let i = 1; i < trail.length; i++) {
        ctx.strokeStyle = 'rgba(' + SIG + ',' + (i / trail.length * 0.5).toFixed(3) + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(trail[i - 1].x, trail[i - 1].y); ctx.lineTo(trail[i].x, trail[i].y); ctx.stroke();
      }

      // error vector e = x_d − x
      const tx = base.x + tgt.x * R, ty = base.y + tgt.y * R;
      ctx.save(); ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(' + col + ',0.6)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ee.x, ee.y); ctx.lineTo(tx, ty); ctx.stroke(); ctx.restore();

      // links
      const widths = [18, 14, 11, 8].map(w => mobile ? w * 0.75 : w);
      ctx.lineCap = 'round';
      for (let i = 0; i < N; i++) {
        ctx.strokeStyle = 'rgba(' + SIG + ',0.5)'; ctx.lineWidth = widths[i] + 2.5;
        ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[i + 1].x, P[i + 1].y); ctx.stroke();
        ctx.strokeStyle = '#0E1318'; ctx.lineWidth = widths[i];
        ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[i + 1].x, P[i + 1].y); ctx.stroke();
        ctx.strokeStyle = 'rgba(232,236,239,0.10)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[i + 1].x, P[i + 1].y); ctx.stroke();
      }
      // joints
      for (let i = 0; i < N; i++) {
        const r = widths[i] * 0.62;
        ctx.fillStyle = '#07080A'; ctx.strokeStyle = 'rgb(' + col + ')'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(P[i].x, P[i].y, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgb(' + col + ')';
        ctx.beginPath(); ctx.arc(P[i].x, P[i].y, 1.8, 0, 2 * Math.PI); ctx.fill();
        if (!mobile) {
          ctx.font = '10px "JetBrains Mono", monospace'; ctx.fillStyle = 'rgba(154,163,172,0.7)'; ctx.textAlign = 'left';
          ctx.fillText('q' + (i + 1), P[i].x + r + 5, P[i].y - r - 2);
        }
      }
      // gripper
      const th = ee.th, ux = Math.cos(th), uy = Math.sin(th), nx = -uy, ny = ux;
      ctx.strokeStyle = 'rgb(' + col + ')'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ee.x + nx * 8, ee.y + ny * 8); ctx.lineTo(ee.x - nx * 8, ee.y - ny * 8);
      ctx.moveTo(ee.x + nx * 8, ee.y + ny * 8); ctx.lineTo(ee.x + nx * 8 + ux * 11, ee.y + ny * 8 + uy * 11);
      ctx.moveTo(ee.x - nx * 8, ee.y - ny * 8); ctx.lineTo(ee.x - nx * 8 + ux * 11, ee.y - ny * 8 + uy * 11);
      ctx.stroke();

      // target reticle
      ctx.strokeStyle = 'rgb(' + col + ')'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(tx, ty, 11, 0, 2 * Math.PI); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx - 18, ty); ctx.lineTo(tx - 6, ty); ctx.moveTo(tx + 6, ty); ctx.lineTo(tx + 18, ty);
      ctx.moveTo(tx, ty - 18); ctx.lineTo(tx, ty - 6); ctx.moveTo(tx, ty + 6); ctx.lineTo(tx, ty + 18);
      ctx.stroke();
      if (!mobile) {
        ctx.font = '10px "JetBrains Mono", monospace'; ctx.fillStyle = 'rgba(' + col + ',0.85)'; ctx.textAlign = 'left';
        ctx.fillText('x_d', tx + 15, ty - 13);
      }
      ctx.restore();
    }

    function arrow(x1, y1, x2, y2) {
      const a = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.lineTo(x2 - 6 * Math.cos(a - 0.45), y2 - 6 * Math.sin(a - 0.45));
      ctx.moveTo(x2, y2); ctx.lineTo(x2 - 6 * Math.cos(a + 0.45), y2 - 6 * Math.sin(a + 0.45));
      ctx.stroke();
    }

    const fmtDeg = r => { const d = r * 180 / Math.PI; return (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(1) + '°'; };
    const fmtSci = v => v < 1e-3 ? v.toExponential(1) : v.toFixed(4);

    function telemetry() {
      if (!tm.q1) return;
      tm.q1.textContent = fmtDeg(q[0]); tm.q2.textContent = fmtDeg(q[1]);
      tm.q3.textContent = fmtDeg(q[2]); tm.q4.textContent = fmtDeg(q[3]);
      tm.e.textContent = fmtSci(stats.en);
      tm.w.textContent = stats.w.toFixed(4);
      tm.k.textContent = isFinite(stats.kappa) ? stats.kappa.toFixed(2) : '∞';
      tm.l.textContent = stats.lam < 1e-3 ? '0' : stats.lam.toFixed(4);
      let s = 'TRACKING', warn = false;
      if (stats.dist > 0.995) { s = 'OUT OF REACH · DAMPED'; warn = true; }
      else if (stats.limited && stats.en > 0.01) { s = 'JOINT LIMIT'; warn = true; }
      else if (stats.kappa > 22) { s = 'NEAR SINGULAR'; warn = true; }
      else if (stats.en < 0.004) { s = 'CONVERGED'; }
      tm.state.textContent = s;
      tm.state.classList.toggle('warn', warn);
    }

    let running = true, frame = 0, t0 = performance.now();
    function loop(now) {
      if (!running) return;
      const idle = now - lastPointer > 2600;
      if (idle && !reduced) {
        const t = (now - t0) / 1000 * 0.55;
        goal = { x: -0.18 + 0.30 * Math.sin(t), y: -0.58 + 0.17 * Math.sin(2 * t) };
      }
      const a = idle ? 0.08 : 0.2;
      tgt.x += (goal.x - tgt.x) * a; tgt.y += (goal.y - tgt.y) * a;
      for (let k = 0; k < 3; k++) stats = solve();
      draw();
      if ((frame++ & 3) === 0) telemetry();
      requestAnimationFrame(loop);
    }

    resize();
    addEventListener('resize', resize);
    // hero height changes when web fonts load / mobile toolbars collapse
    if ('ResizeObserver' in window) new ResizeObserver(() => resize()).observe(hero);
    // converge to the initial goal before the first paint
    for (let k = 0; k < 60; k++) stats = solve();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        const was = running; running = e.isIntersecting;
        if (running && !was) requestAnimationFrame(loop);
      }).observe(hero);
    }
    requestAnimationFrame(loop);
  }
})();
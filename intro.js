// Fractal tree loading animation.
(() => {
// 인트로 요소·상태 초기화 시작
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  const canvas = document.getElementById('tree-canvas');
  const ctx = canvas.getContext('2d');
  document.body.classList.add('intro-active');
  site.setAttribute('inert', '');
  site.setAttribute('aria-hidden', 'true');
  // Recover if drawing fails, so the page never stays locked.
  const fallback = setTimeout(revealSite, 10000);
  const counter = document.getElementById('progress-number');
  const progressBar = document.querySelector('.intro-progress');
  const progressFill = document.getElementById('progress-fill');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = 6500;
  let segments = [], motes = [], width = 0, height = 0, start = 0, lastValue = -1, done = false, resizeTimer;
// 인트로 요소·상태 초기화 끝

// 인트로 종료·본문 열기 시작
  function revealSite() {
    if (done) return;
    done = true;
    clearTimeout(fallback);
    site.classList.add('ready');
    site.removeAttribute('inert');
    site.removeAttribute('aria-hidden');
    document.body.classList.remove('intro-active');
    intro.classList.add('finished');
    intro.setAttribute('aria-hidden', 'true');
    setTimeout(() => intro.remove(), reduced ? 0 : 1200);
  }
// 인트로 종료·본문 열기 끝

// 진행률 표시 시작
  function updateProgress(percent) {
    counter.textContent = `${percent}%`;
    progressFill.style.height = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', String(percent));
  }
// 진행률 표시 끝

// 프랙탈 나무·입자 생성 시작
  function build() {
    const rect = intro.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    segments = [];
    const scale = Math.min(width / 900, height / 760, 1.3);
    const length = Math.max(82, Math.min(155, height * .20)) * Math.max(.72, scale);
    let seed = 38921;
    const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    function grow(x, y, angle, len, depth, birth, lineWidth) {
      if (depth > 10 || len < 1.6) return;
      const nx = x + Math.cos(angle) * len, ny = y + Math.sin(angle) * len;
      const end = Math.min(1, birth + .074 * Math.pow(.84, depth));
      segments.push({x, y, nx, ny, birth, end, lineWidth, depth});
      if (depth === 10) return;
      const spread = .32 + depth * .016;
      const nextBirth = end - .006;
      grow(nx, ny, angle - spread - rand() * .19, len * (.77 + rand() * .05), depth + 1, nextBirth, lineWidth * .72);
      grow(nx, ny, angle + spread + rand() * .19, len * (.77 + rand() * .05), depth + 1, nextBirth, lineWidth * .72);
      if (depth > 3 && depth < 9 && rand() < .38) {
        grow(nx, ny, angle + (rand() < .5 ? -1 : 1) * (.15 + rand() * .24), len * .62, depth + 1, nextBirth + .018, lineWidth * .53);
      }
    }
    const baseX = width * .5, baseY = height * .98;
    grow(baseX, baseY, -Math.PI / 2, length, 0, 0, Math.max(2.8, 6 * scale));
    motes = Array.from({length: 46}, () => ({x:rand()*width,y:rand()*height,r:.3+rand()*1.35,phase:rand()*6.28}));
  }
// 프랙탈 나무·입자 생성 끝

// 캔버스 그리기 시작
  function draw(progress, seconds) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';
    for (const s of segments) {
      if (progress <= s.birth) continue;
      const fraction = Math.min(1, (progress - s.birth) / (s.end - s.birth));
      const x = s.x + (s.nx-s.x)*fraction, y = s.y + (s.ny-s.y)*fraction;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(x, y);
      ctx.lineWidth = s.lineWidth + (s.depth >= 8 ? .15 : 0);
      ctx.strokeStyle = `rgba(255,255,255,${s.depth < 3 ? .94 : .54 + s.depth*.037})`;
      ctx.shadowBlur = s.depth < 4 ? 12 : 6;
      ctx.shadowColor = 'rgba(255,255,255,.45)';
      ctx.stroke();
      if (s.depth >= 9 && fraction >= 1) {
        ctx.beginPath();
        ctx.arc(x,y,Math.max(.45,s.lineWidth*.57),0,Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,.76)';
        ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
    for (const m of motes) {
      const a = .12 + .23 * (1 + Math.sin(seconds * .85 + m.phase)) / 2;
      ctx.beginPath();
        ctx.arc(m.x + Math.sin(seconds*.35+m.phase)*4,m.y - seconds*2 % (height+20),m.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    }
  }
// 캔버스 그리기 끝

// 애니메이션 프레임 시작
  function frame(now) {
    if (done) return;
    if (!start) start = now;
    const elapsed = Math.min(1, (now-start)/duration);
    const growth = 1 - Math.pow(1-elapsed, 1.4);
    const percent = Math.min(100, Math.floor(elapsed * 100));
    if (percent !== lastValue) {
      updateProgress(percent);
      lastValue = percent;
    }
    draw(growth, (now-start)/1000);
    if (elapsed < 1) requestAnimationFrame(frame);
    else setTimeout(revealSite, 850);
  }
// 애니메이션 프레임 끝

// 인트로 실행·크기 변경 처리 시작
  if (reduced || !ctx) {
    updateProgress(100);
    revealSite();
  } else {
    build();
    requestAnimationFrame(frame);
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (!done) build(); }, 100);
    }, {passive:true});
  }
// 인트로 실행·크기 변경 처리 끝
})();

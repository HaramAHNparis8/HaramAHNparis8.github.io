// Scroll effects are independent of the intro and content renderer.
(() => {
// 스크롤 효과 초기화·동작 줄이기 시작
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('visible'));
    return;
  }
// 스크롤 효과 초기화·동작 줄이기 끝

// 화면 진입 감지·등장 효과 시작
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px 45px 0px' });

  items.forEach(item => {
    item.classList.add('reveal-pending');
    observer.observe(item);
  });
// 화면 진입 감지·등장 효과 끝

// 스크롤 배경 이동 시작
  const ambient = document.querySelector('.ambient');
  let queued = false;
  addEventListener('scroll', () => {
    if (queued || !ambient) return;
    queued = true;
    requestAnimationFrame(() => {
      ambient.style.setProperty('--scroll-shift', `${Math.min(scrollY, 1800)}px`);
      queued = false;
    });
  }, { passive: true });
// 스크롤 배경 이동 끝
})();

export default function initScroll() {
  const topBtn = document.querySelector('#scrollToTopBtn');
  if (!topBtn) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => {
    const visible = window.scrollY > 300;
    topBtn.classList.toggle('show', visible);
    topBtn.inert = !visible;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: motion.matches ? 'instant' : 'smooth',
    });
  });
}

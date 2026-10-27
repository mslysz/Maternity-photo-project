export default function initShowcase() {
  const items = [...document.querySelectorAll('.js-reveal-left')];
  if (!items.length) return;
  const reveal = (target) => target.classList.add('is-visible');
  if (
    !('IntersectionObserver' in window) ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    items.forEach(reveal);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        setTimeout(() => reveal(target), Number(target.dataset.delay) || 0);
        observer.unobserve(target);
      });
    },
    { threshold: 0.2 },
  );
  items.forEach((item) => {
    item.classList.add('reveal-pending');
    observer.observe(item);
  });
}

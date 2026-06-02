export default function initScroll() {
  const el = (selector) => document.querySelector(selector);
  const topBtn = el('#scrollToTopBtn');

  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (
      document.body.scrollTop > 300 ||
      document.documentElement.scrollTop > 300
    ) {
      topBtn.classList.add('show');
    } else {
      topBtn.classList.remove('show');
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

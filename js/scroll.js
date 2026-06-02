export default function initScroll() {
  const el = (selector) => document.querySelector(selector);
  const topBtn = el('#scrollToTopBtn');
  const footerLogo = el('.footer__logo-link');

  if (!topBtn) return;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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

  topBtn.addEventListener('click', scrollToTop);

  if (footerLogo) {
    footerLogo.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToTop();
    });
  }
}

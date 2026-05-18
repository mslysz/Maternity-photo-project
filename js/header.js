export default function initHeader() {
  const el = (selector) => document.querySelector(selector);

  const header = el('.header');
  const burgerBtn = el('.header__burger-btn');
  const closeBtn = el('.nav__close-btn');
  const nav = el('.nav');
  const overlay = el('#js-nav-overlay');

  if (!burgerBtn || !closeBtn || !nav || !overlay) return;

  const openMenu = () => {
    nav.classList.add('nav--open');
    overlay.classList.add('nav-overlay--active');
    burgerBtn.classList.add('header__burger-btn--hide');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeMenu = () => {
    nav.classList.remove('nav--open');
    overlay.classList.remove('nav-overlay--active');
    burgerBtn.classList.remove('header__burger-btn--hide');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burgerBtn.focus();
  };

  burgerBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('nav--open')) {
      closeMenu();
    }
  });

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (nav.classList.contains('nav--open')) return;

    const currentScroll = window.scrollY;
    if (currentScroll > lastScrollY && currentScroll > 50) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScrollY = currentScroll;
  });
}

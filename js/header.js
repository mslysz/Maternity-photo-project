export default function initHeader() {
  const el = (selector) => document.querySelector(selector);

  const burgerBtn = el('.header__burger-btn');
  const closeBtn = el('.nav__close-btn');
  const nav = el('.nav');

  if (!burgerBtn || !closeBtn || !nav) return;

  const openMenu = () => {
    nav.classList.add('nav--open');
    burgerBtn.classList.add('header__burger-btn--hide');
    burgerBtn.setAttribute('aria-expanded', true);
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeMenu = () => {
    nav.classList.remove('nav--open');
    burgerBtn.classList.remove('header__burger-btn--hide');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burgerBtn.focus();
  };

  burgerBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('nav--open')) {
      closeMenu();
    }
  });
}

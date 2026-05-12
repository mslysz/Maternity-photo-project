export default function initHeader() {
  const el = (selector) => document.querySelector(selector);

  const burger = el('.header__burger');
  const closeBurger = el('.nav__close-burger');
  const nav = el('.nav');

  const toggleMenu = () => {
    nav.classList.toggle('nav--open');
    burger.classList.toggle('header__burger--hide');
    document.body.style.overflow = nav.classList.contains('nav--open')
      ? 'hidden'
      : '';
  };

  burger.addEventListener('click', toggleMenu);
  closeBurger.addEventListener('click', toggleMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('nav--open')) {
      toggleMenu();
    }
  });
}

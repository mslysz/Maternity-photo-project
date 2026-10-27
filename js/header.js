export default function initHeader() {
  const el = (selector) => document.querySelector(selector);

  const header = el('.header');
  const burgerBtn = el('.header__burger-btn');
  const closeBtn = el('.nav__close-btn');
  const nav = el('.nav');
  const overlay = el('#js-nav-overlay');

  if (!header || !burgerBtn || !closeBtn || !nav || !overlay) return;

  const background = [...document.body.children].filter(
    (element) =>
      element !== nav && element !== overlay && element.tagName !== 'SCRIPT',
  );
  let backgroundState = [];
  let previousOverflow = '';
  header.classList.add('header--enhanced');
  nav.classList.add('nav--enhanced');
  nav.inert = true;

  const openMenu = () => {
    previousOverflow = document.body.style.overflow;
    backgroundState = background.map((element) => [element, element.inert]);
    nav.inert = false;
    nav.classList.add('nav--open');
    overlay.classList.add('nav-overlay--active');
    burgerBtn.classList.add('header__burger-btn--hide');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    background.forEach((element) => {
      element.inert = true;
    });
  };

  const closeMenu = () => {
    nav.classList.remove('nav--open');
    overlay.classList.remove('nav-overlay--active');
    burgerBtn.classList.remove('header__burger-btn--hide');
    burgerBtn.setAttribute('aria-expanded', 'false');
    backgroundState.forEach(([element, inert]) => {
      element.inert = inert;
    });
    document.body.style.overflow = previousOverflow;
    burgerBtn.focus();
    nav.inert = true;
  };

  burgerBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('nav--open')) {
      closeMenu();
    }
    if (event.key === 'Tab' && nav.classList.contains('nav--open')) {
      const focusable = [
        ...nav.querySelectorAll('a[href], button:not([disabled])'),
      ];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  let lastScrollY = window.scrollY;

  const updateHeader = () => {
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
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

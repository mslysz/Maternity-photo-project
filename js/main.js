//Selects the first element that matches the given CSS selector.
const el = (selector) => document.querySelector(selector);
///////
const burger = el('.header__burger');
const closeBurger = el('.nav__close-burger');
const nav = el('.nav');
const aboutImage = el('.about_image');

const toggleMenu = () => {
  nav.classList.toggle('nav--open');
  burger.classList.toggle('header__burger--hide');
};

burger.addEventListener('click', toggleMenu);
closeBurger.addEventListener('click', toggleMenu);

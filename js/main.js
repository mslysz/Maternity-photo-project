const burger = document.querySelector('.header__burger');
const closeBurger = document.querySelector('.nav__close-burger');
const nav = document.querySelector('.nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('nav--open');
  burger.classList.toggle('header__burger--hide');
});

closeBurger.addEventListener('click', () => {
  nav.classList.toggle('nav--open');
  burger.classList.toggle('header__burger--hide');
});

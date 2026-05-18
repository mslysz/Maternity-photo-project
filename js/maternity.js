export default function initMaternity() {
  const el = (selector) => document.querySelector(selector);
  const allEl = (selector) => [...document.querySelectorAll(selector)];
  const matSection = el('.maternity');
  const matHeader = el('.maternity__header');
  const matCards = allEl('.maternity__card');

  window.addEventListener('scroll', () => {
    const vh = window.innerHeight;
    const sectionTop = matSection.getBoundingClientRect().top;

    //Header trigger
    if (sectionTop < vh * 0.7) {
      matHeader.classList.add('maternity__header--visible');
    } else {
      matHeader.classList.remove('maternity__header--visible');
    }
    //Cards trigger
    matCards.forEach((card) => {
      const cartTop = card.getBoundingClientRect().top;

      if (cartTop < vh * 0.8) {
        card.classList.add('maternity__card--visible');
      } else {
        card.classList.remove('maternity__card--visible');
      }
    });
  });
}

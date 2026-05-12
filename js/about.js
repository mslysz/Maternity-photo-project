export default function initAbout() {
  const el = (selector) => document.querySelector(selector);

  const aboutSection = el('.about');
  const aboutImage = el('.about__image');
  const aboutText = el('.about__content');

  window.addEventListener('scroll', () => {
    const vh = window.innerHeight;

    const imageTop = aboutImage.getBoundingClientRect().top;
    const sectionTop = aboutSection.getBoundingClientRect().top;

    //Image trigger
    if (sectionTop < vh * 0.7) {
      aboutImage.classList.add('about__image--visible');
    } else {
      aboutImage.classList.remove('about__image--visible');
    }
    //Text trigger
    if (imageTop < vh * 0.1) {
      aboutText.classList.add('about__content--visible');
    } else {
      aboutText.classList.remove('about__content--visible');
    }
  });
}

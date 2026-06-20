export default function initAbout() {
  const el = (selector) => document.querySelector(selector);

  const aboutSection = el('.about');
  const aboutImage = el('.about__image');
  const aboutText = el('.about__content');

  if (!aboutSection || !aboutImage || !aboutText) {
    return;
  }

  window.addEventListener('scroll', () => {
    const vh = window.innerHeight;

    const imageTop = aboutImage.getBoundingClientRect().top;
    const textTop = aboutText.getBoundingClientRect().top;

    // Image trigger
    if (imageTop < vh * 0.75) {
      aboutImage.classList.add('about__image--visible');
    } else {
      aboutImage.classList.remove('about__image--visible');
    }

    // Text trigger
    if (textTop < vh * 0.7) {
      aboutText.classList.add('about__content--visible');
    } else {
      aboutText.classList.remove('about__content--visible');
    }
  });
}

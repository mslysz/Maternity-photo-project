export default function initMaternity() {
  const el = (selector) => document.querySelector(selector);
  const allEl = (selector) => [...document.querySelectorAll(selector)];

  //HOME section
  const matSection = el('.maternity');
  const matHeader = el('.maternity__header');
  const matCards = allEl('.maternity__card');

  // PAGE section
  const pageContent = el('.maternity-page__content');
  const pageShowcase = el('.maternity-page__showcase');

  const handleScroll = () => {
    const vh = window.innerHeight;

    //HOME HEADER
    if (matSection && matHeader) {
      const sectionTop = matSection.getBoundingClientRect().top;

      if (sectionTop < vh * 0.7) {
        matHeader.classList.add('maternity__header--visible');
      } else {
        matHeader.classList.remove('maternity__header--visible');
      }
    }
    //HOME CARDS
    if (matCards & matCards.length) {
      matCards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top;

        if (cardTop < vh * 0.8) {
          card.classList.add('maternity__card--visible');
        } else {
          card.classList.remove('maternity__card--visible');
        }
      });
    }

    //PAGE CONTENT
    if (pageContent) {
      const contentTop = pageContent.getBoundingClientRect().top;

      if (contentTop < vh * 0.8) {
        pageContent.classList.add('maternity-page__content--visible');
      } else {
        pageContent.classList.remove('maternity-page__content--visible');
      }
    }

    //PAGE SHOWCASE
    if (pageShowcase) {
      const showcaseTop = pageShowcase.getBoundingClientRect().top;

      if (showcaseTop < vh * 0.8) {
        pageShowcase.classList.add('maternity-page__showcase--visible');
      } else {
        pageShowcase.classList.remove('maternity-page__showcase--visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

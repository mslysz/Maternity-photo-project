import initHeader from './header.js';
import initAbout from './about.js';
import initMaternity from './maternity.js';
import initPhilosophy from './philosophy.js';
import initMemories from './memories.js';
import initScroll from './scroll.js';
import initShowcase from './reveal-animations.js';
import initStudioBaby from './studio-baby.js';
import initAtHomeBaby from './at-home-baby.js';
import initFamilyPage from './family-photography.js';
import initKnowMe from './know-me.js';
import initContactPage from './contact.js';
import initCookieBanner from './cookies.js';
import initBlog from './blog.js';
import initExperience from './experience.js';
import { initNavigation } from './navigation.js';
import initTestimonialSlider from './testimonial-slider.js';
import initTestimonials from './testimonials.js';

initHeader();
initNavigation();

initAbout();
initMaternity();

initTestimonials().then((loaded) => {
  if (loaded) initTestimonialSlider();
});

initPhilosophy();
initMemories();
initScroll();
initShowcase();
initStudioBaby();
initAtHomeBaby();
initFamilyPage();
initKnowMe();
initContactPage();
initCookieBanner();
initBlog();
initExperience();

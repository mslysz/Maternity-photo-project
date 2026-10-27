import reveal from './components/reveal.js';
import { initPhotoCarousel } from './components/carousel.js';
import { initFaq } from './components/disclosure.js';

export default function initAtHomeBaby() {
  reveal(['.at-home-baby-page__content', '.at-home-baby-page__showcase']);
  initPhotoCarousel('at-home-baby-slideshow');
  initFaq('at-home-baby-questions');
}

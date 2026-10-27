import reveal from './components/reveal.js';
import { initPhotoCarousel } from './components/carousel.js';
import { initFaq } from './components/disclosure.js';

export default function initStudioBaby() {
  reveal([
    '.studio-baby__header',
    '.studio-baby__card',
    '.studio-baby-page__content',
    '.studio-baby-page__showcase',
  ]);
  initPhotoCarousel('studio-baby-slideshow');
  initFaq('studio-baby-questions');
}

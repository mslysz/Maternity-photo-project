import reveal from './components/reveal.js';
import { initPhotoCarousel } from './components/carousel.js';
import { initFaq } from './components/disclosure.js';

export default function initMaternity() {
  reveal([
    '.maternity__header',
    '.maternity__card',
    '.maternity-page__content',
    '.maternity-page__showcase',
  ]);
  initPhotoCarousel('maternity-slideshow');
  initFaq('maternity-questions');
}

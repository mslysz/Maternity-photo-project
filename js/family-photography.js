import reveal from './components/reveal.js';
import { initPhotoCarousel } from './components/carousel.js';

export default function initFamilyPage() {
  reveal([
    '.family-page__content',
    '.family-page__showcase',
    '.family-page-story__images',
    '.family-page-story__content',
  ]);
  initPhotoCarousel('family-page-slideshow');
}

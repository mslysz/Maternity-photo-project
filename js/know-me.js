import reveal from './components/reveal.js';
import { initFaq } from './components/disclosure.js';

export default function initKnowMe() {
  reveal(
    [
      '.presentation__text-wrapper',
      '.presentation__img--first',
      '.presentation__img--second',
      '.navigation-tiles__tile',
    ],
    { threshold: 0.2 },
  );
  initFaq('know-me');
}

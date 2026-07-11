export default async function initTestimonials() {
  const el = (selector) => document.querySelector(selector);
  const slider = el('.testimonials__slider');

  if (!slider) return;

  const response = await fetch('/data/testimonials.json');
  const testimonials = await response.json();

  slider.innerHTML = testimonials
    .map(
      (item) => `
      <div class="testimonials__card">
        <div class="testimonials__img-wrapper">
          <img
            class="testimonials__avatar"
            src="${item.image}"
            alt="${item.alt}"
          />
        </div>

        <blockquote class="testimonials__quote">
          ${item.text.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        </blockquote>

        <cite class="testimonials__author">
          - ${item.author}
        </cite>
      </div>
    `,
    )
    .join('');
}

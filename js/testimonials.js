export default async function initTestimonials() {
  const slider = document.querySelector('.testimonials__slider');
  if (!slider) return false;
  try {
    const response = await fetch(
      new URL('../data/testimonials.json', import.meta.url),
    );
    if (!response.ok)
      throw new Error(`Testimonials request failed: ${response.status}`);
    const testimonials = await response.json();
    if (!Array.isArray(testimonials) || !testimonials.length)
      throw new Error('Invalid testimonials data');
    const cards = testimonials.map((item) => {
      const card = document.createElement('div');
      card.className = 'testimonials__card';
      const wrapper = document.createElement('div');
      wrapper.className = 'testimonials__img-wrapper';
      const image = document.createElement('img');
      image.className = 'testimonials__avatar';
      image.src = new URL(item.image, new URL('../', import.meta.url)).href;
      image.alt = item.alt;
      image.width = 220;
      image.height = 293;
      image.loading = 'lazy';
      wrapper.append(image);
      const quote = document.createElement('blockquote');
      quote.className = 'testimonials__quote';
      item.text.forEach((text) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        quote.append(paragraph);
      });
      const author = document.createElement('cite');
      author.className = 'testimonials__author';
      author.textContent = `- ${item.author}`;
      card.append(wrapper, quote, author);
      return card;
    });
    slider.replaceChildren(...cards);
    return true;
  } catch (error) {
    console.error('Could not load testimonials.', error);
    slider.textContent =
      'Reviews are temporarily unavailable. Please try again later.';
    const controls = document.querySelector('.testimonials__controls');
    if (controls) controls.hidden = true;
    return false;
  }
}

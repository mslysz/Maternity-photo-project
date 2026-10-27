// These pure renderers are shared by the browser and the HTML fallback build.
export function text(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Expected a non-empty text value.');
  }
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  );
}

function list(value) {
  if (!Array.isArray(value) || !value.length) {
    throw new Error('Expected a non-empty list.');
  }
  return value;
}

function unique(values) {
  if (new Set(values).size !== values.length)
    throw new Error('Duplicate IDs or values.');
}

function id(value) {
  if (typeof value !== 'string' || !/^[a-z][a-z0-9-]*$/.test(value)) {
    throw new Error('Expected an ID containing letters, digits and hyphens.');
  }
  return value;
}

function localUrl(value) {
  text(value);
  if (/^(?:[a-z][a-z\d+.-]*:|[\\/])/i.test(value) || value.includes('\\')) {
    throw new Error('Use a relative project URL.');
  }
  return text(value);
}

export const faqBlocks = [
  'maternity-questions',
  'studio-baby-questions',
  'at-home-baby-questions',
  'know-me',
];

export function renderFaq(block, questions) {
  if (!faqBlocks.includes(block)) throw new Error('Unknown FAQ section.');
  unique(list(questions).map((question) => id(question.id)));
  return questions
    .map(
      (question) => `
<article class="${block}__question">
  <h3 class="${block}__heading-item">
    <button class="${block}__header" type="button" aria-expanded="false" aria-controls="${question.id}">
      <span class="${block}__title">${text(question.question)}</span>
      <span class="${block}__icon" aria-hidden="true">+</span>
    </button>
  </h3>
  <div class="${block}__content" id="${question.id}">
    ${list(question.answer)
      .map((answer) => `<p class="${block}__answer">${text(answer)}</p>`)
      .join('\n    ')}
  </div>
</article>`,
    )
    .join('\n')
    .trim();
}

export function renderPackages(packages) {
  unique(list(packages).map((item) => id(item.id)));
  return packages
    .map((item) => {
      if (
        typeof item.price !== 'number' ||
        !Number.isFinite(item.price) ||
        item.price < 0 ||
        typeof item.currency !== 'string' ||
        !/^[A-Z]{3}$/.test(item.currency)
      ) {
        throw new Error('Invalid package price or currency.');
      }
      if (
        typeof item.featured !== 'boolean' ||
        !Number.isInteger(item.image?.width) ||
        !Number.isInteger(item.image?.height) ||
        item.image.width <= 0 ||
        item.image.height <= 0
      ) {
        throw new Error('Invalid package appearance or image dimensions.');
      }
      const price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: item.currency,
        minimumFractionDigits: Number.isInteger(item.price) ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(item.price);
      return `
<article class="package-card${item.featured ? ' package-card--featured' : ''}" data-package-id="${item.id}">
  <div class="package-card__image-wrapper">
    <img class="package-card__img" src="${localUrl(item.image.src)}" alt="${text(item.image.alt)}" width="${item.image.width}" height="${item.image.height}" loading="lazy" />
  </div>
  <div class="package-card__content">
    <span class="package-card__tag">${text(item.tag)}</span>
    <h3 class="package-card__name">${text(item.name)}</h3>
    <p class="package-card__price">${text(price)}</p>
    <p class="package-card__description">${text(item.description)}</p>
    <ul class="package-card__features">
      ${list(item.features)
        .map((feature) => `<li>${text(feature)}</li>`)
        .join('\n      ')}
    </ul>
    <a class="package-card__btn" href="${localUrl(item.booking.url)}">${text(item.booking.label)}</a>
  </div>
</article>`;
    })
    .join('\n')
    .trim();
}

export function renderOptions(options) {
  unique(
    list(options).map((option) => {
      if (
        typeof option.value !== 'string' ||
        (!option.value && option.placeholder !== true)
      ) {
        throw new Error('Invalid option value.');
      }
      if (option.placeholder === true && option.value !== '') {
        throw new Error('A placeholder must have an empty value.');
      }
      return option.value;
    }),
  );
  if (options.filter((option) => option.placeholder === true).length > 1) {
    throw new Error('Only one placeholder is allowed.');
  }
  return options
    .map(
      (option) =>
        `<option value="${option.value ? text(option.value) : ''}"${option.placeholder === true ? ' disabled selected hidden' : ''}>${text(option.label)}</option>`,
    )
    .join('\n');
}

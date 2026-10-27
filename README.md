# Patrice Photography

A responsive photography website presenting maternity, newborn and family photo sessions. It includes photo galleries, session packages, client testimonials, a blog page and a contact page.

This is a junior frontend portfolio project built with HTML, SCSS and vanilla JavaScript. It focuses on responsive layouts, reusable styles and interactive page elements.

## Technologies used

- **HTML5** - page structure, navigation, forms and image content. Core content is available even when JavaScript is disabled.
- **CSS3 and SCSS (Sass)** - styling, responsive layouts, transitions and animations. SCSS variables store shared colours, fonts, spacing and breakpoints, while mixins help reuse common styles.
- **Flexbox and CSS Grid** - arranging sections, cards and galleries across different screen sizes.
- **Vanilla JavaScript (ES modules)** - mobile navigation, image carousels, expandable FAQs and blog articles, scroll animations and cookie preferences. The code is split into modules for individual features.
- **JSON and the Fetch API** - loading content such as navigation links, testimonials, FAQs, session packages and contact form options from separate data files.
- **Node.js and npm** - running the local development server and project scripts. Node.js is used for development tools and content generation.
- **Playwright** - automated browser tests for mobile and desktop layouts, navigation, carousels, forms and content loading.
- **Prettier** - formatting generated HTML to keep it consistent.

## Features

- Responsive layouts for phones, tablets and desktop screens.
- Photo galleries and carousels with previous and next controls.
- Expandable FAQ sections and blog articles.
- Session packages and testimonials loaded from JSON files.
- Keyboard navigation, visible focus styles and reduced motion support.
- WebP images, lazy loading for selected images and priority loading for the main photo.
- HTML fallback content if JavaScript or a content request is unavailable.

## Learning focus

The project brings together practical frontend skills:

- Building a website with several pages and a consistent design.
- Organising SCSS into shared styles, layouts and page sections.
- Using JavaScript modules and reusable components.
- Working with asynchronous requests and handling loading errors.
- Improving accessibility and checking behaviour at different screen sizes.
- Using browser tests to check that changes do not break existing features.

## Run locally

Install Node.js 18 or newer and npm, then run:

```sh
npm install
npm run build
npm run dev
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173).

Use the local server to preview the website. Opening the HTML files directly with `file://` does not support the project's JavaScript modules and JSON requests correctly.

To compile SCSS automatically while editing:

```sh
npm run watch:css
```

Edit files in `scss/`. The build generates `css/main.css` and its source map. The generated CSS is included in the repository so the static website can also be served without a build step.

## Project structure

```text
├── *.html          # Website pages
├── scss/           # SCSS source styles
├── css/            # Compiled CSS
├── js/             # JavaScript modules and shared components
├── data/           # JSON content
├── images/         # Website images
├── scripts/        # Local server and content generation
└── tests/          # Playwright browser tests
```

## Editing content

FAQs, session packages and contact form options are stored in `data/`. After changing these files, update their HTML fallback content with:

```sh
npm run content
```

`npm run build` also runs this step before compiling SCSS. Navigation and testimonials have their own JSON files; when changing navigation links, also update the fallback menu in HTML.

## Tests

Install the test browser once:

```sh
npx playwright install chromium
```

Then run:

```sh
npm test
```

The tests check mobile and desktop layouts, image loading, keyboard navigation, carousels, JSON error handling and selected behaviour without JavaScript.

## Current limitation

The contact form is not connected to a message delivery service yet, so its submit button is disabled. The contact page provides an email address instead. The JavaScript supports a configured form endpoint, but an external service or backend is still needed to receive messages.

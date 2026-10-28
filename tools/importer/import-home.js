/* eslint-disable */
/* global WebImporter */

import columnsHeroCollageParser from './parsers/columns-hero-collage.js';
import columnsArticleIntroParser from './parsers/columns-article-intro.js';
import cardsImageGridParser from './parsers/cards-image-grid.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroOverlayCardParser from './parsers/hero-overlay-card.js';

import wkndTrendsettersCleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import wkndTrendsettersSectionsTransformer from './transformers/wknd-trendsetters-sections.js';

const PAGE_TEMPLATE = {
  "name": "home",
  "urls": [
    "https://www.wknd-trendsetters.site/"
  ],
  "representativeUrl": "https://www.wknd-trendsetters.site/",
  "description": "Homepage: hero collage, featured case study, image gallery, testimonial tabs, latest articles, FAQ, closing banner",
  "blocks": [
    {
      "name": "columns-hero-collage",
      "instances": [
        "#main-content > header.section .container > .grid-layout"
      ]
    },
    {
      "name": "columns-article-intro",
      "instances": [
        ".grid-layout.tablet-1-column.grid-gap-lg"
      ]
    },
    {
      "name": "cards-image-grid",
      "instances": [
        ".grid-layout.desktop-4-column.grid-gap-sm"
      ]
    },
    {
      "name": "tabs-testimonial",
      "instances": [
        ".tabs-wrapper"
      ]
    },
    {
      "name": "cards-article",
      "instances": [
        ".grid-layout.desktop-4-column.grid-gap-md"
      ]
    },
    {
      "name": "accordion-faq",
      "instances": [
        ".faq-list"
      ]
    },
    {
      "name": "hero-overlay-card",
      "instances": [
        "section.inverse-section .utility-position-relative.utility-radius-card"
      ]
    }
  ],
  "urlPattern": "/",
  "sections": [
    {
      "id": "rc1",
      "name": "Hero intro with image collage",
      "selector": [
        "#main-content > header.section.secondary-section",
        "main > header.section"
      ],
      "style": "light-grey",
      "blocks": [
        "columns-hero-collage"
      ],
      "defaultContent": []
    },
    {
      "id": "rc2",
      "name": "Featured case study intro",
      "selector": [
        "#main-content > section.section:nth-of-type(1)"
      ],
      "style": null,
      "blocks": [
        "columns-article-intro"
      ],
      "defaultContent": []
    },
    {
      "id": "rc3",
      "name": "Style in every snapshot gallery",
      "selector": [
        "#main-content > section.section.secondary-section:nth-of-type(2)"
      ],
      "style": "light-grey, centered",
      "blocks": [
        "cards-image-grid"
      ],
      "defaultContent": [
        "#main-content > section:nth-of-type(2) .container > .utility-text-align-center"
      ]
    },
    {
      "id": "rc4",
      "name": "Testimonial tabs",
      "selector": [
        "#main-content > section.section:has(.tabs-wrapper)",
        "#main-content > section.section:nth-of-type(3)"
      ],
      "style": null,
      "blocks": [
        "tabs-testimonial"
      ],
      "defaultContent": []
    },
    {
      "id": "rc5",
      "name": "Latest articles",
      "selector": [
        "#main-content > section.section.secondary-section:nth-of-type(4)"
      ],
      "style": "light-grey, centered",
      "blocks": [
        "cards-article"
      ],
      "defaultContent": [
        "#main-content > section:nth-of-type(4) .container > .utility-text-align-center"
      ]
    },
    {
      "id": "rc6",
      "name": "FAQ",
      "selector": [
        "#main-content > section.section:has(.faq-list)",
        "#main-content > section.section:nth-of-type(5)"
      ],
      "style": "split",
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": [
        "#main-content > section:nth-of-type(5) .grid-layout > div:first-child"
      ]
    },
    {
      "id": "rc7",
      "name": "Closing banner",
      "selector": [
        "#main-content > section.section.inverse-section"
      ],
      "style": "dark",
      "blocks": [
        "hero-overlay-card"
      ],
      "defaultContent": []
    }
  ]
};

const parsers = {
  'columns-hero-collage': columnsHeroCollageParser,
  'columns-article-intro': columnsArticleIntroParser,
  'cards-image-grid': cardsImageGridParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-overlay-card': heroOverlayCardParser,
};

const transformers = [
  wkndTrendsettersCleanupTransformer,
  wkndTrendsettersSectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};

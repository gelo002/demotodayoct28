/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/columns-hero-collage.js
  function parse(element, { document }) {
    const columns = [...element.querySelectorAll(":scope > div")];
    const textCol = columns.find((col) => col.querySelector("h1, h2, h3, p")) || columns[0];
    const mediaCol = columns.find((col) => col !== textCol && col.querySelector("img"));
    const textCell = [];
    if (textCol) {
      const heading = textCol.querySelector("h1, h2, h3");
      if (heading) textCell.push(heading);
      textCol.querySelectorAll(":scope > p").forEach((p) => textCell.push(p));
      const links = [...textCol.querySelectorAll(".button-group a, :scope > a")];
      links.forEach((a) => {
        const p = document.createElement("p");
        if (a.classList.contains("secondary-button")) {
          const em = document.createElement("em");
          em.append(a);
          p.append(em);
        } else {
          const strong = document.createElement("strong");
          strong.append(a);
          p.append(strong);
        }
        textCell.push(p);
      });
    }
    const mediaCell = mediaCol ? [...mediaCol.querySelectorAll("img")] : [];
    const cells = [[textCell, mediaCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-hero-collage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article-intro.js
  function parse2(element, { document }) {
    const columns = [...element.querySelectorAll(":scope > div")];
    const mediaCol = columns.find((col) => col.querySelector("img") && !col.querySelector("h1, h2, h3, h4"));
    const textCol = columns.find((col) => col !== mediaCol) || null;
    const mediaCell = [];
    if (mediaCol) {
      const img = mediaCol.querySelector("img");
      if (img) mediaCell.push(img);
    }
    const textCell = [];
    if (textCol) {
      const crumbs = [...textCol.querySelectorAll(".breadcrumbs a")];
      if (crumbs.length) {
        const p = document.createElement("p");
        crumbs.forEach((a, i) => {
          if (i > 0) p.append(document.createTextNode(" "));
          p.append(a);
        });
        textCell.push(p);
      }
      const heading = textCol.querySelector("h1, h2, h3, h4");
      if (heading) textCell.push(heading);
      const metaRows = [...textCol.querySelectorAll(".flex-horizontal")];
      metaRows.forEach((row) => {
        const text = [...row.querySelectorAll("span")].map((s) => s.textContent.trim()).filter(Boolean).join(" ");
        if (text) {
          const p = document.createElement("p");
          p.textContent = text;
          textCell.push(p);
        }
      });
    }
    const cells = [[mediaCell, textCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-image-grid.js
  function parse3(element, { document }) {
    const cells = [];
    const items = [...element.querySelectorAll(":scope > div")];
    items.forEach((item) => {
      const img = item.querySelector("img");
      if (!img) return;
      cells.push([img, ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-image-grid", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function textParagraph(document, text, bold) {
    const p = document.createElement("p");
    if (bold) {
      const strong = document.createElement("strong");
      strong.textContent = text;
      p.append(strong);
    } else {
      p.textContent = text;
    }
    return p;
  }
  function parse4(element, { document }) {
    const cells = [];
    const panes = [...element.querySelectorAll(".tabs-content > .tab-pane")];
    const buttons = [...element.querySelectorAll(".tab-menu > .tab-menu-link")];
    const count = Math.max(panes.length, buttons.length);
    for (let i = 0; i < count; i += 1) {
      const pane = panes[i];
      const button = buttons[i];
      const labelCell = [];
      if (button) {
        const avatar = button.querySelector(".avatar img, img");
        if (avatar) labelCell.push(avatar);
        const name = button.querySelector("strong");
        if (name) labelCell.push(textParagraph(document, name.textContent.trim(), true));
        const role = [...button.querySelectorAll(".paragraph-sm")].find((el) => !el.querySelector("strong") && el.textContent.trim());
        if (role) labelCell.push(textParagraph(document, role.textContent.trim(), false));
      }
      const contentCell = [];
      if (pane) {
        const img = pane.querySelector("img");
        if (img) contentCell.push(img);
        const name = pane.querySelector("strong");
        if (name) {
          contentCell.push(textParagraph(document, name.textContent.trim(), true));
          const nameBlock = name.closest("div");
          const role = nameBlock && nameBlock.nextElementSibling;
          if (role && role.textContent.trim()) {
            contentCell.push(textParagraph(document, role.textContent.trim(), false));
          }
        }
        const quote = pane.querySelector("p");
        if (quote) contentCell.push(quote);
      }
      if (!labelCell.length && !contentCell.length) continue;
      cells.push([labelCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    const cells = [];
    const cards = [...element.querySelectorAll(":scope > .article-card")];
    cards.forEach((card) => {
      const innerLink = card.querySelector("a[href]");
      const href = card.getAttribute("href") || innerLink && innerLink.getAttribute("href");
      const img = card.querySelector("img");
      const textCell = [];
      const tag = card.querySelector(".article-card-meta .tag");
      if (tag && tag.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = tag.textContent.trim();
        textCell.push(p);
      }
      const date = card.querySelector(".article-card-meta span:not(.tag)");
      if (date && date.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = date.textContent.trim();
        textCell.push(p);
      }
      const title = card.querySelector("h1, h2, h3, h4, h5, h6");
      if (title) {
        const h3 = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.href = href;
          a.textContent = title.textContent.trim();
          h3.append(a);
        } else {
          h3.textContent = title.textContent.trim();
        }
        textCell.push(h3);
      }
      if (!img && !textCell.length) return;
      cells.push([img || "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const cells = [];
    const items = [...element.querySelectorAll(":scope > details.faq-item")];
    items.forEach((item) => {
      const summary = item.querySelector("summary");
      const questionText = summary ? (summary.querySelector("span") || summary).textContent.trim() : "";
      if (!questionText) return;
      const question = document.createElement("p");
      question.textContent = questionText;
      const answerWrap = item.querySelector(".faq-answer");
      const answer = answerWrap ? [...answerWrap.children] : [];
      cells.push([question, answer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay-card.js
  function parse7(element, { document }) {
    const cells = [];
    const bgImage = element.querySelector(":scope > img");
    cells.push([bgImage || ""]);
    const body = element.querySelector(".card-body") || element;
    const content = [];
    const heading = body.querySelector("h1, h2, h3, h4");
    if (heading) content.push(heading);
    body.querySelectorAll(":scope > p").forEach((p) => content.push(p));
    body.querySelectorAll(".button-group a").forEach((a) => {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.append(a);
      p.append(strong);
      content.push(p);
    });
    cells.push([content]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer.inverse-footer",
        "script",
        "style",
        "noscript",
        "iframe",
        "link"
      ]);
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer.inverse-footer",
        "script",
        "style",
        "noscript",
        "link"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-cid")) {
            el.removeAttribute(attr.name);
          }
        });
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var MARKER = "data-excat-section-id";
  function findSection(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (sections.length < 2) return;
    const document = element.ownerDocument || payload.document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSection(element, section);
        if (!el) continue;
        if (i > 0 || section.style) {
          const hr = document.createElement("hr");
          if (section.style) hr.setAttribute(MARKER, section.id);
          if (i === 0) hr.setAttribute("data-excat-first", "true");
          el.parentNode.insertBefore(hr, el);
        }
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
        if (!marker) continue;
        let end = marker.nextElementSibling;
        while (end && end.tagName !== "HR") end = end.nextElementSibling;
        const meta = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (end) {
          end.parentNode.insertBefore(meta, end);
        } else {
          marker.parentNode.appendChild(meta);
        }
        marker.removeAttribute(MARKER);
        if (marker.getAttribute("data-excat-first") === "true") {
          marker.remove();
        }
      }
      element.querySelectorAll("hr[data-excat-first]").forEach((hr) => hr.remove());
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
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
  var parsers = {
    "columns-hero-collage": parse,
    "columns-article-intro": parse2,
    "cards-image-grid": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-overlay-card": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
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
  var import_home_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();

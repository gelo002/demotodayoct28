/* eslint-disable */
/* global WebImporter */
/**
 * Parser: hero-overlay-card
 * Source: section.inverse-section .utility-position-relative.utility-radius-card
 * Row 1: background image. Row 2: heading, subheading, CTA link.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: background image (direct child, outside the card body)
  const bgImage = element.querySelector(':scope > img');
  cells.push([bgImage || '']);

  // Row 2: content
  const body = element.querySelector('.card-body') || element;
  const content = [];
  const heading = body.querySelector('h1, h2, h3, h4');
  if (heading) content.push(heading);
  body.querySelectorAll(':scope > p').forEach((p) => content.push(p));
  body.querySelectorAll('.button-group a').forEach((a) => {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.append(a);
    p.append(strong);
    content.push(p);
  });
  cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay-card', cells });
  element.replaceWith(block);
}

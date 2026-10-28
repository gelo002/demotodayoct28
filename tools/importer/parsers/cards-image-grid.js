/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-image-grid
 * Source: .grid-layout.desktop-4-column.grid-gap-sm
 * Each row: [image, (empty text cell)]
 */
export default function parse(element, { document }) {
  const cells = [];
  const items = [...element.querySelectorAll(':scope > div')];

  items.forEach((item) => {
    const img = item.querySelector('img');
    if (!img) return;
    cells.push([img, '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-image-grid', cells });
  element.replaceWith(block);
}

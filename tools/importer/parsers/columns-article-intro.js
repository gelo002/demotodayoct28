/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-article-intro
 * Source: .grid-layout.tablet-1-column.grid-gap-lg
 * Row: [image, breadcrumb links + H2 + byline paragraphs]
 */
export default function parse(element, { document }) {
  const columns = [...element.querySelectorAll(':scope > div')];
  const mediaCol = columns.find((col) => col.querySelector('img') && !col.querySelector('h1, h2, h3, h4'));
  const textCol = columns.find((col) => col !== mediaCol) || null;

  // Media cell
  const mediaCell = [];
  if (mediaCol) {
    const img = mediaCol.querySelector('img');
    if (img) mediaCell.push(img);
  }

  // Text cell
  const textCell = [];
  if (textCol) {
    // Breadcrumb: links only (separator icons dropped)
    const crumbs = [...textCol.querySelectorAll('.breadcrumbs a')];
    if (crumbs.length) {
      const p = document.createElement('p');
      crumbs.forEach((a, i) => {
        if (i > 0) p.append(document.createTextNode(' '));
        p.append(a);
      });
      textCell.push(p);
    }

    const heading = textCol.querySelector('h1, h2, h3, h4');
    if (heading) textCell.push(heading);

    // Byline / meta rows: each flex row of spans becomes one paragraph
    const metaRows = [...textCol.querySelectorAll('.flex-horizontal')];
    metaRows.forEach((row) => {
      const text = [...row.querySelectorAll('span')]
        .map((s) => s.textContent.trim())
        .filter(Boolean)
        .join(' ');
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        textCell.push(p);
      }
    });
  }

  const cells = [[mediaCell, textCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article-intro', cells });
  element.replaceWith(block);
}

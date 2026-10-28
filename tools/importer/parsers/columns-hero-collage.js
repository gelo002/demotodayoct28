/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-hero-collage
 * Source: #main-content > header.section .container > .grid-layout
 * Row: [text column (H1, subheading, CTA links), media column (collage images)]
 */
export default function parse(element, { document }) {
  const columns = [...element.querySelectorAll(':scope > div')];
  const textCol = columns.find((col) => col.querySelector('h1, h2, h3, p')) || columns[0];
  const mediaCol = columns.find((col) => col !== textCol && col.querySelector('img'));

  // Text cell
  const textCell = [];
  if (textCol) {
    const heading = textCol.querySelector('h1, h2, h3');
    if (heading) textCell.push(heading);
    textCol.querySelectorAll(':scope > p').forEach((p) => textCell.push(p));
    const links = [...textCol.querySelectorAll('.button-group a, :scope > a')];
    links.forEach((a) => {
      const p = document.createElement('p');
      if (a.classList.contains('secondary-button')) {
        const em = document.createElement('em');
        em.append(a);
        p.append(em);
      } else {
        const strong = document.createElement('strong');
        strong.append(a);
        p.append(strong);
      }
      textCell.push(p);
    });
  }

  // Media cell
  const mediaCell = mediaCol ? [...mediaCol.querySelectorAll('img')] : [];

  const cells = [[textCell, mediaCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-hero-collage', cells });
  element.replaceWith(block);
}

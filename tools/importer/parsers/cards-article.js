/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-article
 * Source: .grid-layout.desktop-4-column.grid-gap-md
 * Each row: [image, tag + date + H3 title linked to the article]
 * The source card is a wrapping <a>; the link is rebuilt on the title.
 */
export default function parse(element, { document }) {
  const cells = [];
  const cards = [...element.querySelectorAll(':scope > .article-card')];

  cards.forEach((card) => {
    const innerLink = card.querySelector('a[href]');
    const href = card.getAttribute('href') || (innerLink && innerLink.getAttribute('href'));

    // Image cell (first cell)
    const img = card.querySelector('img');

    // Text cell
    const textCell = [];
    const tag = card.querySelector('.article-card-meta .tag');
    if (tag && tag.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      textCell.push(p);
    }
    const date = card.querySelector('.article-card-meta span:not(.tag)');
    if (date && date.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      textCell.push(p);
    }
    const title = card.querySelector('h1, h2, h3, h4, h5, h6');
    if (title) {
      const h3 = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title.textContent.trim();
        h3.append(a);
      } else {
        h3.textContent = title.textContent.trim();
      }
      textCell.push(h3);
    }

    if (!img && !textCell.length) return;
    cells.push([img || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}

import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Columns (hero collage): text + CTAs beside a collage of images.
 * Expected row: [text cell, images cell]. Cells may be missing or swapped.
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-hero-collage-row');
    [...row.children].forEach((cell) => {
      const pictures = [...cell.querySelectorAll('picture')];
      const hasText = cell.textContent.trim() !== '';
      if (pictures.length && !hasText) {
        cell.classList.add('columns-hero-collage-media');
        cell.dataset.count = pictures.length;
        const items = pictures.map((pic) => {
          const img = pic.querySelector('img');
          return img
            ? createOptimizedPicture(img.src, img.alt, true, [{ media: '(min-width: 900px)', width: '800' }, { width: '600' }])
            : pic;
        });
        cell.replaceChildren(...items);
      } else {
        cell.classList.add('columns-hero-collage-text');
      }
    });
  });
}

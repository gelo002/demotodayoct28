import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Cards (image grid): one image per row; empty text cells are dropped.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-image-grid-item';
    [...row.children].forEach((cell) => {
      const hasText = cell.textContent.trim() !== '';
      const hasPicture = !!cell.querySelector('picture');
      if (!hasText && !hasPicture) return;
      cell.className = hasPicture && !hasText ? 'cards-image-grid-image' : 'cards-image-grid-body';
      li.append(cell);
    });
    if (li.children.length) ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]));
  });
  block.replaceChildren(ul);
}

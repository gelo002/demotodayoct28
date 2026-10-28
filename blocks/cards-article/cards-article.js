import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Cards (article): each row is [image, tag + date + linked title].
 * The title link is stretched so the whole card is clickable.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-article-card';
    [...row.children].forEach((cell) => {
      const hasText = cell.textContent.trim() !== '';
      const hasPicture = !!cell.querySelector('picture');
      if (!hasText && !hasPicture) return;
      if (hasPicture && !hasText) {
        cell.className = 'cards-article-image';
      } else {
        cell.className = 'cards-article-body';
        const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
          let sib = heading.previousElementSibling;
          while (sib) {
            if (sib.tagName === 'P') sib.classList.add('cards-article-meta');
            sib = sib.previousElementSibling;
          }
        }
        const link = heading?.querySelector('a') || cell.querySelector('a');
        if (link) {
          link.classList.add('cards-article-link');
          li.classList.add('cards-article-linked');
        }
      }
      li.append(cell);
    });
    if (li.children.length) ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);
}

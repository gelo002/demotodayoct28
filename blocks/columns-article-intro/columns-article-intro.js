import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * True when an element holds only links (plus separator characters), e.g. a breadcrumb.
 * @param {Element} el
 */
function isLinkOnly(el) {
  const links = [...el.querySelectorAll('a')];
  if (!links.length) return false;
  const clone = el.cloneNode(true);
  clone.querySelectorAll('a').forEach((a) => a.remove());
  return clone.textContent.trim().length <= links.length * 2;
}

/**
 * Columns (article intro): image beside breadcrumb, heading and byline.
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-article-intro-row');
    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic && cell.textContent.trim() === '') {
        cell.classList.add('columns-article-intro-media');
        const img = pic.querySelector('img');
        if (img) {
          pic.replaceWith(createOptimizedPicture(img.src, img.alt, true, [{ media: '(min-width: 900px)', width: '1000' }, { width: '750' }]));
        }
        return;
      }
      cell.classList.add('columns-article-intro-text');

      // breadcrumb: a leading non-heading element made only of links
      const first = cell.firstElementChild;
      if (first && !/^H[1-6]$/.test(first.tagName) && isLinkOnly(first)) {
        const nav = document.createElement('nav');
        nav.className = 'columns-article-intro-breadcrumb';
        nav.setAttribute('aria-label', 'Breadcrumb');
        const ol = document.createElement('ol');
        first.querySelectorAll('a').forEach((a) => {
          const li = document.createElement('li');
          li.append(a);
          ol.append(li);
        });
        nav.append(ol);
        first.replaceWith(nav);
      }

      // byline / date: paragraphs after the heading
      const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
      let sib = heading ? heading.nextElementSibling : null;
      while (sib) {
        if (sib.tagName === 'P') sib.classList.add('columns-article-intro-meta');
        sib = sib.nextElementSibling;
      }
    });
  });
}

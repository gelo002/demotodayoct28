import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero (overlay card): row 1 background image, row 2 heading, text and CTA.
 * Also tolerates image and content in one row, or no image at all.
 * @param {Element} block
 */
export default function decorate(block) {
  const media = document.createElement('div');
  media.className = 'hero-overlay-card-media';
  const content = document.createElement('div');
  content.className = 'hero-overlay-card-content';

  const pic = block.querySelector('picture');
  if (pic) {
    const img = pic.querySelector('img');
    const wrapper = pic.parentElement;
    if (img) {
      media.append(createOptimizedPicture(img.src, img.alt, true, [{ media: '(min-width: 900px)', width: '2000' }, { width: '900' }]));
    }
    pic.remove();
    if (wrapper && wrapper.tagName === 'P' && wrapper.textContent.trim() === '' && !wrapper.children.length) {
      wrapper.remove();
    }
  } else {
    block.classList.add('no-image');
  }

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => content.append(...cell.childNodes));
  });

  block.replaceChildren(...(media.children.length ? [media] : []), content);
}

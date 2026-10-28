/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for wknd-trendsetters.site.
 * Removes non-authorable chrome: skip link, global header (div.navbar),
 * global footer (footer.footer.inverse-footer), scripts/styles, and
 * framework attributes (Astro data-astro-cid-*).
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer.inverse-footer',
      'script',
      'style',
      'noscript',
      'iframe',
      'link',
    ]);
  }

  if (hookName === 'afterTransform') {
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer.inverse-footer',
      'script',
      'style',
      'noscript',
      'link',
    ]);

    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid')) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}

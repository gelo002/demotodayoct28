/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for wknd-trendsetters.site.
 * beforeTransform: inserts <hr> section breaks (and markers for styled sections)
 * while the original section elements still exist.
 * afterTransform: inserts Section Metadata blocks for styled sections.
 */
const MARKER = 'data-excat-section-id';

function findSection(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector in this environment, try next
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload && payload.template && payload.template.sections) || [];
  if (sections.length < 2) return;
  const document = element.ownerDocument || payload.document;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSection(element, section);
      if (!el) continue;
      if (i > 0 || section.style) {
        const hr = document.createElement('hr');
        if (section.style) hr.setAttribute(MARKER, section.id);
        if (i === 0) hr.setAttribute('data-excat-first', 'true');
        el.parentNode.insertBefore(hr, el);
      }
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
      if (!marker) continue;

      // Section Metadata goes at the end of the section: before the next <hr> or at end of parent.
      let end = marker.nextElementSibling;
      while (end && end.tagName !== 'HR') end = end.nextElementSibling;

      const meta = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (end) {
        end.parentNode.insertBefore(meta, end);
      } else {
        marker.parentNode.appendChild(meta);
      }

      marker.removeAttribute(MARKER);
      if (marker.getAttribute('data-excat-first') === 'true') {
        marker.remove();
      }
    }
    element.querySelectorAll('hr[data-excat-first]').forEach((hr) => hr.remove());
  }
}

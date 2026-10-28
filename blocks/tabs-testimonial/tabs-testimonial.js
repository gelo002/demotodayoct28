import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';

function optimize(scope, width) {
  scope.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width }]));
  });
}

/**
 * Tabs (testimonial): each row is
 * [tab label (avatar, name, role), panel (image, name, role, quote)].
 * Panels render above the tab list.
 * @param {Element} block
 */
export default function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.className = 'tabs-testimonial-panels';

  const rows = [...block.children].filter((row) => row.children.length);
  const buttons = [];

  const select = (index, focus = false) => {
    buttons.forEach((btn, i) => {
      const selected = i === index;
      btn.setAttribute('aria-selected', selected);
      btn.tabIndex = selected ? 0 : -1;
      const panel = panels.querySelector(`#${btn.getAttribute('aria-controls')}`);
      if (panel) panel.setAttribute('aria-hidden', !selected);
    });
    if (focus) buttons[index].focus();
  };

  rows.forEach((row, i) => {
    const [labelCell, contentCell] = row.children;
    const name = labelCell.querySelector('strong')?.textContent || labelCell.textContent;
    const id = `${toClassName(name) || 'tab'}-${i}`;

    const panel = document.createElement('div');
    panel.className = 'tabs-testimonial-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    if (contentCell) {
      const media = document.createElement('div');
      media.className = 'tabs-testimonial-panel-media';
      const body = document.createElement('div');
      body.className = 'tabs-testimonial-panel-body';
      [...contentCell.childNodes].forEach((node) => {
        const isImage = node.nodeType === Node.ELEMENT_NODE
          && (node.tagName === 'PICTURE' || (node.querySelector('picture') && node.textContent.trim() === ''));
        (isImage ? media : body).append(node);
      });
      optimize(media, '900');
      if (media.children.length) panel.append(media);
      panel.append(body);
    }
    panels.append(panel);

    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    button.append(...labelCell.childNodes);
    optimize(button, '96');
    button.addEventListener('click', () => select(i));
    button.addEventListener('keydown', (e) => {
      const keys = {
        ArrowRight: (i + 1) % buttons.length,
        ArrowLeft: (i - 1 + buttons.length) % buttons.length,
        Home: 0,
        End: buttons.length - 1,
      };
      if (e.key in keys) {
        e.preventDefault();
        select(keys[e.key], true);
      }
    });
    buttons.push(button);
    tablist.append(button);
  });

  block.replaceChildren(panels, tablist);
  if (buttons.length) select(0);
}

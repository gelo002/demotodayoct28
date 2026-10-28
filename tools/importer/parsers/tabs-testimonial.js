/* eslint-disable */
/* global WebImporter */
/**
 * Parser: tabs-testimonial
 * Source: .tabs-wrapper
 * Each row: [tab label (avatar, name, role), tab content (image, name, role, quote)]
 * Tab buttons and panes are paired by document order.
 */
function textParagraph(document, text, bold) {
  const p = document.createElement('p');
  if (bold) {
    const strong = document.createElement('strong');
    strong.textContent = text;
    p.append(strong);
  } else {
    p.textContent = text;
  }
  return p;
}

export default function parse(element, { document }) {
  const cells = [];
  const panes = [...element.querySelectorAll('.tabs-content > .tab-pane')];
  const buttons = [...element.querySelectorAll('.tab-menu > .tab-menu-link')];
  const count = Math.max(panes.length, buttons.length);

  for (let i = 0; i < count; i += 1) {
    const pane = panes[i];
    const button = buttons[i];

    // Label cell
    const labelCell = [];
    if (button) {
      const avatar = button.querySelector('.avatar img, img');
      if (avatar) labelCell.push(avatar);
      const name = button.querySelector('strong');
      if (name) labelCell.push(textParagraph(document, name.textContent.trim(), true));
      const role = [...button.querySelectorAll('.paragraph-sm')]
        .find((el) => !el.querySelector('strong') && el.textContent.trim());
      if (role) labelCell.push(textParagraph(document, role.textContent.trim(), false));
    }

    // Content cell
    const contentCell = [];
    if (pane) {
      const img = pane.querySelector('img');
      if (img) contentCell.push(img);
      const name = pane.querySelector('strong');
      if (name) {
        contentCell.push(textParagraph(document, name.textContent.trim(), true));
        const nameBlock = name.closest('div');
        const role = nameBlock && nameBlock.nextElementSibling;
        if (role && role.textContent.trim()) {
          contentCell.push(textParagraph(document, role.textContent.trim(), false));
        }
      }
      const quote = pane.querySelector('p');
      if (quote) contentCell.push(quote);
    }

    if (!labelCell.length && !contentCell.length) continue;
    cells.push([labelCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}

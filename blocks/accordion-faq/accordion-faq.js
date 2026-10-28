/**
 * Accordion (FAQ): each row is [question, answer].
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [label, body] = row.children;
    if (!label || label.textContent.trim() === '') {
      row.remove();
      return;
    }
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.append(...label.childNodes);

    const content = body || document.createElement('div');
    content.className = 'accordion-faq-item-body';

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, content);
    row.replaceWith(details);
  });
}

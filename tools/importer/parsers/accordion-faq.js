/* eslint-disable */
/* global WebImporter */
/**
 * Parser: accordion-faq
 * Source: .faq-list
 * Each row: [question, answer]
 */
export default function parse(element, { document }) {
  const cells = [];
  const items = [...element.querySelectorAll(':scope > details.faq-item')];

  items.forEach((item) => {
    const summary = item.querySelector('summary');
    const questionText = summary
      ? (summary.querySelector('span') || summary).textContent.trim()
      : '';
    if (!questionText) return;
    const question = document.createElement('p');
    question.textContent = questionText;

    const answerWrap = item.querySelector('.faq-answer');
    const answer = answerWrap ? [...answerWrap.children] : [];

    cells.push([question, answer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}

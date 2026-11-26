'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
const items = [
  [
    'What is hard water?',
    'Hard water contains dissolved minerals such as calcium and magnesium. Mineral levels vary by location.',
  ],
  [
    'How do I know if my water is hard?',
    'Signs can include marks on taps and reduced soap lather. A water test is the reliable way to know.',
  ],
  [
    'Can hard water make my hair fall?',
    'Mineral buildup can make hair feel dry or harder to manage. Hair fall has many causes; speak with a doctor or dermatologist if you are concerned.',
  ],
  [
    'How often should I use a hard-water shampoo?',
    'Follow the frequency on the final product label. The right routine can vary by product and hair needs.',
  ],
  [
    'Do I need a conditioner too?',
    'A conditioner can help soften lengths and make detangling easier. Follow the directions for each product.',
  ],
  [
    'When will I see a difference?',
    'Results vary with water, hair and routine. Avoid relying on instant-result promises.',
  ],
];
export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="page-shell faq-shell">
      <div className="page-heading">
        <span className="eyebrow">A few helpful answers</span>
        <h1>Frequently asked questions</h1>
        <p>Clear answers, without the complicated bits.</p>
      </div>
      <div className="accordion">
        {items.map(([q, a], i) => (
          <div className="accordion-item" key={q}>
            <button
              id={`faq-question-${i}`}
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-controls={`faq-answer-${i}`}
              aria-expanded={open === i}
            >
              {q}
              <ChevronDown className={open === i ? 'rotated' : ''} />
            </button>
            {open === i && (
              <p id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`}>
                {a}
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="muted">
        Product-specific usage, suitability and delivery details must be confirmed before launch.
      </p>
    </div>
  );
}

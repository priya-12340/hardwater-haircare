'use client';
import { useState } from 'react';
import Link from 'next/link';
const questions = [
  [
    'Where does your water come from?',
    ['Municipal supply', 'Borewell or tube well', 'Tanker', 'Not sure'],
  ],
  ['Do you see white marks on taps, glass or the kettle?', ['Often', 'Sometimes', 'Never']],
  ['How does soap behave in your water?', ['Poor lather or a film', 'Sometimes', 'Lathers well']],
  ['How does your hair feel after a wash?', ['Dry or rough', 'Heavy or coated', 'Normal']],
  ['How is your scalp?', ['Itchy or flaky', 'Normal']],
  [
    'What bothers you most?',
    ['Dryness or frizz', 'Hair fall', 'Dullness', 'Nothing in particular'],
  ],
];
export default function Quiz() {
  const [step, setStep] = useState(0),
    [answers, setAnswers] = useState({}),
    [result, setResult] = useState(false);
  const points = [
    { 0: 0, 1: 2, 2: 1, 3: 0 },
    { 0: 2, 1: 1, 2: 0 },
    { 0: 2, 1: 1, 2: 0 },
    { 0: 1, 1: 1, 2: 0 },
    { 0: 1, 1: 0 },
    { 0: 0, 1: 0, 2: 0, 3: 0 },
  ];
  const score = questions.reduce((s, q, i) => s + (points[i][answers[i]] || 0), 0);
  return (
    <div className="quiz-shell">
      <span className="eyebrow">A gentle starting point</span>
      <h1>{result ? 'Your water, at a glance' : 'Find your haircare starting point'}</h1>
      {!result ? (
        <>
          <p className="muted">A short estimate, not a water test or a diagnosis.</p>
          <div className="progress">
            <span style={{ width: `${((step + 1) / 6) * 100}%` }} />
          </div>
          <small>Question {step + 1} of 6</small>
          <h2>{questions[step][0]}</h2>
          <div className="quiz-options">
            {questions[step][1].map((a, i) => (
              <button
                key={a}
                className={answers[step] === i ? 'selected' : ''}
                aria-pressed={answers[step] === i}
                onClick={() => setAnswers({ ...answers, [step]: i })}
              >
                {a}
              </button>
            ))}
          </div>
          <div className="quiz-nav">
            <button
              className="btn btn-outline"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
            <button
              className="btn btn-primary"
              disabled={answers[step] === undefined}
              onClick={() => (step === 5 ? setResult(true) : setStep(step + 1))}
            >
              {step === 5 ? 'See my estimate' : 'Next'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="quiz-result">
            Your answers suggest a{' '}
            <b>{score >= 6 ? 'higher' : score >= 3 ? 'moderate' : 'lower'} likelihood</b> that your
            water may be hard.
          </p>
          <p>
            This is an estimate only. A water test is the reliable way to understand water hardness.
            Hair and scalp concerns can have many causes.
          </p>
          <Link className="btn btn-primary" href="/shop">
            Explore the collection
          </Link>
          <button
            className="text-link"
            onClick={() => {
              setStep(0);
              setAnswers({});
              setResult(false);
            }}
          >
            Start again
          </button>
        </>
      )}
    </div>
  );
}

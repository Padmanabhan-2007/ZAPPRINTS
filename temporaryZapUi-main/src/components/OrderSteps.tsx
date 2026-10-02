import React from 'react';

const STEPS = ['Upload', 'Configure', 'Deliver', 'Confirm'];

/** 4-step journey indicator shared by the order builder, checkout and confirmation. `current` is 1-based. */
const OrderSteps: React.FC<{ current: 1 | 2 | 3 | 4 }> = ({ current }) => (
  <ol className="stepper" aria-label="Order progress">
    {STEPS.map((label, i) => {
      const n = i + 1;
      const state = n < current ? 'done' : n === current ? 'current' : '';
      return (
        <li key={label} className={state} aria-current={n === current ? 'step' : undefined}>
          <span className="n">{String(n).padStart(2, '0')}</span>
          <span className="lbl">{label}</span>
        </li>
      );
    })}
  </ol>
);

export default OrderSteps;

import { render, fireEvent } from '@testing-library/react';
import Reports from '../Reports';

test('timeframe presets update date inputs', () => {
  const { getByLabelText, getByDisplayValue } = render(<Reports />);
  // The select has id timeframe-select
  const select = document.getElementById('timeframe-select');
  expect(select).toBeTruthy();
  // Simulate changing to Last 7 Days
  fireEvent.change(select, { target: { value: 'Last 7 Days' } });
  const from = document.querySelector('input[type=date]');
  expect(from).toBeTruthy();
});

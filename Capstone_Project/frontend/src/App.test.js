import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login welcome text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome! Login to Continue/i);
  expect(linkElement).toBeInTheDocument();
});

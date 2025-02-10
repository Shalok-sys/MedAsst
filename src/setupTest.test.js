// setupTest.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';

test('Jest and React Testing Library are working', () => {
  render(<h1>Hello, Jest!</h1>);
  expect(screen.getByText(/Hello, Jest!/i)).toBeInTheDocument();
});

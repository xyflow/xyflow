import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

import { HelloWorld } from './HelloWorld';

describe('HelloWorld', () => {
  it('renders Hello and World nodes', async () => {
    render(<HelloWorld />);

    // We expect labels "Hello" and "World!" to be present
    expect(await screen.findByText('Hello')).toBeInTheDocument();
    expect(await screen.findByText('World!')).toBeInTheDocument();
  });
});

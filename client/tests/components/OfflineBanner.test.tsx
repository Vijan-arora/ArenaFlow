import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OfflineBanner } from '../../src/components/OfflineBanner.js';

describe('OfflineBanner', () => {
  it('renders offline banner with time if provided', () => {
    render(<OfflineBanner lastKnownTime="10:00 AM" />);
    expect(screen.getByRole('status')).toHaveTextContent('Offline — showing last known data (from 10:00 AM)');
  });

  it('renders offline banner without time if missing', () => {
    render(<OfflineBanner />);
    expect(screen.getByRole('status')).toHaveTextContent('Offline — showing last known data');
  });
});

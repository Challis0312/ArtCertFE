import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OfferSentModal from '../offerSentModal.jsx';

/**************************************************************************************************/

/**
 * @file        offerSentModal.test.jsx
 * @description Test suite for OfferSentModal component
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/10/2025
 * @license     -- tbd
 */

describe('OfferSentModal', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    artist: 'Emily Johnson',
    artworkTitle: 'Abstract Dreams'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when open is false', () => {
    render(<OfferSentModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Offer Sent')).not.toBeInTheDocument();
  });

  test('renders default content and accessibility', () => {
    const { container } = render(<OfferSentModal {...defaultProps} />);

    // Title and info
    expect(screen.getByText('Offer Sent')).toBeInTheDocument();
    expect(screen.getByText(/Abstract Dreams/)).toBeInTheDocument();
    expect(screen.getByText(/Emily Johnson/)).toBeInTheDocument();

    // Default steps
    expect(screen.getByText('Request received')).toBeInTheDocument();
    expect(screen.getByText('Offer Accepted')).toBeInTheDocument();
    expect(screen.getByText('Verification (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Purchase Complete')).toBeInTheDocument();

    // ARIA
    const modal = container.querySelector('[role="dialog"]');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'offer-sent-title');

    // Arrows between steps
    const arrows = screen.getAllByText('›');
    expect(arrows).toHaveLength(3);
  });

  test('supports custom title and steps', () => {
    const customSteps = [
      { label: 'Step 1', state: 'filled' },
      { label: 'Step 2', state: 'gray' },
      { label: 'Step 3', state: 'dashed' }
    ];

    render(<OfferSentModal {...defaultProps} titleText="Request Submitted" steps={customSteps} />);
    expect(screen.getByText('Request Submitted')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.queryByText('Request received')).not.toBeInTheDocument();
  });

  test('closes modal via close or cancel button', () => {
    const { container } = render(<OfferSentModal {...defaultProps} />);

    // Okay button
    fireEvent.click(screen.getByText('Okay'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Close (X) button
    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });
});

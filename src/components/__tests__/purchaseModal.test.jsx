import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PurchaseModal from '../purchaseModal.jsx';

/**************************************************************************************************/

/**
 * @file        purchaseModal.test.jsx
 * @description Test suite for PurchaseModal component
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/10/2025
 * @license     -- tbd
 */

describe('PurchaseModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    artist: 'John Glenn',
    title: 'Mountain Vista',
    price: 8500,
    onConfirm: mockOnConfirm
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when open is false', () => {
    render(<PurchaseModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Confirm Purchase')).not.toBeInTheDocument();
  });

  test('renders details with formatting and heading when open', () => {
    render(<PurchaseModal {...defaultProps} />);
    // Title heading and key text
    expect(screen.getByRole('heading', { name: 'Confirm Purchase' })).toBeInTheDocument();
    expect(screen.getByText(/Mountain Vista/)).toBeInTheDocument();
    expect(screen.getByText(/John Glenn/)).toBeInTheDocument();
    
    // Price formatted
    expect(screen.getByText(/8,500/)).toBeInTheDocument();
    
    // Typography semantics
    const title = screen.getByText('Mountain Vista');
    const artist = screen.getByText('John Glenn');
    expect(title.tagName).toBe('EM');
    expect(artist.tagName).toBe('STRONG');
  });

  test('closes modal via close button', () => {
    const { container } = render(<PurchaseModal {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm when Confirm Purchase button is clicked', () => {
    render(<PurchaseModal {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: 'Confirm Purchase' });
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test('confirm and cancel buttons trigger callbacks', () => {
    render(<PurchaseModal {...defaultProps} />);
    // Confirm
    const confirmButton = screen.getByRole('button', { name: 'Confirm Purchase' });
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    // Cancel
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('handles missing optional callbacks gracefully', () => {
    render(
      <PurchaseModal
        open={true}
        onClose={undefined}
        artist="Test Artist"
        title="Test Title"
        price={1000}
        onConfirm={undefined}
      />
    );

    const confirmButton = screen.getByRole('button', { name: 'Confirm Purchase' });
    fireEvent.click(confirmButton);

    // Should not throw error
    expect(confirmButton).toBeInTheDocument();
  });
});

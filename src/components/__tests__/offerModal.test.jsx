import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import OfferModal from '../offerModal.jsx';

/**************************************************************************************************/

/**
 * @file        offerModal.test.jsx
 * @description Test suite for OfferModal component
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/10/2025
 * @license     -- tbd
 */

describe('OfferModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    artist: 'Jane Doe',
    title: 'Sunset Dreams',
    recommendedPrice: 5000,
    onConfirm: mockOnConfirm
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when open is false', () => {
    render(<OfferModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Make an offer')).not.toBeInTheDocument();
  });

  test('renders modal fields and read-only when open', () => {
    render(<OfferModal {...defaultProps} />);

    expect(screen.getByText('Make an offer')).toBeInTheDocument();
    const artistInput = screen.getByLabelText('Artist');
    const titleInput = screen.getByLabelText('Artwork Title');
    const priceInput = screen.getByLabelText('Price');

    expect(artistInput).toHaveValue('Jane Doe');
    expect(titleInput).toHaveValue('Sunset Dreams');
    expect(priceInput).toHaveValue(5000);

    // read-only fields
    expect(artistInput).toHaveAttribute('readOnly');
    expect(titleInput).toHaveAttribute('readOnly');
  });

  test('closes modal via close or cancel button', () => {
    // Close button
    const { unmount, container, rerender } = render(<OfferModal {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    unmount();

    // Cancel button
    jest.clearAllMocks();
    render(<OfferModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('submits form with entered price', () => {
    render(<OfferModal {...defaultProps} />);

    const priceInput = screen.getByLabelText('Price');
    fireEvent.change(priceInput, { target: { value: '6000' } });

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledWith({ price: '6000' });
  });

  test('price input attributes when no recommended price', () => {
    render(<OfferModal {...defaultProps} recommendedPrice={null} />);

    const priceInput = screen.getByLabelText('Price');
    expect(priceInput).toHaveAttribute('required');
    expect(priceInput).toHaveAttribute('type', 'number');
    expect(priceInput).toHaveAttribute('step', '100');
    expect(priceInput).toHaveAttribute('placeholder', 'Please input your ideal price.');
  });
});

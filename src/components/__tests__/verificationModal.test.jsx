import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerificationModal from '../verificationModal.jsx';

/**************************************************************************************************/

/**
 * @file        verificationModal.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

describe('VerificationModal', () => {
  test('does not render when closed', () => {
    const { container } = render(
      <VerificationModal isOpen={false} onClose={() => {}} onRetry={() => {}} status="IDLE" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders denied state with Retry and OK', () => {
    const onClose = jest.fn();
    const onRetry = jest.fn();
    render(
      <VerificationModal isOpen={true} onClose={onClose} onRetry={onRetry} status="REJECTED" />
    );
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onClose).toHaveBeenCalled();
  });

  test('renders approved state without Retry', () => {
    render(
      <VerificationModal isOpen={true} onClose={() => {}} onRetry={() => {}} status="SUCCESS" />
    );
    expect(screen.getByText('Upload approved')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });
});

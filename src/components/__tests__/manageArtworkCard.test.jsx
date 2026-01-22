import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: jest.fn() };
});
import { MemoryRouter } from 'react-router-dom';
jest.mock('../../assets/unverified.svg', () => 'unverified.svg', { virtual: true });
jest.mock('../../assets/verified.svg', () => 'verified.svg', { virtual: true });
jest.mock('../../assets/listed.svg', () => 'listed.svg', { virtual: true });
jest.mock('../../assets/unlisted.svg', () => 'unlisted.svg', { virtual: true });
jest.mock('../../assets/authenticated.svg', () => 'authenticated.svg', { virtual: true });
jest.mock('../../assets/unauthenticated.svg', () => 'unauthenticated.svg', { virtual: true });

// Mock registryApi to avoid real calls
jest.mock('../../services/api', () => ({
  registryApi: { toggle: jest.fn().mockResolvedValue({}) },
}));

import ManageArtworkCard from '../manageArtworkCard.jsx';
const renderWithRouter = (ui, { route = '/' } = {}) =>
  render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);

/**************************************************************************************************/

/**
 * @file        manageArtworkCard.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

describe('ManageArtworkCard', () => {
  const listedArtwork = {
    id: '1',
    title: 'Artwork title',
    artist: 'Artist name',
    url: 'https://example.com/image.jpg',
    publicRecord: false,
    verified: false,
    authenticated: false,
    toggle: true,
    tags: []
  };

  const unlistedArtwork = {
    id: '1',
    title: 'Artwork title',
    artist: 'Artist name',
    url: 'https://example.com/image.jpg',
    publicRecord: true,
    verified: true,
    authenticated: true,
    toggle: true,
    tags: []
  };

  test('renders all key elements correctly', () => {
    const onCreateListing = jest.fn();
    const { container } = renderWithRouter(
      <ManageArtworkCard artwork={listedArtwork} onCreateListing={onCreateListing} />
    );

    expect(screen.getByText('Artwork title')).toBeInTheDocument();

    const mainImg = screen.getByRole('img', { name: 'Artwork title' });
    expect(mainImg).toBeInTheDocument();
    expect(mainImg).toHaveAttribute('src', listedArtwork.url);

    expect(screen.getByRole('button', { name: 'Private' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Public' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /request verification/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create marketplace listing/i })).toBeInTheDocument();

    expect(screen.getByText('Unverified')).toBeInTheDocument();
    expect(screen.getByText('Not For Sale')).toBeInTheDocument();
  });

  test('renders verified and listed correctly', () => {
    const onCreateListing = jest.fn();
    renderWithRouter(<ManageArtworkCard artwork={unlistedArtwork} onCreateListing={onCreateListing}/>);

    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('For Sale')).toBeInTheDocument();
  });

  test('Toggles private/public buttons', async () => {
    renderWithRouter(<ManageArtworkCard artwork={{ ...listedArtwork }} onCreateListing={jest.fn()} />);

    const privateBtn = screen.getByRole('button', { name: 'Private' });
    const publicBtn = screen.getByRole('button', { name: 'Public' });

    expect(privateBtn).toBeInTheDocument();
    expect(publicBtn).toBeInTheDocument();
    expect(privateBtn).toHaveClass('bg-button-secondary');
    expect(publicBtn).toHaveClass('bg-button-primary');

    // Click Private
    fireEvent.click(privateBtn);
    await waitFor(() => {
      expect(privateBtn).toHaveClass('bg-button-primary');
      expect(publicBtn).toHaveClass('bg-button-secondary');
    });

    // Click Public
    fireEvent.click(publicBtn);
    await waitFor(() => {
      expect(privateBtn).toHaveClass('bg-button-secondary');
      expect(publicBtn).toHaveClass('bg-button-primary');
    });
  });

  test('onCreateListing is called when button is pressed', () => {
    const onCreateListing = jest.fn();
    renderWithRouter(<ManageArtworkCard artwork={listedArtwork} onCreateListing={onCreateListing} />);

    fireEvent.click(screen.getByRole('button', { name: /create marketplace listing/i }));
    expect(onCreateListing).toHaveBeenCalled();
  });

  describe('branch coverage', () => {
    let alertSpy;
    let clipboardWrite;
    let apiModule;

    beforeEach(() => {
      alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      clipboardWrite = jest.fn().mockResolvedValue();
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: clipboardWrite }, configurable: true });
      apiModule = require('../../services/api');
      jest.clearAllMocks();
    });

    afterEach(() => {
      alertSpy.mockRestore();
    });

    test('onToggle to Private blocked when listed', () => {
      renderWithRouter(
        <ManageArtworkCard artwork={{ ...listedArtwork, publicRecord: true, toggle: true }} onCreateListing={jest.fn()} />
      );
      const privateBtn = screen.getByRole('button', { name: 'Private' });
      fireEvent.click(privateBtn);
      expect(alertSpy).toHaveBeenCalledWith('Artwork is listed in the marketplace. Unlist it first before making it private.');
      expect(apiModule.registryApi.toggle).not.toHaveBeenCalled();
    });

    test('onToggle API error still updates state', async () => {
      apiModule.registryApi.toggle.mockRejectedValueOnce(new Error('boom'));
      renderWithRouter(<ManageArtworkCard artwork={{ ...listedArtwork, toggle: true }} onCreateListing={jest.fn()} />);
      const privateBtn = screen.getByRole('button', { name: 'Private' });
      const publicBtn = screen.getByRole('button', { name: 'Public' });
      fireEvent.click(privateBtn);
      await waitFor(() => {
        expect(privateBtn).toHaveClass('bg-button-primary');
        expect(publicBtn).toHaveClass('bg-button-secondary');
      });
      expect(apiModule.registryApi.toggle).toHaveBeenCalledWith('1');
    });

    test('share copies URL to clipboard and alerts success when listed', async () => {
      renderWithRouter(<ManageArtworkCard artwork={{ ...listedArtwork, publicRecord: true }} onCreateListing={jest.fn()} />);
      fireEvent.click(screen.getByRole('button', { name: /share/i }));
      const expectedUrl = `${window.location.origin}/marketplace/all/${listedArtwork.id}`;
      await waitFor(() => expect(clipboardWrite).toHaveBeenCalledWith(expectedUrl));
      expect(alertSpy).toHaveBeenCalledWith('Artwork link copied to clipboard!');
    });
    
    test('preview navigates to preview path on success', () => {
      const rrd = require('react-router-dom');
      const navigateMock = jest.fn();
      rrd.useNavigate.mockReturnValue(navigateMock);
      renderWithRouter(<ManageArtworkCard artwork={{ ...listedArtwork, id: 'abc' }} onCreateListing={jest.fn()} />);
      fireEvent.click(screen.getByRole('button', { name: /preview/i }));
      expect(navigateMock).toHaveBeenCalledWith('/preview/abc');
    });

    test('preview navigates to 404 on navigation failure', () => {
      const rrd = require('react-router-dom');
      const navigateMock = jest.fn().mockImplementationOnce(() => {
          throw new Error('nav fail');
        })
        .mockImplementation(() => {});
      rrd.useNavigate.mockReturnValue(navigateMock);
      renderWithRouter(<ManageArtworkCard artwork={{ ...listedArtwork, id: 'abc' }} onCreateListing={jest.fn()} />);
      fireEvent.click(screen.getByRole('button', { name: /preview/i }));
      expect(navigateMock).toHaveBeenCalledWith('/preview/abc');
      expect(navigateMock).toHaveBeenCalledWith('/404', { replace: true });
    });

    test('verification request button invokes callback when not verified and not pending', () => {
      const onSetRequestVerification = jest.fn();
      renderWithRouter(
        <ManageArtworkCard
          artwork={{ ...listedArtwork, verified: false, verificationPending: false }}
          onCreateListing={jest.fn()}
          onSetRequestVerification={onSetRequestVerification}
        />
      );
      fireEvent.click(screen.getByRole('button', { name: /request verification/i }));
      expect(onSetRequestVerification).toHaveBeenCalledWith(true);
    });

    test('shows pending verification state when verificationPending is true', () => {
      renderWithRouter(
        <ManageArtworkCard
          artwork={{ ...listedArtwork, verified: false, verificationPending: true }}
          onCreateListing={jest.fn()}
        />
      );
      expect(screen.getByText('Verification requested')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /request verification/i })).not.toBeInTheDocument();
    });

    test('shows authentication label', () => {
      renderWithRouter(<ManageArtworkCard artwork={{ ...listedArtwork, authenticated: true }} onCreateListing={jest.fn()} />);
      expect(screen.getByText('Authenticated')).toBeInTheDocument();
    });
  });
});

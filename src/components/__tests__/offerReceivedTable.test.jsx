import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import OfferReceivedTable from '../offerReceivedTable.jsx';

/**************************************************************************************************/

/**
 * @file        offerReceivedTable.test.jsx
 * @description Test suite for OfferReceivedTable component
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/10/2025
 * @license     -- tbd
 */

const mockNavigate = jest.fn();

jest.mock('../../services/api');
jest.mock('../../utils', () => ({
  artworkWithOffersMapper: jest.fn((data) => ({
    artworkId: data.artworkId,
    artworkName: data.artworkName,
    artistFirstName: data.artistFirstName,
    artistLastName: data.artistLastName,
    offerCount: data.offerCount,
    latestOfferDate: data.latestOfferDate
  })),
  offerReceivedOffersMapper: jest.fn((offer) => ({
    offerId: offer.offerId,
    buyerFirstName: offer.buyerFirstName,
    buyerLastName: offer.buyerLastName,
    buyerAvatar: offer.buyerAvatar,
    price: offer.price,
    date: offer.date,
    status: offer.status
  })),
  artworkDetailMapper: jest.fn((artwork) => ({
    jpegReference: artwork.jpegReference,
    artworkName: artwork.artworkName,
    authorFirstName: artwork.authorFirstName,
    authorLastName: artwork.authorLastName,
    artMedium: artwork.artMedium,
    dimensions: artwork.dimensions,
    dateOfProduction: artwork.dateOfProduction,
    description: artwork.description,
    price: artwork.price
  }))
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Import after mocking
const { offerApi } = require('../../services/api');

describe('OfferReceivedTable', () => {
  const mockArtworkList = [
    {
      artworkId: 'artwork-1',
      artworkName: 'Sunset Dreams',
      artistFirstName: 'Jane',
      artistLastName: 'Doe',
      offerCount: 2,
      latestOfferDate: { date: '2024-10-15' }
    }
  ];

  const mockOffersByArtwork = {
    artwork: {
      jpegReference: 'https://example.com/artwork.jpg',
      artworkName: 'Sunset Dreams',
      authorFirstName: 'Jane',
      authorLastName: 'Doe',
      artMedium: 'Oil on Canvas',
      dimensions: { width: 100, height: 150 },
      dateOfProduction: { year: 2024 },
      description: 'A beautiful sunset',
      price: 5000
    },
    offers: [
      {
        offerId: 'offer-1',
        buyerFirstName: 'John',
        buyerLastName: 'Smith',
        buyerAvatar: 'https://example.com/avatar.jpg',
        price: 4500,
        date: { date: '2024-10-15', time: '14:30' },
        status: 'pending'
      },
      {
        offerId: 'offer-2',
        buyerFirstName: 'Emily',
        buyerLastName: 'Johnson',
        buyerAvatar: null,
        price: 5200,
        date: { date: '2024-10-16', time: '10:15' },
        status: 'pending'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    offerApi.listReceived = jest.fn().mockResolvedValue(mockArtworkList);
    offerApi.listReceivedByArtwork = jest.fn().mockResolvedValue(mockOffersByArtwork);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <OfferReceivedTable />
      </MemoryRouter>
    );
  
  test('initial load renders selector, options, initial offers, and latest date', async () => {
    renderComponent();

    // Artwork list fetch
    await waitFor(() => expect(offerApi.listReceived).toHaveBeenCalledTimes(1));

    // Selector and options
    const dropdown = await screen.findByLabelText('Select Artwork');
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText(/Sunset Dreams by Jane Doe \(2 offers\)/)).toBeInTheDocument();

    // Initial offers fetch for first artwork
    await waitFor(() => expect(offerApi.listReceivedByArtwork).toHaveBeenCalledWith('artwork-1'));

    // Latest offer date
    expect(screen.getByText(/Latest offer: 10\/15\/2024/)).toBeInTheDocument();
  });

  test('renders artwork details and offers table with correct data', async () => {
    renderComponent();

    await waitFor(() => {
      // Headers
      expect(screen.getByRole('columnheader', { name: 'Buyers' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Price' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Decision bar' })).toBeInTheDocument();

      // Artwork details
      expect(screen.getByText('Artist: Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Oil on Canvas')).toBeInTheDocument();
      expect(screen.getByText('100mm x 150mm')).toBeInTheDocument();
      expect(screen.getByText('Market Price: $5,000')).toBeInTheDocument();

      // Offer rows & values
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('Emily Johnson')).toBeInTheDocument();
      expect(screen.getByText('$4,500')).toBeInTheDocument();
      expect(screen.getByText('$5,200')).toBeInTheDocument();

      // Avatars
      const avatars = screen.getAllByRole('img');
      const johnAvatar = avatars.find(img => img.alt === 'John Smith');
      const emilyAvatar = avatars.find(img => img.alt === 'Emily Johnson');
      expect(johnAvatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(emilyAvatar).toHaveAttribute('src', 'https://avatar.iran.liara.run/public/1');

      // Date/time formatting
      expect(screen.getByText('2024-10-15')).toBeInTheDocument();
      expect(screen.getByText('14:30')).toBeInTheDocument();
    });
  });

  test('accepts an offer successfully', async () => {
    offerApi.accept = jest.fn().mockResolvedValue({});
    renderComponent();

    await waitFor(() => {
      const acceptButtons = screen.getAllByText(/Accept/);
      fireEvent.click(acceptButtons[0]);
    });

    await waitFor(() => {
      expect(offerApi.accept).toHaveBeenCalledWith('offer-1');
      expect(mockNavigate).toHaveBeenCalledWith('/registry');
    });
  });

  test('rejects an offer successfully', async () => {
    offerApi.reject = jest.fn().mockResolvedValue({});
    renderComponent();

    await waitFor(() => {
      const rejectButtons = screen.getAllByText(/Reject/);
      fireEvent.click(rejectButtons[0]);
    });

    await waitFor(() => {
      expect(offerApi.reject).toHaveBeenCalledWith('offer-1');
    });
  });

  test('handles accept and reject errors', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    offerApi.accept = jest.fn().mockRejectedValue(new Error('API Error'));
    offerApi.reject = jest.fn().mockRejectedValue(new Error('API Error'));

    renderComponent();

    await waitFor(() => {
      const acceptButtons = screen.getAllByText(/Accept/);
      fireEvent.click(acceptButtons[0]);
    });
    await waitFor(() => expect(consoleError).toHaveBeenCalledWith('Error accepting offer:', expect.any(Error)));

    await waitFor(() => {
      const rejectButtons = screen.getAllByText(/Reject/);
      fireEvent.click(rejectButtons[0]);
    });
    await waitFor(() => expect(consoleError).toHaveBeenCalledWith('Error rejecting offer:', expect.any(Error)));

    consoleError.mockRestore();
  });

  test('changes artwork and uses cache when switching back', async () => {
    const multipleArtworks = [
      ...mockArtworkList,
      {
        artworkId: 'artwork-2',
        artworkName: 'Mountain Vista',
        artistFirstName: 'John',
        artistLastName: 'Smith',
        offerCount: 1,
        latestOfferDate: { date: '2024-10-17' }
      }
    ];

    offerApi.listReceived = jest.fn().mockResolvedValue(multipleArtworks);
    renderComponent();
    // Ensure initial load finished and options rendered
    await waitFor(() => expect(offerApi.listReceived).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/Mountain Vista/)).toBeInTheDocument());

    const dropdown = screen.getByLabelText('Select Artwork');
    // Switch to artwork-2 (API call)
    fireEvent.change(dropdown, { target: { value: 'artwork-2' } });
    await waitFor(() => expect(offerApi.listReceivedByArtwork).toHaveBeenLastCalledWith('artwork-2'));

    // Switch back to artwork-1 (cached)
    fireEvent.change(dropdown, { target: { value: 'artwork-1' } });
    await waitFor(() => expect(offerApi.listReceivedByArtwork).toHaveBeenLastCalledWith('artwork-2'));
  });

  test('displays message when no offers received', async () => {
    offerApi.listReceivedByArtwork = jest.fn().mockResolvedValue({
      artwork: mockOffersByArtwork.artwork,
      offers: []
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No offers received for this artwork')).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import OfferSentTable from '../offerSentTable.jsx';

/**************************************************************************************************/

/**
 * @file        offerSentTable.test.jsx
 * @description Test suite for OfferSentTable component
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/10/2025
 * @license     -- tbd
 */

const mockNavigate = jest.fn();
jest.mock('../../services/api');
jest.mock('../../hooks/usePagination');
jest.mock('../../utils', () => ({ offerSentMapper: jest.fn((offer) => offer) }));
jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useNavigate: () => mockNavigate }));

// Import after mocking
const { offerApi } = require('../../services/api');

describe('OfferSentTable', () => {
  const mockOffers = [
    {
      offerId: 'offer-1',
      artworkId: 'artwork-1',
      artworkName: 'Sunset Dreams',
      artistFirstName: 'Jane',
      artistLastName: 'Doe',
      price: 5000,
      status: 'Accepted',
      createdAt: { date: '2024-10-15', time: '14:30' }
    },
    {
      offerId: 'offer-2',
      artworkId: 'artwork-2',
      artworkName: 'Mountain Vista',
      artistFirstName: 'John',
      artistLastName: 'Smith',
      price: 7500,
      status: 'Pending',
      createdAt: { date: '2024-10-16', time: '10:15' }
    },
    {
      offerId: 'offer-3',
      artworkId: 'artwork-3',
      artworkName: 'Ocean Waves',
      artistFirstName: 'Emily',
      artistLastName: 'Johnson',
      price: 3000,
      status: 'Rejected',
      createdAt: { date: '2024-10-14', time: '16:45' }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    offerApi.listSent = jest.fn().mockResolvedValue(mockOffers);
    
    // Mock usePagination
    require('../../hooks/usePagination').default = jest.fn(() => ({
      currentPage: 1,
      totalPages: 1,
      handlePrevious: jest.fn(),
      handleNext: jest.fn(),
      handlePageChange: jest.fn(),
      getPageNumbers: jest.fn(() => [1])
    }));
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <OfferSentTable />
      </MemoryRouter>
    );

  test('initial load: tabs, headers, accepted row details', async () => {
    renderComponent();

    // API called
    await waitFor(() => expect(offerApi.listSent).toHaveBeenCalledTimes(1));

    // Tabs
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();

    // Headers
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'Title' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Artist' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Price' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
    });

    // Accepted row content
    expect(screen.getByText('Sunset Dreams')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('2024-10-15')).toBeInTheDocument();
    expect(screen.getByText('14:30')).toBeInTheDocument();
    expect(screen.getByText('Manage')).toBeInTheDocument();
  });

  test('filtering: Pending shows View/Cancel; Rejected hides decision bar', async () => {
    renderComponent();

    // Pending
    fireEvent.click(screen.getByText('Pending'));
    await waitFor(() => {
      expect(screen.getByText('Mountain Vista')).toBeInTheDocument();
      expect(screen.getByText('View')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.queryByText('Sunset Dreams')).not.toBeInTheDocument();
    });

    // Rejected
    fireEvent.click(screen.getByText('Rejected'));
    await waitFor(() => expect(screen.queryByRole('columnheader', { name: 'Decision bar' })).not.toBeInTheDocument());
  });

  test('navigation actions: Manage and View', async () => {
    renderComponent();

    // Manage from Accepted
    await waitFor(() => {
      const manageButton = screen.getByText('Manage');
      fireEvent.click(manageButton);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/registry/artwork-1');

    // View from Pending
    mockNavigate.mockClear();
    fireEvent.click(screen.getByText('Pending'));
    await waitFor(() => {
      const viewButton = screen.getByText('View');
      fireEvent.click(viewButton);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/marketplace/all/artwork-2');
  });

  test('cancel success triggers API and shows loading state', async () => {
    offerApi.cancel = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)));
    renderComponent();

    fireEvent.click(screen.getByText('Pending'));
    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    // Loading state
    const cancelingButton = await screen.findByText('Canceling...');
    expect(cancelingButton).toBeDisabled();
    // API call
    await waitFor(() => expect(offerApi.cancel).toHaveBeenCalledWith('offer-2'));
  });

  test('cancel error logs message', async () => {
    offerApi.cancel = jest.fn().mockRejectedValue(new Error('API Error'));
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    renderComponent();

    fireEvent.click(screen.getByText('Pending'));
    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    await waitFor(() => expect(consoleError).toHaveBeenCalledWith('Error deleting offer:', expect.any(Error)));
    consoleError.mockRestore();
  });

  test('empty state message when no offers', async () => {
    offerApi.listSent = jest.fn().mockResolvedValue([]);
    renderComponent();
    await waitFor(() => expect(screen.getByText(/No accepted offers found/)).toBeInTheDocument());
  });
});

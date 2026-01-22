import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ManageMarketplaceCard from '../manageMarketplaceCard.jsx';

/**************************************************************************************************/

/**
 * @file        manageMarketplaceCard.test.jsx
 * @description Test suite for ManageMarketplaceCard component
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/10/2025
 * @license     -- tbd
 */

jest.mock('../../services/api');
const { marketplaceApi } = require('../../services/api');

describe('ManageMarketplaceCard', () => {
  const mockSectionRef = { current: null };
  const mockArtworkNotListed = { id: 'artwork-1', title: 'Test Artwork', verified: true, publicRecord: false };
  const mockArtworkListed = { id: 'artwork-2', title: 'Listed Artwork', verified: true, publicRecord: true, price: 5000 };
  const mockArtworkUnverified = { id: 'artwork-3', title: 'Unverified Artwork', verified: false, publicRecord: false };

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  const renderComponent = (artwork) =>
    render(
      <MemoryRouter>
        <ManageMarketplaceCard artwork={artwork} sectionRef={mockSectionRef} />
      </MemoryRouter>
    );

  describe('Not Listed View', () => {
    test('renders marketplace heading and description', () => {
      renderComponent(mockArtworkNotListed);

      expect(screen.getByText('Marketplace')).toBeInTheDocument();
      expect(screen.getByText(/List your art on the ArtCert marketplace/)).toBeInTheDocument();
    });

    test('renders collapsible rows and toggles on click', () => {
      renderComponent(mockArtworkNotListed);

      expect(screen.getByText('Give your customers the confidence to buy')).toBeInTheDocument();
      expect(screen.getByText('Sell to anyone, anywhere in the world')).toBeInTheDocument();
      expect(screen.getByText('Minimise your overhead costs')).toBeInTheDocument();

      const rowButton = screen.getByRole('button', { name: 'Give your customers the confidence to buy' });
      fireEvent.click(rowButton);

      const content = rowButton.nextElementSibling;
      expect(content).toBeTruthy();
      expect(content).toBeVisible();
      expect(within(content).getByText(/Add a short blurb here/)).toBeVisible();
    });

    test('prevents listing unverified artwork', () => {
      renderComponent(mockArtworkUnverified);

      const createButton = screen.getByText('Create Listing');
      fireEvent.click(createButton);
      expect(window.alert).toHaveBeenCalledWith('Artwork must be verified before listing in the marketplace.');
    });

    test('shows listing form when Create Listing is clicked for verified artwork', () => {
      renderComponent(mockArtworkNotListed);

      const createButton = screen.getByText('Create Listing');
      expect(createButton).toBeInTheDocument();
      fireEvent.click(createButton);

      expect(screen.getByText('Your Marketplace Listing Details')).toBeInTheDocument();
      expect(screen.getByText('Asking Price')).toBeInTheDocument();
    });
  });

  describe('Listing Form View', () => {
    beforeEach(() => {
      renderComponent(mockArtworkNotListed);
      const createButton = screen.getByText('Create Listing');
      fireEvent.click(createButton);
    });

    test('renders price field and buttons', () => {
      const priceInput = screen.getByPlaceholderText('4,900');
      expect(priceInput).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    test('cancels button returns to intro view', () => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.getByText('Create Listing')).toBeInTheDocument();
      expect(screen.queryByText('Your Marketplace Listing Details')).not.toBeInTheDocument();
    });

    test('validates price before saving', async () => {
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(window.alert).toHaveBeenCalledWith('Please enter a valid price greater than 0');
    });

    test('saves valid price successfully', async () => {
      marketplaceApi.updatePrice = jest.fn().mockResolvedValue({});
      const priceInput = screen.getByPlaceholderText('4,900');
      fireEvent.change(priceInput, { target: { value: '6000' } });
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(marketplaceApi.updatePrice).toHaveBeenCalledWith('artwork-1', 6000);
      });
    });

    test('handles save error', async () => {
      marketplaceApi.updatePrice = jest.fn().mockRejectedValue(new Error('API Error'));
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      const priceInput = screen.getByPlaceholderText('4,900');
      fireEvent.change(priceInput, { target: { value: '6000' } });

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Failed to update price. Please try again.');
      });

      consoleError.mockRestore();
    });
  });

  describe('Listed View', () => {
    test('renders listed artwork', () => {
      renderComponent(mockArtworkListed);
      expect(screen.getByText(/Your artwork is currently visible/)).toBeInTheDocument();
    });

    test('removes listing when button is clicked', async () => {
      marketplaceApi.deleteById = jest.fn().mockResolvedValue({});
      renderComponent(mockArtworkListed);

      const removeButton = screen.getByText('Remove from marketplace');
      expect(removeButton).toBeInTheDocument();
      
      fireEvent.click(removeButton);
      await waitFor(() => {
        expect(marketplaceApi.deleteById).toHaveBeenCalledWith('artwork-2');
      });
    });

    test('displays price input with existing price', () => {
      renderComponent(mockArtworkListed);

      const priceInput = screen.getByPlaceholderText('4,900');
      expect(priceInput).toHaveValue('5000');
    });
  });
});

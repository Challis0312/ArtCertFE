import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// Mock react-router's useNavigate to capture navigations
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import MarketplaceCard from '../marketplaceCard.jsx';

/**************************************************************************************************/

/**
 * @file        marketplaceCard.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

const artwork = {
  id: 1,
  title: 'Artwork title',
  url: 'https://example.com/image.jpg',
  publicRecord: false,
  verified: true,
  tags: ['A tag', 'Another tag']
};

const artist = { name: 'Artist name' };

describe('MarketplaceCard', () => {
  test('renders artwork info and button', () => {
    render(
      <MemoryRouter>
        <MarketplaceCard artwork={artwork} artist={artist} />
      </MemoryRouter>
    );

    expect(screen.getByText('Artwork title')).toBeInTheDocument();
    expect(screen.getByText('Artist name')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Not for sale')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
  });

  test('shows Unverified and For sale when flags set', () => {
    const art2 = { ...artwork, verified: false, publicRecord: true };
    render(
      <MemoryRouter>
        <MarketplaceCard artwork={art2} artist={artist} />
      </MemoryRouter>
    );
    expect(screen.getByText('Unverified')).toBeInTheDocument();
    expect(screen.getByText('For sale')).toBeInTheDocument();
  });

  test('clicking View navigates to artwork preview route', () => {
    render(
      <MemoryRouter>
        <MarketplaceCard artwork={artwork} artist={artist} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'View' }));
    // path '/marketplace/all/:id'
    expect(mockNavigate).toHaveBeenCalledWith(`/marketplace/all/${artwork.id}`);
  });
});

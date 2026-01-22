import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ListingCard from '../listingCard.jsx';

/**************************************************************************************************/

/**
 * @file        listingCard.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

const sample = {
  id: 1,
  url: 'https://example.com/image.jpg',
  title: 'Artwork title',
  artistFirstName: 'Artist',
  artistLastName: 'name',
  artistsId: 10,
  ownerId: 20,
  verified: true,
  price: 90000,
  tags: ['A tag', 'Another tag']
};

describe('ListingCard', () => {
  test('renders verified artwork info, tags and view button', () => {
    render(
      <MemoryRouter>
        <ListingCard artwork={sample} />
      </MemoryRouter>
    );

    expect(screen.getByText('Artwork title')).toBeInTheDocument();
    expect(screen.getByText('Artist name')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('A tag')).toBeInTheDocument();
    expect(screen.getByText('Another tag')).toBeInTheDocument();
    expect(screen.getByText('$90,000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
  });

  test('renders authenticated label when owner is the artist', () => {
    const owned = {
      ...sample,
      artistsId: 42,
      ownerId: 42,
      authenticated: true,
    };

    render(
      <MemoryRouter>
        <ListingCard artwork={owned} />
      </MemoryRouter>
    );

    expect(screen.getByText('Artist name')).toBeInTheDocument();
    expect(screen.getByText('Authenticated')).toBeInTheDocument();
  });
});

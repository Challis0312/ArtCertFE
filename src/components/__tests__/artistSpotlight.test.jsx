import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ArtistSpotlight from '../artistSpotlight.jsx';

/**************************************************************************************************/

/**
 * @file        artistSpotlight.test.jsx
 * @description Test suite for ArtistSpotlight component
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/10/2025
 * @license     -- tbd
 */

describe('ArtistSpotlight', () => {
  const mockArtist = {
    name: 'Alice Bob',
    bio: 'A talented artist.',
    image: 'https://example.com/artist.jpg',
    userId: 'artist-123'
  };

  const renderComponent = (artist = mockArtist, isRegistered = true) =>
    render(
      <MemoryRouter>
        <ArtistSpotlight artist={artist} isRegistered={isRegistered} />
      </MemoryRouter>
    );

  test('Arist information is rendered correctly', () => {
    renderComponent();

    expect(screen.getByText('About the Artist')).toBeInTheDocument();
    expect(screen.getByText('Alice Bob')).toBeInTheDocument();
    expect(screen.getByText('A talented artist.')).toBeInTheDocument();
  });

  test('Arist image renders correctly', () => {
    renderComponent();

    const image = screen.getByAltText('artistProfile');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/artist.jpg');
  });

  test('Link to artist collection works for registered artist', () => {
    renderComponent(mockArtist, true);

    const link = screen.getByRole('link', { name: "View Artist's Collection" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/public/artist-123');
  });
});

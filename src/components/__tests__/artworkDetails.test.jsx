import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArtworkDetails from '../artworkDetails.jsx';

/**************************************************************************************************/

/**
 * @file        artworkDetails.test.jsx
 * @description Test suite for ArtworkDetails component
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/10/2025
 * @license     -- tbd
 */

describe('ArtworkDetails', () => {
  const mockArtwork = {
    title: 'Johnart Moon',
    url: 'https://example.com/artwork.jpg',
    verified: true,
    artMedium: 'Oil',
    dimensions: { width: 100, height: 150 },
    dateOfProduction: { day: 15, month: 8, year: 2024 },
    description: 'A depiction of the moon over the mountains.'
  };

  const mockArtist = {
    name: 'John Smith',
    image: 'https://example.com/artist-avatar.jpg'
  };

  const mockOpenModal = jest.fn();
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (isModalOpen = false) =>
    render(
      <ArtworkDetails
        artwork={mockArtwork}
        artist={mockArtist}
        isModalOpen={isModalOpen}
        openModal={mockOpenModal}
        closeModal={mockCloseModal}
      />
    );

  test('renders artwork title and details correctly', () => {
    renderComponent();

    expect(screen.getByText('Johnart Moon')).toBeInTheDocument();
    expect(screen.getAllByText('John Smith')).toHaveLength(2);
    expect(screen.getByText('Oil')).toBeInTheDocument();
    expect(screen.getByText('100 x 150')).toBeInTheDocument();
    expect(screen.getByText('15/8/2024')).toBeInTheDocument();
    expect(screen.getByText('A depiction of the moon over the mountains.')).toBeInTheDocument();
  });

  test('displays verified status correctly', () => {
    renderComponent();

    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  test('displays unverified status when artwork is not verified', () => {
    const unverifiedArtwork = { ...mockArtwork, verified: false };
    render(
      <ArtworkDetails
        artwork={unverifiedArtwork}
        artist={mockArtist}
        isModalOpen={false}
        openModal={mockOpenModal}
        closeModal={mockCloseModal}
      />
    );

    expect(screen.getByText('Unverified')).toBeInTheDocument();
  });

  test('renders artwork image with correct src', () => {
    renderComponent();

    const images = screen.getAllByAltText('Johnart Moon');
    expect(images[0]).toHaveAttribute('src', 'https://example.com/artwork.jpg');
  });

  test('opens large view for image when zoom icon is clicked', () => {
    const { container } = renderComponent();

    const zoomButton = container.querySelector('.cursor-pointer');
    fireEvent.click(zoomButton);

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  test('closes large view for image when close button is clicked', () => {
    const { container } = renderComponent(true);

    const closeButton = container.querySelector('.fixed.top-4.right-4');
    fireEvent.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  test('renders artist avatar', () => {
    renderComponent();

    const avatar = screen.getByAltText('Artist avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/artist-avatar.jpg');
  });
});

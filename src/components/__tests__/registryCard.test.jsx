import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import RegistryCard from '../registryCard.jsx';

/**************************************************************************************************/

/**
 * @file        registryCard.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

jest.mock('../../assets/unverified.svg', () => 'unverified.svg', { virtual: true });
jest.mock('../../assets/verified.svg', () => 'verified.svg', { virtual: true });
jest.mock('../../assets/listed.svg', () => 'listed.svg', { virtual: true });
jest.mock('../../assets/unlisted.svg', () => 'unlisted.svg', { virtual: true });

// Mock react-router's useNavigate to capture navigations
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const sample = {
  id: 1,
  title: 'Artwork title',
  url: 'https://example.com/image.jpg',
  publicRecord: false,
  verified: true,
  authorFirstName: 'Artist',
  authorLastName: 'name',
  tags: ['A tag', 'Another tag']
};

describe('RegistryCard', () => {
  test('Artwork and manage button render correctly', () => {
    render(
      <MemoryRouter>
        <RegistryCard artwork={sample} />
      </MemoryRouter>
    );

    expect(screen.getByText('Artist name')).toBeInTheDocument();
    expect(screen.getByText('Artwork title')).toBeInTheDocument();
    expect(screen.getByText('Preview listing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage' })).toBeInTheDocument();
  });

  test('Preview listing button navigates to preview route', () => {
    render(
      <MemoryRouter>
        <RegistryCard artwork={sample} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /preview listing/i }));
    expect(mockNavigate).toHaveBeenCalledWith(`./1/preview`);
  });

  test('Manage button navigates to manage artwork page', () => {
    render(
      <MemoryRouter>
        <RegistryCard artwork={sample} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Manage' }));
    expect(mockNavigate).toHaveBeenCalledWith(`./1`, { state: { artwork: sample } });
  });

  test('shows Verified and Not for sale states', () => {
    render(
      <MemoryRouter>
        <RegistryCard artwork={sample} />
      </MemoryRouter>
    );

    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Not for sale')).toBeInTheDocument();
  });

  test('shows Unverified and For sale states when flags change', () => {
    const altSample = {
      ...sample,
      verified: false,
      publicRecord: true,
    };

    render(
      <MemoryRouter>
        <RegistryCard artwork={altSample} />
      </MemoryRouter>
    );

    expect(screen.getByText('Unverified')).toBeInTheDocument();
    expect(screen.getByText('For sale')).toBeInTheDocument();
  });

  test('renders tags and main image attributes', () => {
    render(
      <MemoryRouter>
        <RegistryCard artwork={sample} />
      </MemoryRouter>
    );

    // Tags
    expect(screen.getByText('A tag')).toBeInTheDocument();
    expect(screen.getByText('Another tag')).toBeInTheDocument();

    // Main image has correct src and alt
    const img = screen.getByAltText(sample.title);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', sample.url);
  });
});

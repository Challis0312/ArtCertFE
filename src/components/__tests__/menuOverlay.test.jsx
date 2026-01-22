import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import MenuOverlay from '../menuOverlay.jsx';

/**************************************************************************************************/

/**
 * @file        menuOverlay.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

describe('MenuOverlay', () => {
  test('renders headings and links when open', () => {
    render(
      <MemoryRouter>
        <MenuOverlay />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();

    const links = [
      {name: 'Registry', href: '/registry'},
      {name: 'Add a new artwork', href: '/registry/new'},
      {name: 'Verification requests', href: '/registry/verifications'},
      {name: 'Offers', href: '/registry/offers'},
      {name: 'Home', href: '/'},
      {name: 'Marketplace', href: '/marketplace'},
      {name: 'All artworks', href: '/marketplace/all'},
      {name: 'About us', href: '/about'},
    ];

    links.forEach(({ name, href }) => {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
    });
  });
});

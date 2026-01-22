import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumbs from '../breadcrumbs.jsx';

/**************************************************************************************************/

/**
 * @file        breadcrumbs.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

describe('Breadcrumbs', () => {
  const renderAt = (route) =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <Breadcrumbs />
      </MemoryRouter>
    );

  test('Renders Home and crumbs for nested route', () => {
    renderAt('/marketplace/all');

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Marketplace' })).toHaveAttribute('href', '/marketplace');

    // Last crumb should be plain text
    expect(screen.getByText('All Artworks')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'All Artworks' })).not.toBeInTheDocument();
  });
  
  test('renders artwork name in-place of art_id', () => {
    renderAt('/registry/0a368112-516a-40a5-ba79-7a9c94d49a66');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Registry' })).toHaveAttribute('href', '/registry');
    expect(screen.getByText('ear')).toBeInTheDocument();
    expect(screen.queryByText('0a368112-516a-40a5-ba79-7a9c94d49a66')).not.toBeInTheDocument();
  });

  test('renders artist name in-place of artist_id', () => {
    renderAt('/public/d94e24e8-6081-704a-5b87-596212eeca2c');

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'public' })).toHaveAttribute('href', '/public');
    expect(screen.getByText('Faaez Kamal')).toBeInTheDocument();
    expect(screen.queryByText('d94e24e8-6081-704a-5b87-596212eeca2c')).not.toBeInTheDocument();
    
    // Last crumb should be plain text of the id with dashes replaced by spaces
    const spacedMatcher = (content) => content.replace(/\s/g, '') === id.replace(/-/g, '');
    expect(screen.getByText(spacedMatcher)).toBeInTheDocument();
    expect(screen.queryByText(id)).not.toBeInTheDocument();
  });
});
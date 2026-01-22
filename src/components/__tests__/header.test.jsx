import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Header from '../header.jsx';

/**************************************************************************************************/

/**
 * @file        header.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

jest.mock('../../assets/logo.png', () => 'logo.png', { virtual: true });
jest.mock('../breadcrumbs.jsx', () => () => (
  <nav data-testid="mock-breadcrumbs">Breadcrumbs</nav>
));

// Mocks
jest.mock('../menuOverlay.jsx', () => ({ menuRef, onNavigate }) => (
  <div data-testid="mock-menu-overlay" ref={menuRef}>
    overlay
    <button onClick={onNavigate}>navigate</button>
  </div>
));

// Mock auth context to provide login/logout buttons behavior
jest.mock('../../contexts/authContext.jsx', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  return {
    __esModule: true,
    useAuth: () => ({ user: null, login: mockLogin, logout: mockLogout }),
    __mockLogin: mockLogin,
    __mockLogout: mockLogout,
  };
});

// Access exposed mocks for assertions
const authModule = require('../../contexts/authContext.jsx');

const renderWithRoute = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Header/>
    </MemoryRouter>
  );

describe('Header', () => {
  test('renders logo and login link', () => {
    renderWithRoute('/');

    expect(screen.getByAltText('Logo')).toBeInTheDocument();

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
    expect(authModule.__mockLogin).toHaveBeenCalled();
  });

  test('menu toggle switches between menu and close labels and shows menu overlay', () => {
    renderWithRoute('/');

    // Initially shows menu label and overlay is closed
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toHaveTextContent(/menu/i);
    expect(screen.queryByTestId('mock-menu-overlay')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(menuButton);
    expect(menuButton).toHaveTextContent(/close/i);
    expect(screen.getByTestId('mock-menu-overlay')).toBeInTheDocument();

    // Click again to close
    fireEvent.click(menuButton);
    expect(menuButton).toHaveTextContent(/menu/i);
    expect(screen.queryByTestId('mock-menu-overlay')).not.toBeInTheDocument();
  });

  test('breadcrumbs not shown on home route', () => {
    // Home route
    cleanup();
    renderWithRoute('/');
    expect(screen.queryByTestId('mock-breadcrumbs')).not.toBeInTheDocument();

    // Not home route
    cleanup();
    renderWithRoute('/marketplace');
    expect(screen.getByTestId('mock-breadcrumbs')).toBeInTheDocument();
  });
});

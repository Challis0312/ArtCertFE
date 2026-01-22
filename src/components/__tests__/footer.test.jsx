import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../footer.jsx';

/**************************************************************************************************/

/**
 * @file        footer.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

describe('Footer', () => {
	const renderFooter = () =>
		render(
			<MemoryRouter>
				<Footer />
			</MemoryRouter>
		);

	test('renders all elements correctly', () => {
		renderFooter();

		// Logo and headings
		expect(screen.getByAltText('ArtCert Logo')).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Registry' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Marketplace' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();

		// Hyperlink Columns
		expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/signup');
		expect(screen.getByRole('link', { name: 'Registry FAQs' })).toHaveAttribute('href', '/registry/faq');
		expect(screen.getByRole('link', { name: 'Manage Verification' })).toHaveAttribute('href', '/registry/verification');

		expect(screen.getByRole('link', { name: 'Browse Artworks' })).toHaveAttribute('href', '/marketplace/all');
		expect(screen.getByRole('link', { name: 'Purchase Process' })).toHaveAttribute('href', '/marketplace/faq');
		expect(screen.getByRole('link', { name: 'Why sell artwork on ArtCert?' })).toHaveAttribute('href', '/marketplace/faq#section');

		expect(screen.getByRole('link', { name: 'The ArtCert difference' })).toHaveAttribute('href', '/about#difference');
		expect(screen.getByRole('link', { name: 'Verification Process' })).toHaveAttribute('href', '/about#verification');
		expect(screen.getByRole('link', { name: 'Digital Certificate' })).toHaveAttribute('href', '/about#certificate');
		expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/about#contact');

		// Bottom bar
		expect(screen.getByText('© 2025 ArtCert. All right reserved.')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
		expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms');
	});
});


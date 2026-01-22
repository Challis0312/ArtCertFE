import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from '../pagination.jsx';

/**************************************************************************************************/

/**
 * @file        pagination.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

describe('Pagination', () => {
  test('calls callbacks on interactions', () => {
    const onPrevious = jest.fn();
    const onNext = jest.fn();
    const onPageChange = jest.fn();
    const getPageNumbers = () => [1, 2, 3, '...', 5];

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPrevious={onPrevious}
        onNext={onNext}
        onPageChange={onPageChange}
        getPageNumbers={getPageNumbers}/>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));

    expect(onPrevious).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('1 page: renders nothing', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPrevious={() => {}}
        onNext={() => {}}
        onPageChange={() => {}}
        getPageNumbers={() => [1]}/>
    );
    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  });

  test('5 pages: renders pages without ellipsis', () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPrevious={() => {}}
        onNext={() => {}}
        onPageChange={onPageChange}
        getPageNumbers={() => [1, 2, 3, 4, 5]}/>
    );

    [1, 2, 3, 4, 5].forEach(n => {expect(screen.getByRole('button', { name: String(n) })).toBeInTheDocument();});
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  test('5+ pages: shows ellipsis, first, and last pages', () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={6}
        onPrevious={() => {}}
        onNext={() => {}}
        onPageChange={onPageChange}
        getPageNumbers={() => [1, 2, 3, '...', 6]}/>
    );
    expect(screen.getByText('...')).toBeInTheDocument();
    [1, 2, 3, 6].forEach(n => {
      expect(screen.getByRole('button', { name: String(n) })).toBeInTheDocument();
    });

    // Intermediate pages not rendered
    expect(screen.queryByRole('button', { name: '4' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '6' }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });
});

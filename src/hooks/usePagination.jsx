import { useState } from 'react';

/**************************************************************************************************/

/**
 * @file        usePagination.jsx
 * @description Custom hook for handling pagination logic
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     02/09/2025
 * @license     -- tbd
 */

const usePagination = (data, resetScroll = true, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (resetScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const resetPages = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    currentItems,
    handlePageChange,
    handlePrevious,
    handleNext,
    getPageNumbers,
    resetPages
  };
};

export default usePagination;

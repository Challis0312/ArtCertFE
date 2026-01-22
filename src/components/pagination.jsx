import React from 'react';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

/**************************************************************************************************/

/**
 * @file        pagination.jsx
 * @description Reusable pagination component
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     02/09/2025
 * @license     -- tbd
 */

const Pagination = ({ currentPage, totalPages, onPrevious, onNext, onPageChange, getPageNumbers}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 mb-8">
      <button className={`flex text-center bg-button-primary hover:bg-button-primary-hover 
          font-sans text-white ${currentPage === 1 ? "cursor-not-allowed opacity-75" : ""}`}
        onClick={onPrevious}
        disabled={currentPage === 1}>
        <HiChevronLeft className="w-5 h-5" />
        <span className="ml-1">Previous</span>
      </button>

      {getPageNumbers().map((pageNumber, index) => {
        if (pageNumber === "...") {
          return (
            <span className="text-center font-sans text-black" 
              key={`ellipsis-${index}`}>
              ...
            </span>
          );
        }
        return (
          <button className={`px-3 py-2 text-sm font-medium border ${
              currentPage === pageNumber
                ? "text-center bg-button-secondary-hover font-sans text-black"
                : "text-center bg-button-secondary hover:bg-button-secondary-hover font-sans text-black"
            }`}
            key={pageNumber}
            onClick={() => {
              onPageChange(pageNumber);
            }}>
            {pageNumber}
          </button>
        );
      })}

      <button className={`flex text-center bg-button-primary hover:bg-button-primary-hover 
          font-sans text-white ${currentPage === totalPages ? "cursor-not-allowed opacity-75" : ""}`}
        onClick={onNext}
        disabled={currentPage === totalPages}>
        <span className="mr-1">Next</span>
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;

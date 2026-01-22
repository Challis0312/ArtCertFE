import React from 'react';

/**************************************************************************************************/

/**
 * @file        notFound.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     18/08/2025
 * @license     -- tbd
 */

const NotFound = () => {
  return (
  <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div className="text-center">
      <p className="text-5xl font-serif text-heading">404</p>
      <h1 className="mt-4 text-5xl font-serif tracking-tight text-balance text-heading sm:text-7xl">Page not found</h1>
      <p className="mt-6 text-lg font-medium font-serif text-body-text sm:text-xl/8">Sorry, we couldn’t find the page you’re looking for.</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a href="/" className="text-2xl font-sans text-button-primary">Go back home</a>
      </div>
    </div>
  </div>
  );
};

export default NotFound;
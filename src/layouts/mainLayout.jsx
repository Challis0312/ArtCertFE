import React from 'react';
import { Header, Footer } from '../components';
import { Outlet } from 'react-router-dom';

/**************************************************************************************************/

/**
 * @file        mainLayout.jsx
 * @description A core layout component that serves as the primary structural wrapper
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     17/08/2025
 * @license     -- tbd
 */

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className='flex-grow-1'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;

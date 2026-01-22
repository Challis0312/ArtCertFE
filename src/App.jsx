import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Marketplace, EditArtwork, Registry, NotFound, AddArtwork, ArtistProfile, AllArtworks, PurchaseArtwork, PreviewArtwork, OfferPage } from "./pages";
import MainLayout from './layouts/mainLayout.jsx';
import ScrollToTop from './components/scrollToTop.jsx';
import ProtectedRoute from './routes/protectedRoute.jsx';
import { AuthCallback } from './components';

/**************************************************************************************************/

/**
 * @file        App.jsx
 * @description 
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Joshua El-Khoury, Chi-Yuan Yang, David Relacion]
 * @created     11/08/2025
 * @license     -- tbd
 */

function App() {

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route path='auth/callback' element={<AuthCallback />} />

          <Route index element={<Home />} />

          <Route path="marketplace">
            <Route index element={<Marketplace />} />
            <Route path="all">
              <Route index element={<AllArtworks />} />
              <Route path=":artworkId" element={<PurchaseArtwork />} />
            </Route>
          </Route>

          <Route path='preview'>
            <Route path=':artworkId' element={<PreviewArtwork />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path='registry'>
              <Route index element={<Registry />} />
              <Route path='new' element={<AddArtwork />} />

              <Route path=':artworkId' >
                <Route index element={<EditArtwork />} />
              </Route>

              <Route path='offers' element={<OfferPage />}>
                <Route path=':id' element={<NotFound />} />
              </Route>
            </Route>
          </Route>

          <Route path='public' >
            {/* <Route index element={<AllRegistries />} /> */}
            <Route path=':id' element={<ArtistProfile />} />
          </Route>

          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

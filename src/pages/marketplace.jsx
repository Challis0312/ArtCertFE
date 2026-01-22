import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner, Pagination } from '../components';
import usePagination from '../hooks/usePagination';
import { marketplaceApi } from '../services/api';
import { artworkMapper } from '../utils';

/**************************************************************************************************/

/**
 * @file        marketplace.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Joshua El-Khoury, Chi-Yuan Yang, Faaez Ahmed Kamal]
 * @created     11/08/2025
 * @license     -- tbd
 */

const Marketplace = () => {
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await marketplaceApi.list();
        const mappedArtworks = res.map(artwork => artworkMapper(artwork));
        setArtwork(mappedArtworks);
      } catch (error) {
        console.error("Failed to load marketplace data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const artworksByMedium = artwork.reduce((acc, artwork) => {
    if (!acc[artwork.artMedium]) acc[artwork.artMedium] = [];
    acc[artwork.artMedium].push(artwork);
    return acc;
  }, {});

  const featuredArtworks = artwork.slice(0, 9);
  const availableMediums = Object.keys(artworksByMedium).filter(medium => artworksByMedium[medium].length > 0);
  const browsePagination = usePagination(featuredArtworks, false, 3);
  const mediumPagination = usePagination(availableMediums, false, 3);

  return (
    <div className="min-h-screen mx-16 p-8">
      
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="font-serif text-6xl text-heading mb-4">Marketplace</h1>
        <p className="font-sans text-lg text-body-text max-w-2xl mx-auto mb-8">
          Our marketplace is your gateway to purchasing artworks from our artists and collectors. Buy artworks with confidence.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner loadingText='Marketplace' />
      ) : (
        <>
          {/* Featured Section */}
          <div className="py-16">
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-serif text-heading">Browse the Marketplace</h2>
              <button className="bg-button-primary hover:bg-button-primary-hover text-white px-6 py-2 font-sans btn-transition"
                onClick={() => navigate('/marketplace/all')}
                style={{ borderRadius: '0' }}>
                View All Artworks
              </button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {browsePagination.currentItems.map((artwork, index) => (
                  <div key={artwork.id || index} className="bg-white">
                    <div className="aspect-square overflow-hidden mb-4 cursor-pointer" 
                        onClick={() => navigate(`/marketplace/all/${artwork.id}`)}>
                      <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        src={artwork.url}
                        alt={artwork.title || 'Artwork'}/>
                    </div>
                    <h3 className="font-serif text-xl text-heading">{artwork.title || 'Untitled'}</h3>
                    <p className="font-sans text-body-text">{artwork.artist || 'Unknown Artist'}</p>
                  </div>
                ))}
              </div>
            </div>

            <Pagination
              currentPage={browsePagination.currentPage}
              totalPages={browsePagination.totalPages}
              onPrevious={browsePagination.handlePrevious}
              onNext={browsePagination.handleNext}
              onPageChange={browsePagination.handlePageChange}
              getPageNumbers={browsePagination.getPageNumbers}/>
          </div>

          {/* Mediums Section */}
          <div className="min-h-screen">
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-serif text-heading">Mediums</h2>
            </div>
                  
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {mediumPagination.currentItems.map((medium, index) => {
                  const mediumArtworks = artworksByMedium[medium];
                  const featuredArtwork = mediumArtworks[0];
                  
                  return (
                    <div key={medium} className="text-center">
                      <div className="aspect-square overflow-hidden mb-4 cursor-pointer"
                          onClick={() => navigate(`/marketplace/all/${featuredArtwork.id}`)}>
                        <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          src={featuredArtwork?.url}
                          alt={medium}/>
                      </div>
                      <h3 className="font-serif text-2xl text-heading mb-4">{medium}</h3>
                      <button className="text-center bg-button-secondary hover:bg-button-secondary-hover font-sans text-heading mb-4"
                        style={{ borderRadius: '0', width: '100%' }}
                        onClick={() => navigate(`/marketplace/all?medium=${encodeURIComponent(medium)}`)}>
                        View More
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Pagination
              currentPage={mediumPagination.currentPage}
              totalPages={mediumPagination.totalPages}
              onPrevious={mediumPagination.handlePrevious}
              onNext={mediumPagination.handleNext}
              onPageChange={mediumPagination.handlePageChange}
              getPageNumbers={mediumPagination.getPageNumbers}/>
          
          </div>
        </>
      )}
    </div>
  );
};

export default Marketplace;

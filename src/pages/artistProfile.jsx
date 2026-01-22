import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { LoadingSpinner, MarketplaceCard, Pagination } from '../components';
import usePagination from '../hooks/usePagination';
import { marketplaceApi, profileApi } from '../services/api';
import { artworkMapper, profileMapper } from '../utils';

/**************************************************************************************************/

/**
 * @file        artistProfile.jsx
 * @description -- modify the field type of artist
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Jian-yu Chai, Faaez Ahmed Kamal]
 * @created     22/08/2025
 * @license     -- tbd
 */

const ArtistProfile = () => {
  const [artistInfo, setArtistInfo] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const loadArtistData = async (id) => {
      setLoading(true);
      try {
        const [profileData, artworksData] = await Promise.all([
          profileApi.get(id),
          marketplaceApi.listByArtistId(id, { limit: 1000, offset: 0 }), // Fetch all artworks by the artist
        ]);
        const mappedArtist = profileMapper(profileData);
        const mappedArtworks = artworksData.map(art => artworkMapper(art));
        mappedArtist.name = `${mappedArtist.firstName} ${mappedArtist.lastName}`;
        setArtistInfo(mappedArtist);
        setArtworks(mappedArtworks);
      } catch (error) {
        console.error('Error loading artist data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArtistData(id);
  }, [id]);

  const pagination = usePagination(artworks);

  if (loading) {
    return (
      <LoadingSpinner loadingText='Artist Profile' />
    );
  }

  if (!artistInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h2 className="font-serif text-xl">Artist not found</h2>
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col justify-center px-4 md:px-20 2xl:px-100'>
        <section className='flex items-center py-15'>
          <img className='w-45 h-45 rounded-full object-cover'
            src={artistInfo.image}
            alt={artistInfo.name}/>
          <div className='ml-10 flex flex-col'>
            <h2 className='text-4xl font-serif text-heading'>
              {artistInfo.name}
            </h2>
            <p className='text-2xl text-body-text font-sans'>{artistInfo.role}</p>
            <p className='text-body-text text-sm'>{artworks.length} Artworks</p>
          </div>
          <div className='ml-40 mr-20 flex-1 text-body-text text-base'>
            {artistInfo.bio}
          </div>
        </section>

        {artworks.length > 0 && (
          <div className="font-sans">
            Showing {pagination.startIndex + 1}-
            {Math.min(pagination.endIndex, artworks.length)} of {artworks.length} artworks
          </div>
        )}

        <section className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-stretch'>
          {pagination.currentItems.map((artwork, index) => (
            <MarketplaceCard key={index} artwork={artwork} artist={artistInfo} />
          ))}
        </section>

        {/* Pagination selector */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPrevious={pagination.handlePrevious}
          onNext={pagination.handleNext}
          onPageChange={pagination.handlePageChange}
          getPageNumbers={pagination.getPageNumbers} />
      </div>
    </>
  )
}

export default ArtistProfile
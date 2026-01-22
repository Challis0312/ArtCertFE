import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingSpinner, Pagination, ListingCard } from '../components';
import usePagination from '../hooks/usePagination';
import { HiMagnifyingGlass } from "react-icons/hi2";
import { marketplaceApi } from '../services/api';
import { artworkMapper } from '../utils';

/**************************************************************************************************/

/**
 * @file        allArtworks.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Joshua El-Khoury, Chi-Yuan Yang, Faaez Ahmed Kamal]
 * @created     11/08/2025
 * @license     -- tbd
 */

const AllArtworks = () => {
  const [artwork, setArtwork] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await marketplaceApi.list();
        const mappedArtworks = res.map(artwork => artworkMapper(artwork));
        setArtwork(mappedArtworks);

      } catch (error) {
        console.error("Error fetching artworks: ", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Set values to be used in filters
  const tags = Array.from(new Set(artwork.flatMap(art => Array.isArray(art.tags) ? art.tags : [])));
  const mediums = Array.from(new Set(artwork.flatMap(art => (art.artMedium ? [art.artMedium] : ["Unknown"]))));

  const minPrice = artwork.length ? Math.min(...artwork.map(artwork => artwork.price)) : 0;
  const maxPrice = artwork.length ? Math.max(...artwork.map(artwork => artwork.price)) : 0;

  const minYear = artwork.length ? Math.min(...artwork.map(artwork => artwork.dateOfProduction.year)) : 0;
  const maxYear = artwork.length ? Math.max(...artwork.map(artwork => artwork.dateOfProduction.year)) : 0;

  const minWidth = artwork.length ? Math.min(...artwork.map(artwork => artwork.dimensions.width)) : 0;
  const maxWidth = artwork.length ? Math.max(...artwork.map(artwork => artwork.dimensions.width)) : 0;

  const minHeight = artwork.length ? Math.min(...artwork.map(artwork => artwork.dimensions.height)) : 0;
  const maxHeight = artwork.length ? Math.max(...artwork.map(artwork => artwork.dimensions.height)) : 0;

  const [sortBy, setSortBy] = useState('-');
  const [filter, setFilter] = useState({
    search: '',
    tags: [],
    medium: [],
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    minWidth: '',
    maxWidth: '',
    minHeight: '',
    maxHeight: '',
  });

  const [draftFilter, setDraftFilter] = useState({ ...filter });

  // Apply medium filter from query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mediumParam = params.get('medium');
    if (mediumParam) {
      setDraftFilter(prev => ({ ...prev, medium: [mediumParam] }));
      setFilter(prev => ({ ...prev, medium: [mediumParam] }));
      Promise.resolve().then(() => {
        if (pagination && pagination.resetPages) pagination.resetPages();
      });
    }
  }, [location.search]);

  const applyFilters = () => {
    setFilter(draftFilter);
    pagination.resetPages();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    const cleared = {
      search: '',
      tags: [],
      medium: [],
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      minWidth: '',
      maxWidth: '',
      minHeight: '',
      maxHeight: '',
    };
    setDraftFilter(cleared);
    setFilter(cleared);
    pagination.resetPages();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const filteredArtwork = artwork
    .filter(art => {

      if (filter.search && !art.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.tags.length > 0 && !filter.tags.some(tag => art.tags.includes(tag))) return false;
      if (filter.medium.length > 0 && !filter.medium.some(medium => art.artMedium.includes(medium))) return false;

      if (filter.minPrice > filter.maxPrice || filter.minYear > filter.maxYear ||
        filter.minWidth > filter.maxWidth || filter.minHeight > filter.maxHeight) return false;

      if (filter.minPrice && (art.price < parseInt(filter.minPrice))) return false;
      if (filter.maxPrice && (art.price > parseInt(filter.maxPrice))) return false;

      if (filter.minYear && (art.dateOfProduction.year < parseInt(filter.minYear))) return false;
      if (filter.maxYear && (art.dateOfProduction.year > parseInt(filter.maxYear))) return false;

      if (filter.minWidth && (art.dimensions.width < parseInt(filter.minWidth))) return false;
      if (filter.maxWidth && (art.dimensions.width > parseInt(filter.maxWidth))) return false;

      if (filter.minHeight && (art.dimensions.height < parseInt(filter.minHeight))) return false;
      if (filter.maxHeight && (art.dimensions.height > parseInt(filter.maxHeight))) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'yearOldNew') return a.dateOfProduction.year - b.dateOfProduction.year;
      if (sortBy === 'yearNewOld') return b.dateOfProduction.year - a.dateOfProduction.year;
      if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
      if (sortBy === 'priceLowHigh') return a.price - b.price;
      if (sortBy === 'priceHighLow') return b.price - a.price;
      return 0;
    });

  const pagination = usePagination(filteredArtwork);

  return (
    <div className="min-h-screen bg-white">

      {/* Heading */}
      <div className="flex justify-center mb-8 mt-8">
        <h1 className="font-serif text-heading">All Artwork</h1>
      </div>
      <div className="flex justify-center">
        <div className="border-b w-full border-gray-300 mx-8"></div>
      </div>


      {loading ? (
        <LoadingSpinner loadingText='Artworks' />
      ) : (
        <div>
          {/* Main content area */}
          <div className="flex">

            {/* Filter sidebar */}
            <div className="w-1/4 min-h-screen pt-4 pl-8 flex-start align-middle">

              {/* Search field */}
              <div className="flex mb-8">
                <div className="flex w-full align-bottom">
                  <input className="text-left input-filter"
                    style={{ textAlign: 'left' }}
                    type="text"
                    inputMode="text"
                    placeholder="Search artwork"
                    value={draftFilter.search}
                    onChange={e => setDraftFilter(
                      { ...draftFilter, search: e.target.value })} />
                </div>
                <button className="bg-button-primary hover:bg-button-primary-hover font-sans text-white"
                  style={{ borderRadius: '0' }}
                  onClick={applyFilters}>
                  <HiMagnifyingGlass />
                </button>
              </div>

              <h2 className="font-serif text-heading text-left">Filter by</h2>

              {/* Price */}
              <div className="mb-8 ml-4">
                <label className="text-2xl block font-serif mb-2">Price</label>
                <div className="flex items-center">
                  <div className="flex flex-col items-center w-1/2">
                    <span className="font-serif mb-1">Min</span>
                    <div className="flex items-center w-full">
                      <span className="text-3xl mr-1 font-serif">$</span>
                      <input className="input-filter"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={minPrice.toLocaleString()}
                        value={draftFilter.minPrice}
                        onChange={e => setDraftFilter(
                          { ...draftFilter, minPrice: e.target.value.replace(/[^0-9]/g, '') })} />
                    </div>
                  </div>
                  <span className="mx-2 mt-8 font-serif">to</span>
                  <div className="flex flex-col items-center w-1/2">
                    <span className="font-serif mb-1">Max</span>
                    <div className="flex items-center w-full">
                      <span className="text-3xl mr-1 font-serif">$</span>
                      <input className="input-filter"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={maxPrice.toLocaleString()}
                        value={draftFilter.maxPrice}
                        onChange={e => setDraftFilter(
                          { ...draftFilter, maxPrice: e.target.value.replace(/[^0-9]/g, '') })} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-8 ml-4">
                <label className="text-2xl block font-serif mb-2">Tags</label>
                <div className="flex flex-col space-y-2">
                  {tags.map(tag => (
                    <label className="flex items-center space-x-2 font-serif text-xl" key={tag}>
                      <input
                        type="checkbox"
                        checked={draftFilter.tags.includes(tag)}
                        onChange={e => {
                          if (e.target.checked) {
                            setDraftFilter({ ...draftFilter, tags: [...draftFilter.tags, tag] });
                          } else {
                            setDraftFilter(
                              { ...draftFilter, tags: draftFilter.tags.filter(t => t !== tag) });
                          }
                        }} />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mediums */}
              <div className="mb-8 ml-4">
                <label className="text-2xl block font-serif mb-2">Medium</label>
                <div className="flex flex-col space-y-2">
                  {mediums.map(medium => (
                    <label className="flex items-center space-x-2 font-serif text-xl" key={medium}>
                      <input
                        type="checkbox"
                        checked={draftFilter.medium.includes(medium)}
                        onChange={e => {
                          if (e.target.checked) {
                            setDraftFilter({ ...draftFilter, medium: [...draftFilter.medium, medium] });
                          } else {
                            setDraftFilter(
                              { ...draftFilter, medium: draftFilter.medium.filter(t => t !== medium) });
                          }
                        }} />
                      <span>{medium}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Production Year*/}
              <div className="mb-8 ml-4">
                <label className="text-2xl block font-serif mb-2">Production Year</label>
                <div className="flex items-center">
                  <div className="flex flex-col items-center w-1/2">
                    <span className="font-serif mb-1">From</span>
                    <input className="input-filter"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder={`${minYear}`}
                      value={draftFilter.minYear}
                      onChange={e => setDraftFilter(
                        { ...draftFilter, minYear: e.target.value.replace(/[^0-9]/g, '') })}
                      maxLength={4} />
                  </div>
                  <span className="mx-2 mt-8 font-serif">to</span>
                  <div className="flex flex-col items-center w-1/2">
                    <span className="font-serif mb-1">Till</span>
                    <input className="input-filter"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder={`${maxYear}`}
                      value={draftFilter.maxYear}
                      onChange={e => setDraftFilter(
                        { ...draftFilter, maxYear: e.target.value.replace(/[^0-9]/g, '') })}
                      maxLength={4} />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="mb-8 ml-4">
                <label className="text-2xl block font-serif mb-2">Dimensions</label>

                {/* Width */}
                <div className="mb-8">
                  <label className="text-lg block font-serif mb-2 ml-3">Width</label>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center w-1/2">
                      <span className="font-serif mb-1">Min</span>
                      <input className="input-filter"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={`${minWidth} mm`}
                        value={draftFilter.minWidth}
                        onChange={e => setDraftFilter(
                          { ...draftFilter, minWidth: e.target.value.replace(/[^0-9]/g, '') })} />
                    </div>
                    <span className="mx-2 mt-8 font-serif">to</span>
                    <div className="flex flex-col items-center w-1/2">
                      <span className="font-serif mb-1">Max</span>
                      <input className="input-filter"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={`${maxWidth} mm`}
                        value={draftFilter.maxWidth}
                        onChange={e => setDraftFilter(
                          { ...draftFilter, maxWidth: e.target.value.replace(/[^0-9]/g, '') })} />
                    </div>
                  </div>
                </div>

                {/* Height */}
                <div className="mb-8">
                  <label className="text-lg block font-serif mb-2 ml-3">Height</label>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center w-1/2">
                      <span className="font-serif mb-1">Min</span>
                      <input className="input-filter"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={`${minHeight} mm`}
                        value={draftFilter.minHeight}
                        onChange={e => setDraftFilter(
                          { ...draftFilter, minHeight: e.target.value.replace(/[^0-9]/g, '') })} />
                    </div>
                    <span className="mx-2 mt-8 font-serif">to</span>
                    <div className="flex flex-col items-center w-1/2">
                      <span className="font-serif mb-1">Max</span>
                      <input className="input-filter"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={`${maxHeight} mm`}
                        value={draftFilter.maxHeight}
                        onChange={e => setDraftFilter(
                          { ...draftFilter, maxHeight: e.target.value.replace(/[^0-9]/g, '') })} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button className="text-center bg-button-primary hover:bg-button-primary-hover font-sans text-white mb-4"
                style={{ borderRadius: '0', width: '100%' }}
                onClick={applyFilters}>
                Apply Filters
              </button>

              {/* Clear Filters Button */}
              <button className="text-center bg-button-secondary hover:bg-button-secondary-hover font-sans text-heading mb-4"
                style={{ borderRadius: '0', width: '100%' }}
                onClick={clearFilters}>
                Clear Filters
              </button>
            </div>

            {/* Artwork */}
            <div className="flex-1  min-h-screen p-8 pl-4">

              {/* Sort by selector and number of artwork */}
              <div className="flex justify-between mb-4">
                {filteredArtwork.length > 0 && (
                  <div className="font-sans">
                    Showing {pagination.startIndex + 1}-
                    {Math.min(pagination.endIndex, filteredArtwork.length)} of {filteredArtwork.length} artworks
                  </div>
                )}

                <div>
                  <label className="font-sans mr-2">Sort by:</label>
                  <select className="border border-gray-300 rounded px-2 py-1 font-serif"
                    value={sortBy}
                    onChange={e => { setSortBy(e.target.value); pagination.resetPages(); }}>
                    <option value="-" disabled>-</option>
                    <option value="artist">Artist Name</option>
                    <option value="yearOldNew">Oldest First</option>
                    <option value="yearNewOld">Newest First</option>
                    <option value="priceLowHigh">Price (Low to High)</option>
                    <option value="priceHighLow">Price (High to Low)</option>
                  </select>
                </div>
              </div>

              {/* Grid of listings */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-stretch">
                {pagination.currentItems.map((artwork, index) => (
                  <ListingCard key={index} artwork={artwork} />
                ))}
              </div>

              {/* Pagination selector */}
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPrevious={pagination.handlePrevious}
                onNext={pagination.handleNext}
                onPageChange={pagination.handlePageChange}
                getPageNumbers={pagination.getPageNumbers} />

              {/* No valid matches error */}
              {filteredArtwork.length === 0 && (
                <div className="mt-8 flex flex-col items-center">
                  <h2 className="font-serif text-xl mb-8">No artwork in the marketplace match your filters.</h2>
                  <button className="text-center bg-button-secondary hover:bg-button-secondary-hover 
                        font-sans text-black px-4 py-2"
                    style={{ borderRadius: '0' }}
                    onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllArtworks;

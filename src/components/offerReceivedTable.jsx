
import React, { useEffect, useState, useCallback  } from 'react';
import { offerApi } from '../services/api';
import { artworkWithOffersMapper, offerReceivedOffersMapper, artworkDetailMapper } from '../utils';
import { useNavigate } from 'react-router-dom';
/**
 * @file        offerReceivedTable.jsx
 * @description Table component for displaying received offers with buyer information
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [David Relacion]
 * @created     03/10/2025
 * @license     -- tbd
 */

const OfferReceivedTable = () => {

  const [isLoading, setLoading] = useState(true)
  const [offerArtworkData, setOfferArtworkData] = useState([])
  const [selectedArtworkId, setSelectedArtworkId] = useState(null);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [filteredArt, setFilteredArt] = useState({});
  const navigate = useNavigate();

  // Cache to store offers by artworkId
  const [offersCache, setOffersCache] = useState({});

  const fetchOfferArtworks = async () => {
    try {
      const res = await offerApi.listReceived();
      const mappedArtworks = res.map(offers => artworkWithOffersMapper(offers));
      
      setOfferArtworkData(mappedArtworks);
      
      // 2. Set first artwork as selected if available
      if (mappedArtworks.length > 0) {
        setSelectedArtworkId(mappedArtworks[0].artworkId);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching offers received:", error);
      setLoading(false);
    }
  };

const fetchOffersByArtwork = useCallback(async (artworkId, forceRefresh = false) => {
  if (!artworkId) return;
  
  // Check if data is in cache and we're not forcing a refresh
  if (!forceRefresh && offersCache[artworkId]) {
    setFilteredOffers(offersCache[artworkId].offers);
    setFilteredArt(offersCache[artworkId].artwork);
    setLoading(false);
    return;
  }
  
  setLoading(true);
  try {
    const res = await offerApi.listReceivedByArtwork(artworkId);
    const filteredOffers = res.offers.map(offer => offerReceivedOffersMapper(offer));
    const filteredArtwork = artworkDetailMapper(res.artwork);

    // Update cache
    setOffersCache(prevCache => ({
      ...prevCache,
      [artworkId]: {
        offers: filteredOffers,
        artwork: filteredArtwork
      }
    }));

    setFilteredOffers(filteredOffers);
    setFilteredArt(filteredArtwork);
  } catch (error) {
    console.error(`Error fetching offers for artwork ${artworkId}:`, error);
    
    // Cache the empty state so we don't keep retrying
    setOffersCache(prevCache => ({
      ...prevCache,
      [artworkId]: {
        offers: [],
        artwork: {}
      }
    }));
    setFilteredOffers([]);
    setFilteredArt({});
  } finally {
    setLoading(false);
  }
}, [offersCache]);

const handleReject = async (offerId) => {
  try {
    const res = await offerApi.reject(offerId);
    
    // Clear cache for this artwork to force fresh fetch
    setOffersCache(prevCache => {
      const newCache = { ...prevCache };
      delete newCache[selectedArtworkId];
      return newCache;
    });
    
    // Refetch with forceRefresh=true to bypass cache
    if (selectedArtworkId) {
      await fetchOffersByArtwork(selectedArtworkId, true);
    }
  } catch (error) {
    console.error('Error rejecting offer:', error);
    
    // Even if there's an error, clear the cache and try to refetch
    setOffersCache(prevCache => {
      const newCache = { ...prevCache };
      delete newCache[selectedArtworkId];
      return newCache;
    });
    
    if (selectedArtworkId) {
      await fetchOffersByArtwork(selectedArtworkId, true);
    }
  }
};

const handleAccept = async (offerId) => {
  try {
    const res = await offerApi.accept(offerId);
    
    // Clear cache for this artwork to force fresh fetch
    setOffersCache(prevCache => {
      const newCache = { ...prevCache };
      delete newCache[selectedArtworkId];
      return newCache;
    });
    
    // Refetch with forceRefresh=true to bypass cache
    if (selectedArtworkId) {
      await fetchOffersByArtwork(selectedArtworkId, true);
    }
  } catch (error) {
    console.error('Error accepting offer:', error);
  } finally {
    navigate(`/registry`);
  }
};

  const handleArtworkChange = (e) => {
    const newArtworkId = e.target.value;
    setSelectedArtworkId(newArtworkId);
  };

  // Initial load: fetch artworks
  useEffect(() => {
    fetchOfferArtworks();
  }, []);


  // When selectedArtworkId changes, fetch offers for that artwork
  useEffect(() => {
    if (selectedArtworkId) {
      fetchOffersByArtwork(selectedArtworkId);
    }
  }, [selectedArtworkId, fetchOffersByArtwork]);

 // Get the selected artwork details
  const selectedArtwork = offerArtworkData.find(
    artwork => artwork.artworkId === selectedArtworkId
  );

return (
    <div className="w-full overflow-x-auto">
      {/* Dropdown list */}
      <div className="mb-6">
        <label htmlFor="artwork-select" className="block text-lg font-medium text-gray-700 mb-2">
          Select Artwork
        </label>
        <select
          id="artwork-select"
          value={selectedArtworkId || ''}
          onChange={handleArtworkChange}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          disabled={offerArtworkData.length === 0}
        >
          {offerArtworkData.map((artwork) => (
            <option key={artwork.artworkId} value={artwork.artworkId}>
              {artwork.artworkName} by {artwork.artistFirstName} {artwork.artistLastName + ' '} 
              ({artwork.offerCount} {artwork.offerCount === 1 ? 'offer' : 'offers'})
            </option>
          ))}
        </select>
        {selectedArtwork && (
          <div className="mt-2 text-sm text-gray-600">
            Latest offer: {new Date(selectedArtwork.latestOfferDate.date).toLocaleDateString()}
          </div>
        )}
      </div>

           {/* Two Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-30">

        {/* Left Panel - Artwork Details */}
        <div className="bg-white border border-gray-200 p-6">
          {filteredArt ? (
            <div>
              {/* Artwork Image */}
              <div className="w-full aspect-[4/3] mb-4 overflow-hidden">
                <img 
                  src={filteredArt.jpegReference || '/placeholder-image.jpg'} 
                  alt={filteredArt.artworkName || 'Artwork'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Artist Info */}
              <h2 className="text-2xl font-serif mb-2">
                Artist: {filteredArt.authorFirstName} {filteredArt.authorLastName}
              </h2>

              {/* Artwork Details Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Medium</div>
                  <div className="text-gray-800">{filteredArt.artMedium}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Dimensions</div>
                  <div className="text-gray-800">{`${filteredArt.dimensions?.width}mm x ${filteredArt.dimensions?.height}mm`}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Date of Production</div>
                  <div className="text-gray-800">{`${filteredArt.dateOfProduction?.year}`}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Description</div>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {filteredArt.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-2xl font-semibold text-gray-900">
                Market Price: ${filteredArt?.price?.toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              No artwork selected
            </div>
          )}
        </div>

      {/* Right Panel - Offers Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-800">
              <th className="text-4xl text-center py-1 px-4 font-serif font-normal text-gray-700 w-1/4">Buyers</th>
              <th className="text-4xl text-center py-1 px-4 font-serif font-normal text-gray-700 w-1/4">Price</th>
              <th className="text-4xl text-center py-1 px-4 font-serif font-normal text-gray-700 w-1/4">Date</th>
              <th className="text-4xl text-center py-1 px-4 font-serif font-normal text-gray-700 w-1/4">Decision bar</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="py-8 px-4 text-center text-gray-500">
                  Loading offers...
                </td>
              </tr>
            ) : filteredOffers.length > 0 ? (
              filteredOffers.map((offer, index) => (
                <tr 
                  key={offer?.offerId} 
                  className={`border-b border-gray-200 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={offer?.buyerAvatar || 'https://avatar.iran.liara.run/public/1'} 
                        alt={`${offer?.buyerFirstName} ${offer?.buyerLastName}`}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-gray-800 text-xl truncate">
                          {`${offer.buyerFirstName} ${offer?.buyerLastName}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-800 text-xl text-center">
                    ${offer?.price?.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-center">
                    <div className="text-xl">{offer?.date.date}</div>
                    <div className="text-lg">{offer?.date.time}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleAccept(offer?.offerId)}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors text-xs flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={offer?.status === 'accepted' || offer?.status === 'rejected'}
                      >
                        <span>✓</span> Accept
                      </button>
                      <button 
                        onClick={() => handleReject(offer?.offerId)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors text-xs flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={offer?.status === 'accepted' || offer?.status === 'rejected'}
                      >
                        <span>✕</span> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 px-4 text-center text-gray-500">
                  No offers received for this artwork
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};


export default OfferReceivedTable
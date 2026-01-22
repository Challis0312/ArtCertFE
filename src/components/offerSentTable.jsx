import React, { useState, useEffect } from 'react';
import { Pagination } from '../components';
import { useNavigate } from 'react-router-dom';
import usePagination from '../hooks/usePagination';
import { offerApi } from '../services/api';
import { offerSentMapper } from '../utils';

/**
 * @file        offerSentTable.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [David Relacion]
 * @created     02/10/2025
 * @license     -- tbd
 */



const offerSentTable = () => {

  const [currentFilter, setFilter] = useState('Accepted')
  const [offerSent, setOfferSent] = useState([])
  const [isLoading, setLoading] = useState(true);



  const fetchOffers = async () => {
    try{
      const res = await offerApi.listSent();
      const mappedOffers = res.map( offers => offerSentMapper(offers));
      console.log(mappedOffers)
      setOfferSent(mappedOffers)
      setLoading(false)
    }catch(error){
      console.error("Error fetching offers sent:", error);
    }
  }

  useEffect(() => {
    console.log("Offer Sent Table");
    fetchOffers();
  }, []);

  const navigate = useNavigate();

  const handleView = (artworkID) => {
    navigate(`/marketplace/all/${artworkID}`)
  }

  const handleManage = (artworkID) => {
    navigate(`/registry/${artworkID}`)
  }

  const handleCancel= async (offerID) => {
    setLoading(true);
    try{
      const res = await offerApi.cancel(offerID);
      console.log('DELETED', res);

      // Refetch offers after successful cancellation
      await fetchOffers();
    }catch (error){
      console.error("Error deleting offer:", error)
    }finally{
      setLoading(false);
    }
  }

  const onFilterClick = (filterName) => {
    setFilter(filterName)
  }

  const getFilterButtonClasses = (filterName) => {
    const baseClasses = 'cursor-pointer sm:text-2xl md:text-4xl font-serif px-8 py-2 transition-colors flex-wrap';
    const activeClasses = 'text-gray-900 border-b-2 border-gray-900';
    const inactiveClasses = 'text-gray-400 hover:text-gray-600';

    return `${baseClasses} ${currentFilter === filterName ? activeClasses : inactiveClasses}`;
  }

  // Filter offers based on current filter
  const filteredOffers = offerSent.filter(offer => 
    offer.status.toLowerCase() === currentFilter.toLowerCase()
  );
  const pagination = usePagination(filteredOffers);

  return (
    <>
    {/* Filter Criteria */}
    <div className='flex flex-row gap-x-2 mb-10'>
      <div className={getFilterButtonClasses('Accepted')} onClick={() => onFilterClick('Accepted')}> Accepted </div>
      <div className={getFilterButtonClasses('Pending')} onClick={() => onFilterClick('Pending')}> Pending </div>
      <div className={getFilterButtonClasses('Rejected')} onClick={() => onFilterClick('Rejected')}> Rejected </div>
    </div>


    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr className="border-b-2 border-slate-800">
            <th className="text-4xl text-center py-1 px-6 font-serif font-normal text-gray-700 w-1/5">Title</th>
            <th className="text-4xl text-center py-1 px-6 font-serif font-normal text-gray-700 w-1/5">Artist</th>
            <th className="text-4xl text-center py-1 px-6 font-serif font-normal text-gray-700 w-1/5">Price</th>
            <th className="text-4xl text-center py-1 px-6 font-serif font-normal text-gray-700 w-1/5">Date</th>
            {/* Remove the last column is removed for Rejected */}
            {currentFilter !== 'Rejected' && (
              <th className="text-4xl text-center py-1 px-6 font-serif font-normal text-gray-700 w-1/5">Decision bar</th>
            )}

          </tr>
        </thead>
        <tbody>

          {/* Shows filtered list of Artwork based on status */}
          {
          
          filteredOffers.length > 0 ? (
            filteredOffers.map((offer, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-200 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="text-2xl py-4 px-6 text-gray-800 truncate">{offer?.artworkName}</td>
                <td className="text-2xl py-4 px-6 text-gray-800 truncate">{`${offer?.artistFirstName} ${offer?.artistLastName}`}</td>
                <td className="text-2xl py-4 px-6 text-gray-800 truncate">${offer?.price.toLocaleString()}</td>
                <td className="text-2xl py-4 px-6 text-gray-600 truncate">
                  <div>{offer?.createdAt?.date}</div>
                  <div className="text-sm truncate">{offer?.createdAt?.time}</div>
                </td>

              
                {currentFilter == 'Pending' && (
                  <td className="py-4 flex gap-2">
                    <button 
                      onClick={() => handleView(offer?.artworkId)} 
                      className="bg-button-primary text-white py-2 flex-1 rounded-md hover:bg-slate-800 transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleCancel(offer?.offerId)}
                      disabled={isLoading}
                      className="bg-button-primary text-white py-2 flex-1 rounded-md hover:bg-slate-800 transition-colors"
                    >
                      {isLoading ? 'Canceling...' : 'Cancel'}
                    </button>
                  </td>
                )}

                {currentFilter == 'Accepted' && (
                  <td className="py-4 flex">
                    <button 
                      onClick={() => handleManage(offer?.artworkId)}
                      className="bg-button-primary text-white py-2 flex-1 rounded-md hover:bg-slate-800 transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                )}                
              </tr>
              
            ))
          ): (
              <tr>
                <td colSpan="5" className="py-8 px-6 text-center text-gray-500">
                  No {currentFilter.toLowerCase()} offers found
                </td>
              </tr>
          ) }

        </tbody>
      </table>
    </div>

    {/* Pagination selector */}
    <Pagination
    currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      onPrevious={pagination.handlePrevious}
      onNext={pagination.handleNext}
      onPageChange={pagination.handlePageChange}
      getPageNumbers={pagination.getPageNumbers} />   
    </>
  );
};

export default offerSentTable
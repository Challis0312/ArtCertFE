import React, { useState, useEffect } from 'react';
import { LoadingSpinner, OfferReceivedTable, OfferSentTable } from '../components';
import { RiInboxLine } from "react-icons/ri";
import { LuPencilLine } from "react-icons/lu";
import { artworkWithOffersMapper } from '../utils';
import { offerApi } from '../services/api';


/**************************************************************************************************/

/**
 * @file        offerPage.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [David Relacion]
 * @created     02/10/2025
 * @license     -- tbd
 */

const OfferPage = () => {
    const [isLoading, setLoading] = useState(true);
    const [activeCategory, setCategory] = useState('received');
    const [OfferArtworkData, setOfferArtworkData] = useState([])

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await offerApi.listReceived();
        const mappedArtworks = res.map(offers =>
          artworkWithOffersMapper(offers)
        );
        setOfferArtworkData(mappedArtworks)
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) {
          setTimeout(() => setLoading(false), 1000);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false; // prevent state updates if component unmounted
    };
  }, [isLoading]);

    const getFilterButtonClasses = (filterName) => {
      const baseClasses = 'flex items-center gap-2 px-4 py-2 rounded-md transition-colors cursor-pointer';
      const activeClasses = 'bg-slate-800 text-white shadow';
      const inactiveClasses = 'bg-gray-100 text-gray-600 hover:bg-gray-200';

      return `${baseClasses} ${activeCategory === filterName ? activeClasses : inactiveClasses}`;
    }

    return (
        <>
          <h1 className='text-center font-serif text-heading mt-5'> Offers </h1>
          <div className='px-50'>

          <div className="flex flex-row gap-x-2 mb-10"
            role="tablist"
            aria-label="Offer filters">
            <button className={getFilterButtonClasses('received')}
              type="button"
              role="tab"
              aria-selected={activeCategory === "received"}
              onClick={() => setCategory("received")}>
              <RiInboxLine className="w-5 h-5" />
              <span>Offers Received</span>
            </button>

            <button className={getFilterButtonClasses('sent')}
              type="button"
              role="tab"
              aria-selected={activeCategory === "sent"}
              onClick={() => setCategory("sent")}>
              <LuPencilLine className="w-5 h-5" />
              <span>Offers Sent</span>
            </button>
          </div>

          { isLoading ? (
              <LoadingSpinner loadingText='Offers' />
            ) : (
              <>
                {activeCategory === 'received' ? (
                  OfferArtworkData.length > 0 ? (
                    <OfferReceivedTable/>
                  ) : (
                    <div className="text-center py-20">
                      <h1 className="font-serif text-heading">No Offers to show</h1>
                    </div>
                  )
                ):(
                  <OfferSentTable/>
                )}
              </>
            )
          }
          </div>
        </>  
    );
}

export default OfferPage;
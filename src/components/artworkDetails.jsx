import React from "react";
import Unverified from '../assets/unverified.svg'
import Verified from '../assets/verified.svg'
import avatarPlaceholder from '../assets/avatar.png';

/**************************************************************************************************/

/**
 * @file        artworkDetails.jsx
 * @description -- tbd
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     07/10/2025
 * @license     -- tbd
 */

const ArtworkDetails = ({ artwork, artist, isModalOpen, openModal, closeModal }) => {
  return (
    <>
      <section className="px-4 md:px-20 2xl:px-100 w-full">
        <div className='flex sm:gap-6 sm:my-5 md:gap-8 md:my-10 lg:gap-10 lg:my-10 xl:gap-10 xl:my-15 '>
          
          {/* Artwork Image */}
          <div className='flex-1 border border-gray-300 flex justify-center items-center'>
            <div className='relative flex justify-center items-center w-full h-full'>
              <img className="object-scale-down"
                src={artwork?.url}
                alt={artwork?.title}/>
              
              {/* Zoom icon */}
              <div className='absolute bottom-1 right-1 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 cursor-pointer transition-all duration-200 hover:scale-110'
                onClick={openModal}>
                <svg className='w-5 h-5 text-heading' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7' />
                </svg>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className='flex-2 min-w-0'>
            
            {/* Title and Verification */}
            <div className='mb-6 pt-8 sm:pt-2 md:pt-4 lg:pt-8 xl:pt-8'>
              <h1 className='font-serif text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 sm:mb-2 md:mb-6 lg:mb-8'>
                {artwork?.title ?? 'Loading...'}
              </h1>

              <div className="flex gap-10 items-center mb-6">
                
                {/* Artist Info */}
                <div className="flex items-center gap-3">
                  <img className="w-12 h-12 rounded-full object-cover"
                    src={artist?.image}
                    alt="Artist avatar"
                    onError={(e) => { e.target.onerror = null; e.target.src = avatarPlaceholder; }}/>
                  <div>
                    <p className="text-sm text-heading">Artist</p>
                    <p className="text-m text-black">{artist?.name ?? 'Loading'}</p>
                  </div>
                </div>

                {/* Verified Status */}
                <div className="flex items-center gap-3 min-w-[10rem]">
                  <img src={artwork?.verified ? Verified : Unverified} className="w-12 h-12" />
                  <span className="text-lg">{artwork?.verified ? "Verified" : "Unverified"}</span>
                </div>
              </div>
            </div>

            {/* Artwork Specifications */}
            <div className="w-full">
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mb-6'>
                <div>
                  <p className='text-m text-heading mb-1'>Owner</p>
                  <p className='text-sm text-black'>{artist.name}</p>
                </div>
                <div>
                  <p className='text-m text-heading mb-1'>Medium</p>
                  <p className='text-sm text-black'>{artwork?.artMedium}</p>
                </div>
                <div>
                  <p className='text-m text-heading mb-1'>Dimensions</p>
                  <p className='text-sm text-black'>{`${artwork?.dimensions.width} x ${artwork?.dimensions.height}`}</p>
                </div>
                <div>
                  <p className='text-m text-heading mb-1'>Date of Production</p>
                  <p className='text-sm text-black'>
                    {artwork?.dateOfProduction.day}/{artwork?.dateOfProduction.month}/{artwork?.dateOfProduction.year}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className='text-m text-heading mb-3'>Description</h3>
              <p className='text-sm text-black leading-relaxed text-justify'>{artwork?.description}</p>
            </div>
          </div>
        </div>
    </section>

    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={closeModal}>
        </div>

        {/* Modal content */}
        <div className="relative z-10 w-full h-full overflow-auto p-4">
          
          {/* Close button */}
          <button className="fixed top-4 right-4 z-20 bg-white p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={closeModal}>
            <svg className="w-6 h-6 text-heading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Enlarged image */}
          <div className="flex items-center justify-center min-h-full">
            <img className="max-w-none h-auto shadow-2xl"
              src={artwork?.url}
              alt={`"${artwork?.title} - enlarged view"`}
              style={{ maxWidth: 'none', width: 'auto', height: 'auto' }}/>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ArtworkDetails;

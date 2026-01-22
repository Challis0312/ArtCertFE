import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TiEye } from "react-icons/ti";
import { FaShareAlt, FaDollarSign } from 'react-icons/fa';
import { HiBadgeCheck } from "react-icons/hi";

import Unverified from '../assets/unverified.svg'
import Verified from '../assets/verified.svg'
import Listed from '../assets/listed.svg'
import Unlisted from '../assets/unlisted.svg'
import Authenticated from '../assets/authenticated.svg'
import Unauthenticated from '../assets/unauthenticated.svg'

import PropTypes from "prop-types";
import { registryApi } from '../services/api';

/**************************************************************************************************/

/**
 * @file        manageArtworkCard.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [David Relacion, Faaez Ahmed Kamal]
 * @created     27/08/2025
 * @license     -- tbd
 */


const ManageArtworkCard = ({ artwork, onCreateListing, onSetRequestVerification }) => {

  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(artwork?.toggle);
  const onToggle = async (toggleValue) => {
    if (toggleValue === isPublic) {
      return; // No change  
    } else if (artwork.publicRecord && toggleValue === false) {
      alert("Artwork is listed in the marketplace. Unlist it first before making it private.");
      return;
    }

    try {
      await registryApi.toggle(artwork.id);
    } catch (error) {
      console.error("Error updating artwork visibility:", error);
    } finally {
      artwork.toggle = toggleValue;
      setIsPublic(toggleValue);
    }
  }

  const onShare = async () => {
    // Only share if the artwork is listed in the marketplace because Preview is not implemented yet
    if (!artwork.publicRecord) {
      alert("List the artwork in the marketplace to share it.");
      return;
    }
    const shareUrl = `${window.location.origin}/marketplace/all/${artwork.id}`;
    await navigator.clipboard.writeText(shareUrl);
    alert("Artwork link copied to clipboard!");
  }

  return (
    <section className="w-full bg-white py-10">

      {/* Wrapper: stacks on mobile, side-by-side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-10 place-items-center px-20">


        {/* Left Component - Image column */}
        <div className="
        md:w-8/10 md:h-8/10 
        lg:w-9/10 lg:h-9/10 
        sm:w-80 sm:h-60 
        border-3 border-stone-100 px-8 
        grid place-items-center justify-self-center">

          <div className="overflow-hidden flex">
            <img className="aspect-square block max-w-full max-h-full object-contain object-center"
              src={artwork.url}
              alt={artwork?.title ?? "Artwork image"}
              loading="lazy"/>
          </div>
        </div>

        {/* Right Component : title, badges, actions */}
        <div className="flex-1  justify-self-start">
          <h1 className="font-serif text-slate-700">
            {artwork?.title || "Untitled"}
          </h1>

          {/* Outer Container 1 */}
          <div className="flex flex-wrap gap-5 w-full items-center mt-8">

            {/* Visibility toggle container*/}
            <div>
              <button className={`w-30 font-sans text-center btn-transition ${!isPublic
                ? 'bg-button-primary hover:bg-button-primary-hover text-white'
                : 'bg-button-secondary hover:bg-button-secondary-hover text-black'
                }`}
                style={{ borderRadius: '0' }}
                onClick={() => onToggle(false)}>
                Private
              </button>
              <button className={`w-30 font-sans text-center btn-transition ${isPublic
                ? 'bg-button-primary hover:bg-button-primary-hover text-white'
                : 'bg-button-secondary hover:bg-button-secondary-hover text-black'
                }`}
                style={{ borderRadius: '0' }}
                onClick={() => onToggle(true)}>
                Public
              </button>
            </div>


            {/* Actions container */}
            <div className="flex gap-5">
              <button className="flex items-center gap-2 border border-color-slate-700 px-4 py-2 text-slate-700
                hover:bg-button-primary hover:text-stone-100 
                btn-transition"
                style={{ borderRadius: '0',  border: '1px solid' }}
                onClick={() => {
                  if (!artwork?.id) {
                    alert('Error: No artwork ID found!');
                    return;
                  }
                  
                  try {
                    { artwork.publicRecord ? navigate(`/marketplace/all/${artwork.id}`) : navigate(`/preview/${artwork.id}`)};
                    console.log('Navigation successful!');
                  } catch (error) {
                    console.error('Navigation failed:', error);
                    navigate("/404", { replace: true });
                  }
                }}>
                <TiEye className="w-5 h-5" /> Preview
              </button>
              <button className="flex items-center gap-2 border border-color-slate-700 px-4 py-2 text-slate-700
                hover:bg-button-primary hover:text-stone-100 btn-transition"
                style={{ borderRadius: '0', border: '1px solid' }}
                onClick={onShare}>
                <FaShareAlt className="w-5 h-5" /> Share
              </button>
            </div>

          </div>


          {/* 2nd row container */}
          <div className="mt-8">
            {/* Flex column container for stacking rows */}
            <div className="flex flex-col gap-2">

              {/* Row 1: Verification badge and button */}
              <div className="flex items-center gap-6">
                {/* Verification badge */}
                <div className="flex items-center gap-2 w-48 h-12">
                  <img src={artwork.verified ? Verified : Unverified} className="w-12 h-12" />
                  <span className="text-lg leading-none">{artwork.verified ? 'Verified' : 'Unverified'}</span>
                </div>

                {/* Request Verification button */}
                {!artwork.verified && !artwork.verificationPending && (
                  <button className="inline-flex items-center gap-2 h-12 border border-color-slate-700 px-4 
                  text-slate-700 hover:bg-button-primaryhover:text-stone-100 btn-transition"
                    style={{ borderRadius: '0', border: '1px solid' }}
                    onClick={() => onSetRequestVerification(true)}>
                    <HiBadgeCheck className='w-5 h-5' />
                    Request Verification
                  </button>
                )}

                {!artwork.verified && artwork.verificationPending && (
                  <span className="inline-flex items-center h-12 px-3 text-sm text-stone-600 bg-stone-100">
                    Verification requested
                  </span>
                )}
              </div>

              {/* Row 2: Listing badge and button */}
              <div className="flex items-center gap-6 mt-2">
                {/* Listing badge */}
                <div className="flex items-center gap-2 w-48">
                  <img src={artwork.publicRecord ? Listed : Unlisted} className="w-12 h-12" />
                  <span className="text-lg">{artwork.publicRecord ? 'For Sale' : 'Not For Sale'}</span>
                </div>
                {/* Create Listing button */}
                {!artwork.publicRecord &&
                <button className="flex items-center gap-2 border border-color-slate-700 px-4 py-2 text-slate-700
                hover:bg-button-primary hover:text-stone-100 btn-transition"
                  onClick={onCreateListing}
                  style={{ borderRadius: '0', border: '1px solid' }}>
                    <FaDollarSign className='w-5 h-5' />
                    Create marketplace listing
                </button>}
              </div>

              {/* Row 3: Authentication badge */}
              <div className="flex items-center gap-6">
                {/* Verification badge */}
                <div className="flex items-center gap-2 w-48">
                  <img src={artwork.authenticated ? Authenticated : Unauthenticated} className="w-12 h-12" />
                  <span className="text-lg">{artwork.authenticated ? 'Authenticated' : 'Unauthenticated'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

ManageArtworkCard.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    artist: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    url: PropTypes.string,
    verified: PropTypes.bool,
    publicRecord: PropTypes.bool,
    authenticated: PropTypes.bool
  }),
  onCreateListing: PropTypes.func
};

export default ManageArtworkCard;
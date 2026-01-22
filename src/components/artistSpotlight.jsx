import React from "react";
import { Link } from "react-router-dom";
import profilePlaceholder from '../assets/profile_placeholder.jpeg';

/**************************************************************************************************/

/**
 * @file        artistSpotlight.jsx
 * @description -- tbd
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     07/10/2025
 * @license     -- tbd
 */

const ArtistSpotlight = ({artist, isRegistered}) => {
  return (
    <section className="w-full bg-[#4691ae] text-teal-50 px-4 md:px-20 2xl:px-100">
      <div className="max-w-6xl py-16 md:py-20">
        <div className="grid items-center gap-5 md:grid-cols-2">
          
          {/* Image with decorative frame */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="p-4 border border-white" aria-hidden="true">
              <img className="relative z-10 aspect-[4/5] w-full object-cover"
                src={artist?.image}
                alt={"artistProfile"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = profilePlaceholder;
                }}/>
            </div>
          </div>

          {/* Copy block */}
          <div className="border-teal-200/30 p-8 md:p-10">
            <p className="font-sans mb-2 text-lg uppercase tracking-wider text-teal-200">
              About the Artist
            </p>
            <h2 className="mb-4 font-serif text-3xl leading-tight md:text-4xl">{artist?.name}</h2>
            <div className="space-y-4 text-teal-100/90">{artist?.bio}</div>
            <div className="mt-6">
              {isRegistered && (
                <Link className="!text-white inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium transition focus:outline-none"
                  to={`/public/${artist?.userId}`}>
                  View Artist's Collection
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistSpotlight;
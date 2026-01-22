import React, { useState, useEffect } from 'react'
import { useAuth } from "../contexts/authContext.jsx";
import { useNavigate } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import ipIcon from '../assets/2.svg'
import documentIcon from '../assets/document.svg'
import fraudIcon from '../assets/3.svg'
import reachIcon from '../assets/5.svg'
import confidenceIcon from '../assets/6.svg'
import banner1 from '../assets/sellers.png'
import banner2 from '../assets/buyers.png'
import { LoadingSpinner } from '../components'
import { marketplaceApi } from '../services/api'
import { artworkMapper } from '../utils'

/**************************************************************************************************/
/**
 * @file        home.jsx
 * @description Home Page
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Jianyu Chai, Faaez Ahmed Kamal]
 * @created     11/10/2025
 * @license     -- tbd
 */

const Home = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [gridArtworks, setGridArtworks] = useState([])

  // Navigate to Registry
  const handleCreateRegistry = () => navigate('/registry')
  
  // Navigate to Marketplace
  const handleGoMarketplace = () => navigate('/marketplace')
  
  // Navigate to Marketplace all
  const handleBrowseMarketplace = () => navigate('/marketplace/all')

  // Navigate to Sellers listing (same destination as marketplace for now)
  const handleSellerList = () => navigate('/marketplace/all')
  
  // Navigate to Login
  const { login } = useAuth();

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await marketplaceApi.list();
        const mappedArtworks = res.map(artwork => artworkMapper(artwork));
        
        console.log('Total artworks:', mappedArtworks.length);
        console.log('Sample artwork tags:', mappedArtworks[0]?.tags);
        
        // Filter for artworks with "test bed" tag (case-insensitive)
        const testBedArtworks = mappedArtworks
          .filter(artwork => {
            if (!artwork.tags || !Array.isArray(artwork.tags)) return false;
            return artwork.tags.some(tag => 
              tag.toLowerCase().includes('test bed') || tag.toLowerCase().includes('testbed')
            );
          })
        
        console.log('Test bed artworks found: ', testBedArtworks.length);
        
        // If not enough test bed artworks, use any available artworks
        if (testBedArtworks.length < 7) {
          console.log('Not enough test bed artworks, using all available artworks');
          setGridArtworks(mappedArtworks);
        } else {
          setGridArtworks(testBedArtworks);
        }
      } catch (error) {
        console.error("Failed to load artworks:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Feature blocks (icon + title + description)
  const artistFeatures = [
    {
      icon: ipIcon,
      title: 'Protect your Intellectual Property',
      desc: '',
    },
    {
      icon: fraudIcon,
      title: "Don't let fraudsters stand a chance",
      desc: '',
    },
    {
      icon: reachIcon,
      title: 'Reach new audiences',
      desc:
        "ArtCert tracks an artwork's ownership and sales to provide a complete provenance trail.",
    },
    {
      icon: confidenceIcon,
      title: 'Give your buyer the confidence to click purchase.',
      desc:
        "The immutable Certificate of Authenticity guarantees the legitimacy of your artwork.",
    },
  ]

    // Feature blocks (icon + title + description)
  const collectorFeatures = [
    {
      icon: documentIcon,
      title: 'Document your collection',
      desc: '',
    },
    {
      icon: fraudIcon,
      title: "Don't let fraudsters stand a chance",
      desc: '',
    },
    {
      icon: reachIcon,
      title: 'Reach new audiences',
      desc:
        "ArtCert tracks an artwork's ownership and sales to provide a complete provenance trail.",
    },
    {
      icon: confidenceIcon,
      title: 'Give your buyer the confidence to click purchase.',
      desc:
        "The immutable Certificate of Authenticity guarantees the legitimacy of your artwork.",
    },
  ]

  return (
    <>
      {/* Main container — consistent horizontal paddings with registry.jsx */}
      <div className="flex flex-col justify-center px-4 md:px-20 2xl:px-100 mb-10">

        {/* Hero section */}
        <section className="py-16 md:py-20">
          <h1 className="text-center font-serif text-heading leading-[1.2]">
            Document  your Artwork, Certify your Ownership, <br className="hidden md:block" />
            Buy & Sell with Confidence.
          </h1>

          {/* Call-to-action buttons */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={handleCreateRegistry}
              style={{ borderRadius: 0 }}
              className="btn-transition font-sans px-5 py-3 text-sm font-semibold text-white
                         bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)]">
              Create or Access registry
            </button>
            <button
              onClick={handleGoMarketplace}
              style={{ borderRadius: 0 }}
              className="btn-transition font-sans px-5 py-3 text-sm font-semibold
                         bg-[var(--color-button-secondary)] hover:bg-[var(--color-button-secondary-hover)]
                         text-[var(--color-heading)] inline-flex items-center gap-2">
              Go to Marketplace <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Masonry-like image grid */}
        {loading ? (
          <LoadingSpinner loadingText="Gallery" />
        ) : gridArtworks.length > 0 ? (
          <section className="mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-2 lg:auto-rows-[300px]">
              {/* Only render grid items if we have enough artworks */}
              {gridArtworks[0] && (
                <div className="overflow-hidden rounded-none lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-1">
                  <img src={gridArtworks[0].url} alt={gridArtworks[0].title || "art-tile-1"} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}

              {gridArtworks[1] && (
                <div className="overflow-hidden rounded-none lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-1">
                  <img src={gridArtworks[1].url} alt={gridArtworks[1].title || "art-tile-2"} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}

              {gridArtworks[2] && (
                <div className="overflow-hidden rounded-none lg:col-start-4 lg:col-span-1 lg:row-start-1 lg:row-span-1">
                  <img src={gridArtworks[2].url} alt={gridArtworks[2].title || "art-tile-3"} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}

              {gridArtworks[3] && (
                <div className="overflow-hidden rounded-none lg:col-start-5 lg:col-span-2 lg:row-start-1 lg:row-span-1">
                  <img src={gridArtworks[3].url} alt={gridArtworks[3].title || "art-tile-4"} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}

              {gridArtworks[6] && (
                <div className="overflow-hidden rounded-none lg:col-start-1 lg:col-span-2 lg:row-start-2 lg:row-span-1">
                  <img src={gridArtworks[6].url} alt={gridArtworks[6].title || "art-tile-7"} className="h-75 w-full object-cover" loading="lazy" />
                </div>
              )}

              {gridArtworks[4] && (
                <div className="overflow-hidden rounded-none lg:col-start-3 lg:col-span-2 lg:row-start-2 lg:row-span-1">
                  <img src={gridArtworks[4].url} alt={gridArtworks[4].title || "art-tile-5"} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}

              {gridArtworks[5] && (
                <div className="overflow-hidden rounded-none lg:col-start-5 lg:col-span-2 lg:row-start-2 lg:row-span-1">
                  <img src={gridArtworks[5].url} alt={gridArtworks[5].title || "art-tile-6"} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}
            </div>
          </section>
        ) : null}

        {/* Artists section (left copy + right features) */}
        <section className="py-12 md:py-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy + buttons */}
            <div className="self-center">
              <h2 className="text-center font-serif text-heading text-2xl md:text-3xl">Artists</h2>
              <p className="mt-3 font-sans text-body-text max-w-xl mx-auto text-center">
                ArtCert makes it possible for artists to document and validate the authenticity and intellectual property of their artworks!</p>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  style={{ borderRadius: 0 }}
                  onClick={handleCreateRegistry}
                  className="btn-transition font-sans rounded-xl px-5 py-3 text-sm font-semibold text-white
                             bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)]">
                  Create a registry
                </button>
                <button className="btn-transition font-sans text-[var(--color-link)] hover:underline text-sm"
                  onClick={login}>
                  Login →
                </button>
              </div>
            </div>

            {/* Right: 2x2 feature grid using local SVG icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12">
              {artistFeatures.map((f, i) => (
                <div key={i} className="flex flex-col gap-4">
                  {/* Icon (local SVG) */}
                  <img className="w-10 h-10 shrink-0"
                    src={f.icon}
                    alt=""
                    aria-hidden="true"/>
                  {/* Text */}
                  <div>
                    <h3 className="font-sans font-semibold text-heading">{f.title}</h3>
                    <p className="mt-1 font-sans text-sm text-body-text">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Collectors CTA */}
        <section className="py-12 md:py-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Right: 2x2 feature grid using local SVG icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12">
              {collectorFeatures.map((f, i) => (
                <div key={i} className="flex flex-col gap-4">
                  {/* Icon (local SVG) */}
                  <img className="w-10 h-10 shrink-0"
                    src={f.icon}
                    alt=""
                    aria-hidden="true"/>
                  {/* Text */}
                  <div>
                    <h3 className="font-sans font-semibold text-heading">{f.title}</h3>
                    <p className="mt-1 font-sans text-sm text-body-text">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Left: copy + buttons */}
            <div className="self-center">
              <h2 className="text-center font-serif text-heading text-2xl md:text-3xl">Collectors</h2>
              <p className="mt-3 font-sans text-body-text max-w-xl mx-auto text-center">
                ArtCert makes it possible for collectors to document their collection of artworks and validate the authenticity of new acquisitions.</p>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  style={{ borderRadius: 0 }}
                  onClick={handleCreateRegistry}
                  className="btn-transition font-sans rounded-xl px-5 py-3 text-sm font-semibold text-white
                             bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)]">
                  Create a registry
                </button>
                <button
                  style={{ borderRadius: 0 }}
                  onClick={handleBrowseMarketplace}
                  className="btn-transition font-sans rounded-xl px-5 py-3 text-sm font-semibold
                            bg-[var(--color-button-secondary)] hover:bg-[var(--color-button-secondary-hover)]
                            text-[var(--color-heading)]">
                  Browse artworks for sale
                </button>
              </div>
            </div>


          </div>
        </section>

        {/* Two banners (local assets) */}
        <section className="py-4">
          <div className="grid md:grid-cols-2 gap-2">
            <div className="overflow-hidden rounded-none">
              <img className="w-full h-72 md:h-[26rem] object-cover"
                src={banner1}
                alt="studio"
                loading="lazy"/>
            </div>
            <div className="overflow-hidden rounded-none">
              <img className="w-full h-72 md:h-[26rem] object-cover"
                src={banner2}
                alt="artist"
                loading="lazy"/>
            </div>
          </div>
        </section>

        {/* Sellers / Buyers copy */}
        <section className="py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-serif text-heading text-2xl">Sellers</h3>
              <p className="mt-3 font-sans text-body-text">
                When listing your works on the market, automatically include verifiable registration and authentication information. This will minimize transaction disputes and attract more suitable buyers.
              </p>
              <span className="font-sans text-s pt-4 font-medium text-[var(--color-link)] hover:underline cursor-pointer inline-flex items-center gap-1"
                onClick={handleSellerList}>
                List your art on the marketplace <FaArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <h3 className="font-serif text-heading text-2xl">Buyers</h3>
              <p className="mt-3 font-sans text-body-text">
                Through a verifiable registry and evidence chain, you can gain insights into a work's background and provenance, enabling confident purchases and rational pricing.{' '}
                <span className="font-sans text-s pt-4 font-medium text-[var(--color-link)] hover:underline cursor-pointer inline-flex items-center gap-1"
                  onClick={handleBrowseMarketplace}>
                  Browse the ArtCert marketplace <FaArrowRight className="w-3 h-3" />
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home

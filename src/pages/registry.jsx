import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { LoadingSpinner, RegistryCard } from '../components';
import { registryApi } from '../services/api';
import { useAuth } from '../contexts/authContext';
import { artworkMapper } from '../utils';

/**************************************************************************************************/

/**
 * @file        registry.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     17/08/2025
 * @license     -- tbd
 */

const Registry = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const handleAddArtworkButtonClicked = () => navigate('/registry/new');

  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      try {
        const data = await registryApi.list({ limit: 1000, offset: 0 });
        const mappedArtworks = data.map(art => artworkMapper(art));
        setArtworks(mappedArtworks);
      } catch (error) {
        console.error('Error loading artworks:', error);
      } finally {
        setLoading(false);
      }
    }

    loadArtworks();
  }, [user]);

  if (loading) {
    return (
      <LoadingSpinner loadingText='Artworks' />
    );
  }

  return (
    <>
      <div className='flex flex-col justify-center px-4 md:px-20 2xl:px-100 mb-10'>
        <h1 className='text-center font-serif text-heading py-20'>Registry</h1>
        <button className='bg-stone-100 flex items-center flex-col'
          style={{ borderRadius: '0', paddingTop: '2em', paddingBottom: '2em' }}
          onClick={handleAddArtworkButtonClicked}>
          <div className='flex items-center justify-center w-12 h-12 rounded-full bg-white mt-2'>
            <FaPlus className='w-7 h-7 text-heading' />
          </div>
          <span className='font-sans text-body-text text-xl my-2'>add an artwork</span>
        </button>
        <h2 className='text-center font-serif text-heading pt-10 pb-5 text-4xl'>My artworks</h2>
        <section className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-stretch'>
          {artworks.map((artwork, index) => (
            <RegistryCard key={index} artwork={artwork} />
          ))}
        </section>

      </div>
    </>
  )
}

export default Registry
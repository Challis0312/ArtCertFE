import React from 'react'
import { useNavigate } from 'react-router-dom';
import { TiEye } from "react-icons/ti";
import Unverified from '../assets/unverified.svg'
import Verified from '../assets/verified.svg'
import Listed from '../assets/listed.svg'
import Unlisted from '../assets/unlisted.svg'
import Authenticated from '../assets/authenticated.svg'
import Unauthenticated from '../assets/unauthenticated.svg'

/**************************************************************************************************/

/**
 * @file        registryCard.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     21/08/2025
 * @license     -- tbd
 */

const RegistryCard = ({ artwork }) => {
  const navigate = useNavigate();

  return (
    <article className='flex flex-col'>
      <div className='flex justify-center items-center h-60 border-1 border-b-0 border-stone-200 flex-grow p-2'>
        <img className='object-scale-down max-h-full' src={artwork.url} alt={artwork.title} />
      </div>
      <div className='px-2 py-2 flex flex-col gap-2 border-1 border-b-0 border-stone-200 flex-grow'>
        <div>
          <h2 className='text-2xl font-serif text-heading text-ellipsis whitespace-nowrap overflow-hidden'>
            {artwork.title}
          </h2>
          <h3 className='text-xl font-serif text-body-text text-ellipsis whitespace-nowrap overflow-hidden'>
            {artwork.authorFirstName} {artwork.authorLastName}
          </h3>
        </div>

        <div>
          <div className='flex items-center my-1.75 font-sans text-body-text'>
            <img src={artwork.verified ? Verified : Unverified} className='pr-2' />
            <span className='text-lg'>{artwork.verified ? 'Verified' : 'Unverified'}</span>
          </div>
          <div className='flex items-center my-1.75 font-sans text-body-text'>
            <img src={artwork.authenticated ? Authenticated : Unauthenticated} className='pr-2' />
            <span className='text-lg'>{artwork.authenticated ? 'Authenticated' : 'Unauthenticated'}</span>
          </div>
          <div className='flex items-center my-1.75 font-sans text-body-text'>
            <img src={artwork.publicRecord ? Listed : Unlisted} className='pr-2' />
            <span className='text-lg'>{artwork.publicRecord ? 'For sale' : 'Not for sale'}</span>
          </div>
        </div>

        <div>
          <button className='flex items-center font-sans bg-neutral-500 text-white my-1'
            style={{ borderRadius: '0', padding: '0.1em 0.2em' }}
            onClick={() => artwork.publicRecord ? navigate(`/marketplace/all/${artwork.id}`) : navigate(`/preview/${artwork.id}`)}>
            <TiEye className='pr-1.5' style={{ fontSize: '25px' }} />
            <span className='text-sm'>Preview listing</span>
          </button>
          <div className='flex flex-no-wrap overflow-hidden'>
            {artwork.tags.map((tag, index) => (
              <span key={index} className='inline-block mr-1 mb-1 bg-tag px-2 py-1 shrink-0
                                           font-sans text-sm text-body-text whitespace-nowrap'>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button className='text-center bg-button-primary hover:bg-button-primary-hover font-sans text-white'
        style={{ borderRadius: '0', width: '100%' }}
        onClick={() => navigate(`./${artwork.id}`, { state: { artwork } })}>
        Manage
      </button>

    </article >
  )
}

export default RegistryCard
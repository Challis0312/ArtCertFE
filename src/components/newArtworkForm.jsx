import React from 'react'
import paintingMediums from '../config/paintingMediumsConfig';

/**************************************************************************************************/

/**
 * @file        newArtworkForm.jsx
 * @description Form for adding a new artwork
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang, Faaez Ahmed Kamal]
 * @created     22/08/2025
 * @license     -- tbd
 */

const NewArtworkForm = ({ formData, setFormData, onFormDataChange }) => {
  const handleDimensionsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: parseInt(value)
      }
    }));
  }

  const handleDateOfProductionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      dateOfProduction: {
        ...prev.dateOfProduction,
        [name]: parseInt(value)
      }
    }));
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <input className="h-5 w-5 accent-slate-700"
          type="checkbox"
          id="isArtist"
          name="isArtist"
          onChange={onFormDataChange}/>
        <label className="font-serif text-lg leading-none cursor-pointer select-none" htmlFor="isArtist"> 
          I am the Artist
        </label>
      </div>
      
      <div className="flex flex-row gap-3">
        <div className="flex flex-col">
          <label htmlFor="artist" className="mb-1 font-serif text-xl">Artist First Name</label>
          <input className="border-b border-heading px-3 py-2 font-sans text-body-text"
            type="text"
            id="artistFirstName"
            name="artistFirstName"
            value={formData.artistFirstName}
            onChange={onFormDataChange}
            placeholder="Enter the artist's name"
            disabled={formData.isArtist}/>
        </div>
        <div className="flex flex-col">
          <label htmlFor="artist" className="mb-1 font-serif text-xl">Artist Last Name</label>
          <input className="border-b border-heading px-3 py-2 font-sans text-body-text"
            type="text"
            id="artistLastName"
            name="artistLastName"
            value={formData.artistLastName}
            onChange={onFormDataChange}
            placeholder="Enter the artist's name"
            disabled={formData.isArtist}/>
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="title" className="mb-1 font-serif text-xl">Artwork Title</label>
        <input className="border-b border-heading px-3 py-2 font-sans text-body-text"
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={onFormDataChange}
          placeholder="Enter the artwork's title"/>
      </div>

      <div className="flex flex-col">
        <label htmlFor="medium" className="mb-1 font-serif text-xl">Medium</label>
        <select className="w-48 border-b border-heading px-3 py-2 font-sans text-body-text"
          id="medium"
          name="medium"
          value={formData.medium}
          onChange={onFormDataChange}>
          <option value="None">None</option>
          {paintingMediums.map(medium => (
            <option key={medium} value={medium}>{medium}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <fieldset>
          <legend className='mb-1 font-serif text-xl'>Dimensions (in mm)</legend>
          <div className="flex gap-10">
            <div>
              <span className="self-center font-sans text-heading">Width: </span>
              <label htmlFor='width' className="sr-only">Width</label>
              <input className="w-24 border-b border-heading pl-3 py-2 font-sans text-body-text"
                type="number"
                id="width"
                name="width"
                value={formData.dimensions.width}
                onChange={handleDimensionsChange}/>
            </div>
            <div>
              <span className="self-center font-sans text-heading">Height:</span>
              <label htmlFor='height' className="sr-only">Height</label>
              <input className="w-24 border-b border-heading pl-3 py-2 font-sans text-body-text"
                type="number"
                id="height"
                name="height"
                value={formData.dimensions.height}
                onChange={handleDimensionsChange} />
            </div>
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col">
        <fieldset>
          <legend className='mb-1 font-serif text-xl'>Date of Production</legend>
          <div className="flex gap-10">
            <div>
            <span className="self-center font-sans text-heading">Year:</span>
            <label htmlFor='year' className="sr-only">Year</label>
            <input className="w-24 border-b border-heading pl-3 py-2 font-sans text-body-text"
              type="number"
              id="year"
              name="year"
              value={formData.dateOfProduction.year}
              onChange={handleDateOfProductionChange}/>
            </div>
            <div>
            <span className="self-center font-sans text-heading">Month:</span>
            <label htmlFor='month' className="sr-only">Month</label>
            <input className="w-20 border-b border-heading pl-3 py-2 font-sans text-body-text"
              type="number"
              id="month"
              name="month"
              value={formData.dateOfProduction.month}
              onChange={handleDateOfProductionChange}/>
          </div>
          <div>
            <span className="self-center font-sans text-heading">Day:</span>
            <label htmlFor='day' className="sr-only">Day</label>
            <input className="w-20 border-b border-heading pl-3 py-2 font-sans text-body-text"
              type="number"
              id="day"
              name="day"
              value={formData.dateOfProduction.day}
              onChange={handleDateOfProductionChange}/>
          </div>
          </div>
        </fieldset>
      </div>
    </>
  )
}

export default NewArtworkForm

import React, { useState } from 'react'
import DragDropFile from './dragDropFile';
import { RiCloseFill, RiSaveFill } from 'react-icons/ri';
import PropTypes from "prop-types";
import { useAuth } from '../contexts/authContext';
import paintingMediums from '../config/paintingMediumsConfig';

/**************************************************************************************************/

/**
 * @file        detailsForm.jsx
 * @description Form for adding a new artwork
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [David Relacion, Faaez Ahmed Kamal]
 * @created     27/08/2025
 * @license     -- tbd
 */

const DetailsForm = ({ artwork, formData, setFormData, onSave }) => {
  const [saving, setSaving] = useState(false);
  const [tag, setTag] = useState("");
  const { user } = useAuth();
  const disabled = artwork?.artistsId !== user?.sub || saving;

  // Handles the changing of different values
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  };

  const handleAddTag = () => {
    if (tag.trim() === "") return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTag("");
  };

  const handleRemoveTag = (index) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  // Validation to ensure required fields and numeric constraints
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredTitle = (formData?.title ?? '').toString().trim();
    const num = (v) => {
      if (v === null || v === undefined || v === '') return NaN;
      return Number(v);
    };

    const widthN = num(formData?.width);
    const heightN = num(formData?.height);
    const yearN = num(formData?.year);
    const monthN = num(formData?.month);
    const dayN = num(formData?.day);
    const hasAlphaInNumeric = (v) => typeof v === 'string' && v.trim() !== '' && isNaN(Number(v));

    const invalid =

      // empty checks
      requiredTitle.length === 0 || formData?.width === '' || formData?.height === '' ||
      formData?.year === '' || formData?.month === '' || formData?.day === '' ||

      // alphabetic characters in numeric fields
      hasAlphaInNumeric(formData?.width) || hasAlphaInNumeric(formData?.height) || hasAlphaInNumeric(formData?.year) ||
      hasAlphaInNumeric(formData?.month) || hasAlphaInNumeric(formData?.day) ||

      // negative or zero values
      !Number.isFinite(widthN) || widthN <= 0 || !Number.isFinite(heightN) || heightN <= 0 ||
      !Number.isFinite(yearN) || yearN <= 0 || !Number.isFinite(monthN) || monthN <= 0 || monthN > 12 ||
      !Number.isFinite(dayN) || dayN <= 0 || dayN > 31;

    if (invalid) {
      console.error('Validation failed for details form', { formData });
      return;
    }

    if (typeof onSave === "function") {
      try {
        setSaving(true);
        await onSave(formData);
      } catch (error) {
        console.error("Save failed:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <>
      <section className="w-full bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(18rem,1.5fr)_minmax(22rem,2fr)] gap-10 px-20">

          {/* Left sidebar */}
          <div className="justify-self-start items-start w-full">
            <h2 className="font-serif text-[4rem] text-slate-700">Details</h2>
            <p className="mt-3 text-slate-500">
              {disabled
                ? "Only the original artist can edit this artwork."
                : "Manage and edit the details for your artwork."}
            </p>
          </div>

          {/* Right column form */}
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="artist" className="font-serif text-[1.3rem]">
                Artist
              </label>
              <input className="min-w-0 w-full border-b border-heading px-3 py-2 font-sans disabled:text-body-text"
                type="text"
                id="artist"
                name="artist"
                value={formData?.artist || ""}
                onChange={onChange}
                disabled
                placeholder="Enter the artist's name" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="title" className="mb-1 font-serif text-[1.3rem]">
                Artwork Title
              </label>
              <input className="min-w-0 w-full border-b border-heading px-3 py-2 font-sans disabled:text-body-text"
                type="text"
                id="title"
                name="title"
                value={formData?.title || ""}
                onChange={onChange}
                disabled={disabled}
                placeholder="Enter the artwork's title" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="medium" className="mb-1 font-serif text-[1.3rem]">
                Medium
              </label>
              <select className="border-b border-heading px-3 py-2 font-sans text-body-text"
                id="medium"
                name="medium"
                value={formData.medium}
                onChange={onChange}
                disabled={disabled}>
                <option value="None">None</option>
                {paintingMediums.map((medium) => (
                  <option key={medium} value={medium}>
                    {medium}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <fieldset disabled={disabled}>
                <legend className="mb-1 font-serif text-[1.3rem]">
                  Dimensions
                </legend>
                <div className="flex gap-4">
                  <label htmlFor="width" className="sr-only font-serif">
                    Width
                  </label>
                  <input className="shrink basis-0 min-w-0 flex-1 border-b border-heading pl-3 py-2 font-sans disabled:text-body-text"
                    type="number"
                    id="width"
                    name="width"
                    value={formData?.width || ""}
                    onChange={onChange} />
                  <span className="self-center font-sans text-heading">
                    Width (mm)
                  </span>

                  <label htmlFor="height" className="sr-only font-serif">
                    Height
                  </label>
                  <input className="shrink basis-0 min-w-0 flex-1 border-b border-heading pl-3 py-2 font-sans disabled:text-body-text"
                    type="number"
                    id="height"
                    name="height"
                    value={formData?.height || ""}
                    onChange={onChange} />
                  <span className="self-center font-sans text-heading">
                    Height (mm)
                  </span>
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col">
              <fieldset disabled={disabled}>
                <legend className="mb-1 font-serif text-[1.3rem]">
                  Date of Production
                </legend>
                <div className="flex gap-4 flex-wrap">
                  <label htmlFor="year" className="sr-only">
                    Year
                  </label>
                  <span className="self-center font-sans text-heading">
                    Year:
                  </span>
                  <input className="w-20 border-b border-heading pl-3 py-2 font-sans disabled:text-body-text"
                    type="number"
                    id="year"
                    name="year"
                    value={formData?.year || ""}
                    onChange={onChange}
                    disabled={disabled} />

                  <label htmlFor="month" className="sr-only">
                    Month
                  </label>
                  <span className="self-center font-sans text-heading">
                    Month:
                  </span>
                  <input className="w-16 border-b border-heading pl-3 py-2 font-sans disabled:text-body-text"
                    type="number"
                    id="month"
                    name="month"
                    value={formData?.month || ""}
                    onChange={onChange}
                    disabled={disabled}
                    min="1"
                    max="12" />

                  <label htmlFor="day" className="sr-only">
                    Day
                  </label>
                  <span className="self-center font-sans text-heading">
                    Day:
                  </span>
                  <input className="w-16 border-b border-heading pl-3 py-2 font-sans disabled:text-body-text"
                    type="number"
                    id="day"
                    name="day"
                    value={formData?.day || ""}
                    onChange={onChange}
                    disabled={disabled}
                    min="1"
                    max="31" />
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="tag">Tags</label>
              {!disabled && (
                <div className="flex gap-2">
                  <input className="border-b border-heading px-3 py-2 font-sans"
                    type="text"
                    id="tag"
                    name="tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Add a tag" />
                  <button className="bg-button-primary text-white font-serif py-2 px-4"
                    type="button"
                    onClick={handleAddTag}
                    style={{ borderRadius: "0" }}>
                    Add
                  </button>
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((t, index) => (
                <div className="flex items-center gap-1 bg-stone-200 px-2" key={index}>
                  {!disabled && (
                    <RiCloseFill className="cursor-pointer"
                      onClick={() => handleRemoveTag(index)} />
                  )}
                  <span className="text-stone-800 font-sans text-sm py-1 px-2 rounded">
                    {t}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-serif text-[1.3rem]" htmlFor="description">
                Description
              </label>
              <textarea className="border border-heading px-3 py-2 font-sans disabled:text-body-text"
                id="description"
                name="description"
                rows={5}
                value={formData?.description || ""}
                onChange={onChange}
                disabled={disabled}
                placeholder="Enter a description of the artwork" />
            </div>

            {!disabled && (
              <DragDropFile
                text={"Upload a display photo for your artwork (JPEG or PNG)"}
                file={formData.file}
                setFormData={setFormData}
                formData={formData}
                id="file" />
            )}

            {!disabled && (
              <button className="bg-button-primary text-white font-serif flex items-center justify-center gap-2 w-full
                hover:bg-button-primary-hover transition-colors duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={disabled}
                style={{ borderRadius: "0" }}>
                <RiSaveFill className="text-xl" />
                <span className="text-lg">{saving ? "Saving..." : "Save"}</span>
              </button>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

export default DetailsForm

DetailsForm.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    artist: PropTypes.string,
    listed: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string),
    url: PropTypes.string,
    verified: PropTypes.bool,
  }),
  formData: PropTypes.shape({
    artist: PropTypes.string,
    title: PropTypes.string,
    medium: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    day: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    description: PropTypes.string,
  }),
  setFormData: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
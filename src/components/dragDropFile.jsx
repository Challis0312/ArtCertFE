import React, { useRef, useState } from 'react'
import { RiUploadCloud2Line } from 'react-icons/ri'
import isValidExtension from '../utils/isValidExtension';
import allowedExtensions from "../config/fileExtensionsConfig";

/**************************************************************************************************/

/**
 * @file        dragDropFile.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang, Jamila Tomines, Faaez Ahmed Kamal]
 * @created     22/08/2025
 * @license     -- tbd
 */

const DragDropFile = ({ text, file, setFormData, formData, id }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const accept = { file: 'image/*', rawFilePhoto: '.dng' };

  const uploadFile = (file) => {
    if (file && isValidExtension(file.name)) {
      // Always set using the provided id prop so the correct field is updated
      setFormData((prev) => ({ ...prev, [id]: file }));
    } else {
      alert(`Invalid file type. Please upload a file with one of the following extensions: 
        ${allowedExtensions.join(", ")}`);
    }
  };
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    uploadFile(file);
  }
  const handleOnDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleOnDragLeave = () => {
    setIsDragging(false);
  };
  const handleOnDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    uploadFile(file);
    setIsDragging(false);
  };

  const backgroundColor = isDragging ? 'bg-stone-200' : 'bg-stone-100';

  return (
    <div className='flex flex-col'>
      <label htmlFor='file' className='mb-1 font-serif text-lg'>
        {text ? `${text}` : ''}
      </label>
      
      {/* Preview other file type or DNG. DNG cannot be previewed */}
      {file && (
        <div className='flex flex-col gap-2 items-center'>
          {file.name.toLowerCase().endsWith('.dng') ? (
            <div className='w-32 h-32 bg-gray-200 flex items-center justify-center'>
              <span className='text-gray-500'>DNG Preview</span>
            </div>
          ) : (
            <img src={URL.createObjectURL(file)} alt='Preview' className='w-32 h-32 object-cover' />
          )}
          <p>File name: {file.name}</p>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>Type: {file.type || 'DNG Raw Image'}</p>
        </div>
      )}


      {/* Drag and drop area */}
      <div className={`flex flex-col gap-2 items-center py-6 ${backgroundColor}`}
        onDragOver={handleOnDragOver}
        onDragLeave={handleOnDragLeave}
        onDrop={handleOnDrop}>

        <RiUploadCloud2Line className='text-heading text-4xl' />
        <button className='bg-white font-serif text-heading hover:bg-button-secondary-hover'
          type='button'
          style={{ borderRadius: '0' }}
          onClick={handleUploadClick}>
          <span className='text-xl'>Choose file to upload</span>
        </button>
        <input className='hidden' type='file' id={id} name={id}
          accept={accept[id]}
          ref={fileInputRef}
          onChange={handleFileChange}/>
        <span className='font-sans text-md text-body-text'>
          or drag and drop them here
        </span>
      </div>

    </div>
  )
}

export default DragDropFile
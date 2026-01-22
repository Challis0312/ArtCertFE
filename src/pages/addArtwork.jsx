import React, { useEffect, useState } from 'react'
import { RiSaveFill, RiCloseFill } from 'react-icons/ri';
import { DragDropFile, LoadingSpinner, NewArtworkForm, Toggle, VerificationModal } from '../components'
import { isValidDimension, isValidDate, gzipWithCompressionStream } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { registryApi } from '../services/api';

/**************************************************************************************************/

/**
 * @file        addArtwork.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang, Jamila Tomines, Faaez Ahmed Kamal]
 * @created     21/08/2025
 * @license     -- tbd
 */

const UploadStatus = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  REJECTED: "REJECTED",
  ERROR: "ERROR"
};

const AddArtwork = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [tag, setTag] = useState('');
  const [formData, setFormData] = useState({
    artistFirstName: '',
    artistLastName: '',
    title: '',
    medium: 'None',
    dimensions: { width: 0, height: 0 },
    dateOfProduction: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
    description: '',
    importKey: '',
    file: null,
    rawFilePhoto: null,
    isArtist: false,
    tags: []
  })
  const [uploadStatus, setUploadStatus] = useState(UploadStatus.IDLE);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(formData)
  }, [formData]);

  const handleFormDataChange = (e) => {
    let { name, value } = e.target;
    let form = { ...formData };
    if (e.target.type === 'checkbox') {
      form[name] = e.target.checked;
      if (e.target.checked && user) {
        form['artistFirstName'] = user.given_name;
        form['artistLastName'] = user.family_name;
      } else if (!e.target.checked) {
        form['artistFirstName'] = '';
        form['artistLastName'] = '';
      }
    } else {
      form[name] = value;
    }
    setFormData(form);
  }

  const handleToggle = () => setIsToggled(!isToggled);
  const handleAddTag = () => {
    if (tag && !formData.tags.includes(tag.toLowerCase())) {
      setFormData({ ...formData, tags: [...formData.tags, tag.toLowerCase()] });
      setTag('');
    }
  };
  const handleRemoveTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };
  const handleSave = async (e) => {
    e.preventDefault();
    let dateOfProduction = formData.dateOfProduction;
    let dimensions = formData.dimensions;
    if (!isToggled &&
      !isValidDate(dateOfProduction.year, dateOfProduction.month, dateOfProduction.day)
    ) {
      alert('Invalid date of production: cannot be in the future or non-existent date');
      return;
    }

    if (!isToggled && (!isValidDimension(dimensions.width) || !isValidDimension(dimensions.height))) {
      alert('Invalid dimensions: only positive integers are allowed');
      return;
    }

    let canSave =
      isToggled ?
        [formData.importKey, formData.description, formData.file, formData.rawFilePhoto].every(Boolean) :
        [
          formData.artistFirstName,
          formData.artistLastName,
          formData.title,
          formData.medium !== 'None',
          formData.dimensions,
          formData.dateOfProduction,
          formData.description,
          formData.file,
          formData.rawFilePhoto,
          formData.tags.length > 0
        ].every(Boolean);

    if (!canSave) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Upload the artwork data to backend
    // Navigate to the artwork details page
    setUploadStatus(UploadStatus.PENDING);
    try {

      let requestForm = new FormData();
      requestForm.append("isArtist", formData.isArtist);
      requestForm.append("authorFirstName", formData.artistFirstName);
      requestForm.append("authorLastName", formData.artistLastName);
      requestForm.append("title", formData.title);
      requestForm.append("artMedium", formData.medium);
      requestForm.append("dimensions", `${formData.dimensions.width}x${formData.dimensions.height}`);
      requestForm.append("dateOfProduction", new Date(
        formData.dateOfProduction.year,
        formData.dateOfProduction.month - 1,
        formData.dateOfProduction.day).toISOString());
      requestForm.append("tags", JSON.stringify(formData.tags));
      requestForm.append("description", formData.description);
      requestForm.append("image", formData.file, formData.file.name);

      // Compress the DNG file using gzip worker
      let dngFile = formData.rawFilePhoto;
      const compressedBuf = await gzipWithCompressionStream(dngFile);
      const gzBlob = new Blob([compressedBuf], { type: 'application/gzip' });
      requestForm.append("dng", gzBlob, dngFile.name + '.gz');

      await registryApi.create(requestForm);
      setUploadStatus(UploadStatus.SUCCESS);
      setShowVerificationModal(true);
    }
    catch (error) {
      console.log('Error', error);
      setUploadStatus(UploadStatus.ERROR);
    } finally {
      navigate('/registry');
    }
  }

  const importForm = (
    <>
      <div className='flex flex-col'>
        <label htmlFor='importKey' className='mb-1 font-serif text-xl'>Import Key</label>
        <input className='border-b border-heading px-3 py-2 font-sans'
          type='text'
          id='importKey'
          name='importKey'
          value={formData.importKey}
          onChange={handleFormDataChange}
          placeholder='Enter your import key'/>
      </div>
    </>
  );

  return (
    <>
      <div className='flex flex-col justify-center px-4 md:px-20 2xl:px-130 mb-10'>
        <div className='flex flex-col items-stretch'>
          <h1 className='font-serif text-heading pt-20 pb-10'>Add a new artwork</h1>
          <div className='flex justify-between items-center bg-stone-100 py-6 px-8'>
            <div className='flex items-center gap-4'>
              <h2 className='text-center font-serif text-heading text-4xl text-nowrap mr-2'>Import Artwork</h2>
              <Toggle checked={isToggled} onToggle={handleToggle} />
            </div>
            <p className='inline-block font-sans text-heading text-s'>
              If you’ve have an existing offline artwork verification from ArtCert, you may<br />
              use your unique import key to import your artwork to your registry
            </p>
          </div>
          <div className='pt-20'>
            <h2 className='font-serif text-heading text-4xl mb-2'>Details</h2>
            <form encType="multipart/form-data" className='flex flex-col gap-4'>
              {
                isToggled ? importForm :
                  <NewArtworkForm
                    formData={formData}
                    setFormData={setFormData}
                    onFormDataChange={handleFormDataChange}
                  />
              }
              <div className='flex flex-col'>
                <label className='mb-1 font-serif text-xl'>Tags</label>
                <div className='flex gap-2'>
                  <input className='border-b border-heading px-3 py-2 font-sans'
                    type='text' id='tag' name='tag' value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder='Add a tag'/>
                  <button className='bg-button-primary text-white font-serif py-2 px-4'
                    type='button' 
                    onClick={handleAddTag}
                    style={{ borderRadius: '0' }}>
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {formData.tags.map((t, index) => (
                      <div key={index} className='flex items-center gap-1 bg-stone-200 px-2'>
                        <RiCloseFill className='cursor-pointer' onClick={() => handleRemoveTag(index)} />
                        <span className='text-stone-800 font-sans text-sm py-1 px-2 rounded'>
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='flex flex-col'>
                <label htmlFor='description' className='mb-1 font-serif text-xl'>Description</label>
                <textarea id='description' name='description' value={formData.description} rows={5}
                  onChange={handleFormDataChange}
                  className='border border-heading px-3 py-2 font-sans text-body-text'
                  placeholder='Enter a description of the artwork'
                />
              </div>
              <DragDropFile text={'Upload a display photo for your artwork (JPEG or PNG)'}
                file={formData.file} setFormData={setFormData} formData={formData} id='file' />
              <DragDropFile text={'Upload a RAW DNG photo of your artwork'}
                file={formData.rawFilePhoto} setFormData={setFormData} formData={formData} id='rawFilePhoto' />
              <div className='flex flex-col'>
              </div>
              <button className='bg-button-primary text-white font-serif py-2 px-4
                flex items-center justify-center gap-2'
                style={{ borderRadius: '0' }}
                onClick={handleSave}>
                <RiSaveFill className='text-xl' />
                <span className='text-lg'>Save</span>
              </button>
            </form>
          </div>
        </div>
      </div >
      {<VerificationModal
        isOpen={showVerificationModal}
        onClose={() => { navigate('/registry') }}
        onRetry={() => { setShowVerificationModal(false) }}
        status={uploadStatus}
      />}
      {uploadStatus === UploadStatus.PENDING && <LoadingSpinner loadingText={null} />}
    </>

  )
}

export default AddArtwork
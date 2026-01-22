import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { DragDropFile, ManageArtworkCard, ManageMarketplaceCard, DetailsForm, LoadingSpinner, DeleteArtwork } from '../components';
import { gzipWithCompressionStream } from '../utils';
import { registryApi, verificationApi } from "../services/api";

/**************************************************************************************************/

/**
 * @file        editArtwork.jsx
 * @description Shows artwork details
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [David Relacion, Faaez Ahmed Kamal, Jamila Tomines]
 * @created     27/08/2025
 * @license     -- tbd
 */


const EditArtwork = () => {
  const { artworkId } = useParams(); // Get artworkId from URL params
  const { state } = useLocation();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(state?.artwork || null);
  const [loading, setLoading] = useState(!artwork);
  const [requestVerification, setRequestVerification] = useState(false);
  const [formData, setFormData] = useState(
    {
      artist: artwork?.authorFirstName ? artwork?.authorFirstName + " " + artwork?.authorLastName : '',
      title: artwork?.title ?? '',
      medium: artwork?.artMedium ?? '',
      width: artwork?.dimensions?.width ?? '',
      height: artwork?.dimensions?.height ?? '',
      year: artwork?.dateOfProduction?.year ?? '',
      month: artwork?.dateOfProduction?.month ?? '',
      day: artwork?.dateOfProduction?.day ?? '',
      description: artwork?.description ?? '',
      tags: artwork?.tags ?? [],
      file: null, // File input starts as null
    }
  );
  const [verificationForm, setVerificationForm] = useState({
    rawFilePhoto: null, // RAW DNG file
  });
  const sectionRef = useRef(null);

  // Reset verification form each time the modal opens
  useEffect(() => {
    if (requestVerification) {
      setVerificationForm({ rawFilePhoto: null });
    }
  }, [requestVerification]);

  // Load artwork data using API
  useEffect(() => {
    const loadArtwork = async () => {
      // If we already have artwork data from route state and it matches the ID, use it
      if (artwork && artwork.id === artworkId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const artworkData = await registryApi.getById(artworkId);
        if (artworkData) setArtwork(artworkData);
      } catch (error) {
        console.error("Error loading artworks: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (artworkId) {
      loadArtwork();
    }
  }, [artworkId, artwork, navigate]);

  const handleCreateListing = () => {
    if (!artwork.verified) {
      alert("Artwork must be verified before listing in the marketplace.");
      return;
    }
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  // Handle the persistent saving
  const handleSave = async (formData) => {
    try {
      let requestForm = new FormData();
      requestForm.append("title", formData.title);
      if (formData.medium === 'None') {
        alert("Please select a valid medium");
        return;
      }
      requestForm.append("artMedium", formData.medium);
      requestForm.append("dimensions", `${formData.width}x${formData.height}`);
      requestForm.append("dateOfProduction", new Date(
        formData.year,
        formData.month - 1,
        formData.day).toISOString());
      requestForm.append("tags", JSON.stringify(formData.tags));
      requestForm.append("description", formData.description);

      if (formData.file) {
        requestForm.append("image", formData.file, formData.file.name);
      }
      await registryApi.updateById(artwork.id, requestForm);
    } catch (err) {
      console.error('Failed to save artwork:', err);
      // Handle error (show notification, etc.)
    } finally {
      navigate('/registry');
    }
  };

  const handleVerificationSubmit = async () => {
    const file = verificationForm.rawFilePhoto;
    if (!file) {
      alert("Please upload a RAW DNG file for verification.");
      return;
    }
    setRequestVerification(false);
    setLoading(true);
    try {

      let requestForm = new FormData();
      // Compress the DNG file using gzip worker
      const compressedBuf = await gzipWithCompressionStream(file);
      const gzBlob = new Blob([compressedBuf], { type: 'application/gzip' });
      requestForm.append("rawFile", gzBlob, file.name + '.gz');
      const verificationResponse = await verificationApi.request(artwork.id, requestForm);
      // Mark as pending verification locally so UI hides the request button
      setArtwork(prev => ({ ...prev, verificationPending: true }));
      alert(verificationResponse); // should adjust controller to return the full response object instead of just message
    } catch (err) {
      console.log('Error editing artwork ' + err);
      alert(verificationResponse + " For" + file.name + " Failed to submit verification request from frontend. Please try again."); // TODO: verificationResponse is undefined for DPDD here
    } finally {
      setLoading(false);
      navigate('/registry');
    }
  };

  if (loading) {
    return (
      <LoadingSpinner loadingText='Artwork' />
    );
  }

  return (
    <>
      {/* Keep components in the middle */}
      <div>
        <section className='max-w-10/12 mx-auto px-4'>

          {/* Artwork picture and action buttons */}
          <ManageArtworkCard
            artwork={artwork}
            onCreateListing={handleCreateListing}
            onSetRequestVerification={setRequestVerification}
          />

          {/* Details form */}
          <DetailsForm
            artwork={artwork}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
          />

          {/* List or delist in marketplace */}
          <ManageMarketplaceCard
            artwork={artwork}
            sectionRef={sectionRef}
          />

          {/* Delete from registry and marketplace */}
          <DeleteArtwork
            artwork={artwork}
          />
        </section>
      </div>
      {requestVerification &&
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-serif mb-4">Request Verification</h2>
            <p className="mb-4 font-sans text-body-text">
              Your artwork needs to be verified before it can be listed.
            </p>
            <DragDropFile
              text={'Upload a RAW DNG photo of your artwork'}
              file={verificationForm.rawFilePhoto}
              setFormData={setVerificationForm}
              formData={verificationForm}
              id='rawFilePhoto'
            />

            <div className="flex justify-end gap-4 mt-6">
              <button className="border-button-primary text-body-text bg-white font-sans px-4 py-2"
                style={{ borderRadius: '0', border: '1px solid' }}
                onClick={() => setRequestVerification(false)}>Close</button>
              <button
                className="bg-button-primary text-white font-sans px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: '0' }}
                onClick={handleVerificationSubmit}
                disabled={!verificationForm.rawFilePhoto}>
                Request Verification
              </button>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default EditArtwork;
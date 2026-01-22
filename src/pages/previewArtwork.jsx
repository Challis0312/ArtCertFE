import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { marketplaceApi, profileApi } from "../services/api";
import { artworkMapper, profileMapper } from "../utils";
import { ArtistSpotlight, ArtworkDetails, LoadingSpinner } from "../components";
import avatarPlaceholder from '../assets/avatar.png';

/**************************************************************************************************/

/**
 * @file        previewArtwork.jsx
 * @description -- tbd
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     05/10/2025
 * @license     -- tbd
 */

const PreviewArtwork = () => {
  const [artwork, setArtwork] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { artworkId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const artworkData = await marketplaceApi.getByArtworkId(artworkId);
        const mappedArtwork = artworkMapper(artworkData);
        setArtwork(mappedArtwork);

        if (mappedArtwork.artistsId !== null) {
          const artistData = await profileApi.get(mappedArtwork.artistsId);
          const mappedArtist = profileMapper(artistData);
          mappedArtist.name = `${mappedArtist.firstName} ${mappedArtist.lastName}`;
          mappedArtist.userId = mappedArtwork.artistsId;
          setArtist(mappedArtist);
        } else {
          console.warn("Artwork has no associated artist ID.");
          setArtist({
            name: mappedArtwork.authorFirstName + " " + mappedArtwork.authorLastName,
            image: mappedArtwork.authorProfileImage || avatarPlaceholder,
            bio: "More information about this artist is coming soon!"
          });
        }
      } catch (error) {
        console.error("Error fetching artwork or artist data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [artworkId]);

  // Restore body scroll if component unmounts with modal open
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return (
      <LoadingSpinner loadingText='Artwork' />
    );
  }

  return (
    <>
      <ArtworkDetails
        artwork={artwork}
        artist={artist}
        isModalOpen={isModalOpen}
        openModal={openModal}
        closeModal={closeModal} />      
      
      <ArtistSpotlight
        artist={artist}
        isRegistered={artwork?.artistsId !== null} />
    </>
  );
};

export default PreviewArtwork;

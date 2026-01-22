import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { marketplaceApi, offerApi, profileApi } from '../services/api';
import { artworkMapper, profileMapper } from "../utils";
import avatarPlaceholder from '../assets/avatar.png';
import { useAuth } from "../contexts/authContext";
import { ArtistSpotlight, ArtworkDetails, LoadingSpinner, PurchaseModal, OfferSentModal, OfferModal } from "../components";

// TODO: Currently doesn't work for collector's listings
// 

/**************************************************************************************************/

/**
 * @file        purchaseArtwork.jsx
 * @description -- tbd
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [David Relacion, Faaez Ahmed Kamal]
 * @created     15/09/2025
 * @license     -- tbd
 */

const PurchaseArtwork = () => {
  const [artwork, setArtwork] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  // ArtworkDetailCard state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // OfferBar states
  const [offerModalOpen, setOfferModalOpen] = useState(false);  // Offer modal
  const [purchaseOpen, setPurchaseOpen] = useState(false); // Purchase modal
  const [offerSentOpen, setOfferSentOpen] = useState(false); // Offer sent modal
  const [purchaseSentOpen, setPurchaseSentOpen] = useState(false); // Purchase sent modal

  const { user, login } = useAuth();
  const { artworkId } = useParams();

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

  // ArtworkDetailCard functions
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // OfferBar functions
  const purchaseSteps = [
    { label: 'Order received', state: 'filled' },
    { label: 'Payment confirmed', state: 'gray' },
    { label: 'Verification (Optional)', state: 'dashed' },
    { label: 'Purchase Complete', state: 'gray' },
  ];

  const onOffer = () => {
    if (!user) login();
    setOfferModalOpen(true);
  };
  const onPurchase = () => {
    if (!user) login();
    setPurchaseOpen(true);
  };

  const handleOfferConfirm = async ({ price }) => {
    if (artwork.ownerId === user?.sub) {
      alert("You cannot make an offer on your own artwork.");
      return;
    }
    try {
      // Call the API to create an offer
      await offerApi.create(artworkId, { amount: price });
    } catch (error) {
      console.error("Error creating offer:", error);
    } finally {
      setOfferModalOpen(false);       // close OfferModal
      setOfferSentOpen(true);         // open OfferSentModal
    }
  };

  const handlePurchaseConfirm = async () => {
    if (artwork.ownerId === user?.sub) {
      alert("You cannot make an offer on your own artwork.");
      return;
    }
    try {
      // Call the API to create an offer
      console.log("Offer submitted:", {
        artist: artwork?.artist,
        title: artwork?.title,
        offerPrice: artwork?.price
      });
      await offerApi.create(artworkId, { amount: artwork?.price });
    } catch (error) {
      console.error("Error creating offer:", error);
    } finally {
      setPurchaseOpen(false);
      setPurchaseSentOpen(true);
    }
  };

  if (loading || !artwork || !artist) {
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

      {/* OfferBar */}
      <section className="w-full bg-button-primary text-[var(--color-tag)] px-4 md:px-20 2xl:px-100">
        <div className="flex max-w-6xl flex-col items-center justify-between gap-6 py-8 sm:py-12 md:py-16 md:flex-row md:gap-10">
          {/* Price */}
          <div className="flex items-end gap-3">
            <div className="flex items-end gap-2">
              <span className="font-serif leading-none text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                {`$${artwork?.price.toLocaleString()}`}
              </span>
              <span className="font-sans mb-1 text-m tracking-widest text-[var(--color-tag)]">AUD</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
            <button className="w-full sm:w-48 md:w-60 bg-button-primary hover:bg-button-primary-hover font-sans text-white"
              style={{ borderRadius: 0, border: "1px solid" }}
              onClick={onOffer}>
              Make an offer
            </button>

            <span className="text-m text-[var(--color-tag)]">or</span>

            <button className="w-full sm:w-48 md:w-60 bg-button-secondary hover:bg-button-secondary-hover font-sans text-heading"
              style={{ borderRadius: 0 }}
              onClick={onPurchase}>
              Purchase
            </button>
          </div>
        </div>

        {/* Modals */}
        <OfferModal
          open={offerModalOpen}
          onClose={() => setOfferModalOpen(false)}
          artist={artist?.name}
          title={artwork?.title}
          price={artwork?.price}
          onConfirm={handleOfferConfirm}/>
        <PurchaseModal
          open={purchaseOpen}
          onClose={() => setPurchaseOpen(false)}
          artist={artist?.name}
          title={artwork?.title}
          price={artwork?.price}
          onConfirm={handlePurchaseConfirm}/>
        <OfferSentModal
          open={offerSentOpen}
          onClose={() => setOfferSentOpen(false)}  // "Okay" button and ✕ will call this
          artist={artist?.name}
          artworkTitle={artwork?.title}
          titleText="Offer Sent"/>
        <OfferSentModal
          open={purchaseSentOpen}
          onClose={() => setPurchaseSentOpen(false)}  // "Okay" button and ✕ will call this
          artist={artist?.name}
          artworkTitle={artwork?.title}
          titleText="Purchase Sent"
          steps={purchaseSteps}/>
      </section>
      
      <ArtistSpotlight
        artist={artist}
        isRegistered={artwork?.artistsId !== null} />
    </>
  );
};

export default PurchaseArtwork;

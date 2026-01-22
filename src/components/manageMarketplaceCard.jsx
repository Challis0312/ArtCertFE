import React, { useState } from "react";
import { FiChevronDown, FiArrowRight, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { RiCloseFill, RiSaveFill } from "react-icons/ri";
import { marketplaceApi } from "../services/api";
import { useNavigate } from "react-router-dom";

function ManageMarketplaceCard({ artwork, sectionRef }) {
  const navigate = useNavigate();

  const rows = [
    "Give your customers the confidence to buy",
    "Sell to anyone, anywhere in the world",
    "Minimise your overhead costs",
  ];

  // collapsible rows (intro view)
  const [open, setOpen] = useState([false, false, false]);
  const [createListing, setCreateListing] = useState(false);
  const toggle = (i) =>
    setOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  // listing form state (listed view)
  const [price, setPrice] = useState(artwork?.price || "");
  const [showModal, setShowModal] = useState(false);

  const onCreate = () => {
    if (!artwork.verified) {
      alert("Artwork must be verified before listing in the marketplace.");
      return;
    }
    setCreateListing(true);
  };
  const onRemove = async () => {
    try {
      await marketplaceApi.deleteById(artwork.id);
    } catch (error) {
      console.error("Failed to remove listing:", error);
      alert("Failed to remove listing. Please try again.");
    } finally {
      navigate('/registry');
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!price || isNaN(price) || Number(price) <= 0) {
      alert("Please enter a valid price greater than 0");
      return;
    }
    try {
      await marketplaceApi.updatePrice(artwork.id, Number(price));
      setShowModal(true);
    } catch (error) {
      console.error("Failed to update price:", error);
      alert("Failed to update price. Please try again.");
    }
  };

  const closeModal = () => {
    navigate(`/registry`);
    setShowModal(false);
  };
  return (
    <>
      <section ref={sectionRef} className="w-full bg-white py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-10 px-20 items-start justify-items-stretch">
          
          {/* Left column */}
          <aside className="justify-self-start items-start">
            <h2 className="font-serif text-[4rem] leading-none text-slate-700">
              Marketplace
            </h2>

            {!artwork?.publicRecord ? (
              <>
                <p className="mt-3 text-slate-500 max-w-prose">
                  List your art on the ArtCert marketplace and grow your audience.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 text-sky-700 hover:underline"
                  type="button"
                  style={{ padding: '0' }}>
                  Find out more <FiArrowRight />
                </button>
              </>
            ) : (
              <>
                <p className="mt-3 text-slate-600 max-w-prose">
                  Your artwork is currently visible on the ArtCert Marketplace.
                </p>

                <button className="mt-6 inline-flex items-center gap-2 border border-red-500 px-5 py-2 text-red-600 hover:bg-red-50"
                  type="button"
                  onClick={onRemove}
                  style={{ borderRadius: 0 }}>
                  <FiTrash2 />
                  Remove from marketplace
                </button>
              </>
            )}
          </aside>

          {/* Right column */}
          <div className="w-full">
            {!artwork?.publicRecord && !createListing ? (
              <>
                <div className="divide-y divide-emerald-900/30 border-t border-emerald-900/30">
                  {rows.map((label, i) => (
                    <div key={i} className="py-5">
                      <button className="w-full flex items-center justify-between text-left"
                        type="button"
                        aria-expanded={open[i]}
                        onClick={() => toggle(i)}
                        style={{ padding: 0 }}>
                        <span className="font-serif text-2xl text-emerald-900">
                          {label}
                        </span>
                        <FiChevronDown
                          className={`text-emerald-900 transition-transform border
                            w-6 h-6 p-1 rounded-full border-emerald-900${open[i] ? "rotate-180" : ""
                            }`}
                          aria-hidden="true"/>
                      </button>

                      <div
                        className={`mt-3 text-slate-600 ${open[i] ? "block" : "hidden"}`}>
                        <p>
                          Add a short blurb here explaining how this works for
                          sellers.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full bg-button-green text-white font-serif py-3
                  inline-flex items-center justify-center gap-2 hover:bg-button-green-hover btn-transition"
                  type="button"
                  onClick={onCreate}
                  style={{ borderRadius: 0 }}>
                  <FiPlusCircle className="text-xl" />
                  <span className="text-lg">Create Listing</span>
                </button>
              </>
            ) : (
              <form onSubmit={onSave} className="w-full">
                <h3 className="font-serif text-2xl text-slate-700 mb-6">
                  Your Marketplace Listing Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Asking price */}
                  <div>
                    <p className="text-slate-600 mb-3">Asking Price</p>
                    <div className="flex items-end gap-2">
                      <span className="font-serif text-5xl text-slate-600">$</span>
                      <input className="w-full border-b border-slate-400 bg-transparent 
                        font-sans text-3xl text-slate-600 focus:outline-none focus:border-slate-700 py-1"
                        type="text"
                        inputMode="decimal"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder=""/>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!artwork.publicRecord && <button
                    type="submit"
                    className="mt-8 w-full text-button-primary font-serif py-3
                             inline-flex items-center justify-center gap-2 border-2
                             border-button-primary transition-colors duration-500 ease-in-out"
                    style={{ borderRadius: 0, border: '2px solid' }}
                    onClick={() => setCreateListing(false)}>
                    <RiCloseFill className="text-xl" />
                    <span className="text-lg">Cancel</span>
                  </button>}

                  <button className="mt-8 w-full bg-button-primary text-white font-serif py-3 inline-flex items-center 
                    justify-center gap-2 hover:bg-button-primary-hover transition-colors duration-500 ease-in-out"
                    type="submit"
                    style={{ borderRadius: 0 }}>
                    <RiSaveFill className="text-xl" />
                    <span className="text-lg">Save</span>
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={closeModal}>
          </div>

          {/* Modal content */}
          <div className="relative z-10 bg-white p-8 shadow-2xl max-w-md w-full mx-4">
            
            {/* Close button */}
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={closeModal}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal body */}
            <div className="text-center">
              {/* Success icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="font-serif text-2xl text-slate-700 mb-2">
                Artwork price successfully updated to ${price.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageMarketplaceCard
import { useEffect } from "react";

/**************************************************************************************************/

/**
 * @file        offerModal.jsx
 * @description -- tbd
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [David Relacion, Faaez Ahmed Kamal]
 * @created     15/09/2025
 * @license     -- tbd
 */


const OfferModal = ({ open, onClose, artist, title, recommendedPrice, onConfirm }) => {
  if (!open) return null;

  // Keep only ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* dimmed backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />

      {/* modal card */}
      <div className="relative z-10 w-[90vw] max-w-lg bg-white border border-slate-200 shadow-2xl"
        role="dialog"
        aria-modal="true">

        {/* close (X) */}
        <button className="absolute right-3 top-3 p-1 text-slate-500 hover:text-slate-700"
          style={{ borderRadius: 0 }}
          aria-label="Close"
          onClick={onClose}>

          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form className="px-6 py-6"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const price = formData.get("price");
            onConfirm?.({ price });
          }}>
          <h2 className="mb-6 text-center font-serif text-base text-slate-700 sm:text-lg">
            Make an offer
          </h2>

          {/* Artist */}
          <label htmlFor="artist" className="block text-sm text-heading">Artist</label>
          <input id="artist" className="mb-4 mt-1 block w-full border-b border-slate-300 bg-transparent px-1 py-2 text-sm text-body-text outline-none"
            readOnly
            value={artist} />

          {/* Artwork Title */}
          <label htmlFor="artwork-title" className="block text-sm text-heading">Artwork Title</label>
          <input id="artwork-title" className="mb-4 mt-1 block w-full border-b border-slate-300 bg-transparent px-1 py-2 text-sm text-body-text outline-none"
            readOnly
            value={title} />

          {/* Price */}
          <label htmlFor="price" className="block text-lg text-heading">Price</label>
          <div className="mt-1 flex items-center gap-3">
            <span className="shrink-0 text-sm font-medium text-heading">AUD</span>
            <input id="price" className="w-full border-b border-slate-300 bg-transparent px-1 py-2 text-sm text-body-text outline-none placeholder:text-slate-400"
              name="price"
              type="number"
              defaultValue={recommendedPrice}
              step="100"
              placeholder="Please input your ideal price."
              required />
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between">
            <button className="min-w-[7rem] bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
              style={{ borderRadius: 0 }}
              type="submit">
              Confirm
            </button>
            <button className="min-w-[7rem] px-5 py-2 text-sm font-medium text-heading hover:text-body-text focus:outline-none focus:ring-2 focus:ring-slate-200"
              type="button"
              onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default OfferModal
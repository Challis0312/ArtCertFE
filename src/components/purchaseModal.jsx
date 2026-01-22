import { useEffect } from "react";

/**************************************************************************************************/

/**
 * @file        purchaseModal.jsx
 * @description -- tbd
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [David Relacion, Faaez Ahmed Kamal]
 * @created     15/09/2025
 * @license     -- tbd
 */

const PurchaseModal = ({ open, onClose, artist, title, price, onConfirm }) => {
  if (!open) return null;

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* backdrop (same as OfferModal) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />

      {/* modal card */}
      <div className="relative z-10 w-[90vw] max-w-lg bg-white border border-slate-200 shadow-2xl"
        role="dialog"
        aria-modal="true">
        
        {/* close (X) */}
        <button className="absolute right-3 top-3 p-1 text-slate-500 hover:text-heading"
          aria-label="Close"
          onClick={onClose}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 py-6">
          <h2 className="mb-4 text-center font-serif text-base text-heading sm:text-lg">
            Confirm Purchase
          </h2>

          <p className="text-sm text-body-text leading-relaxed text-center">
            Would you like to purchase <em>{title}</em> by <strong>{artist}</strong> for{" "}
            <strong>{price.toLocaleString()}</strong>?
          </p>

          <div className="mt-8 flex items-center justify-between">
            <button className="min-w-[9rem] bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
              style={{ borderRadius: 0 }}
              type="button"
              onClick={() => onConfirm?.()}>
              Confirm Purchase
            </button>
            <button className="min-w-[7rem] px-5 py-2 text-sm font-medium text-heading hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
              type="button"
              onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseModal

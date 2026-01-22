import React from 'react';
import PropTypes from 'prop-types';

/**************************************************************************************************/

/**
 * @file        offerSentModal.jsx
 * @description -- tbd
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [David Relacion, Faaez Ahmed Kamal]
 * @created     15/09/2025
 * @license     -- tbd
 */


/** 单个步骤的小圆点样式 */
function Dot({ state }) {
  if (state === 'filled') return <span className="w-4 h-4 rounded-full bg-[#1f5562]" />;
  if (state === 'dashed')
    return <span className="w-4 h-4 rounded-full border-2 border-dashed border-gray-400" />;
  return <span className="w-4 h-4 rounded-full bg-gray-300" />; // gray
}

function Step({ label, state = 'gray' }) {
  return (
    <div className="flex flex-col items-center w-[130px] text-center">
      <Dot state={state} />
      <span className="mt-2 text-sm text-body-text">{label}</span>
    </div>
  );
}

const Arrow = () => <span className="mx-2 text-2xl text-gray-400">›</span>;

/**
 * 可配置的“已发送”提示弹窗
 * - titleText：弹窗标题（默认 Offer Sent）
 * - steps：步骤数组，形如 [{label, state}]；state ∈ 'filled' | 'gray' | 'dashed'
 * - 若不传 steps，默认展示“Offer”流程
 */
const OfferSentModal = ({ open, onClose, artist, artworkTitle, titleText = 'Offer Sent', steps }) => {
  if (!open) return null;

  const defaultOfferSteps = [
    { label: 'Request received', state: 'filled' },
    { label: 'Offer Accepted', state: 'gray' },
    { label: 'Verification (Optional)', state: 'dashed' },
    { label: 'Purchase Complete', state: 'gray' },
  ];


  const toRender = Array.isArray(steps) && steps.length > 0 ? steps : defaultOfferSteps;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-sent-title"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white w-[92vw] max-w-[720px] p-8 md:p-10 shadow-lg"
        style={{ borderRadius: 0 }}
        onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
          onClick={onClose}>
          ×
        </button>

        <h2 className="text-3xl font-serif text-heading text-center" id="offer-sent-title">
          {titleText}
        </h2>

        <p className="text-center mt-6 text-lg text-body-text">
          Your request for <em>{artworkTitle}</em>
          <br /> by <em>{artist}</em> has been received.
        </p>

        {/* 步骤条 */}
        <div className="mt-8 flex items-center justify-center">
          {toRender.map((s, i) => (
            <React.Fragment key={i}>
              <Step label={s.label} state={s.state} />
              {i !== toRender.length - 1 && <Arrow />}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button className="bg-[#3E4358] text-white px-10 py-3 font-sans hover:opacity-90"
            style={{ borderRadius: 0 }}
            onClick={onClose}>
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfferSentModal;

OfferSentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  artist: PropTypes.string.isRequired,
  artworkTitle: PropTypes.string.isRequired,
  titleText: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      state: PropTypes.oneOf(['filled', 'gray', 'dashed']).isRequired,
    })
  ),
};
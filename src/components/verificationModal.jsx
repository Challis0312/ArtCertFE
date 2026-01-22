import React from 'react'
import Verified from '../assets/verified.svg'
import Unverified from '../assets/unverified.svg'

/**************************************************************************************************/

/**
 * @file        verificationModal.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Jamila Tomines]
 * @created     27/08/2025
 * @license     -- tbd
 */

const UploadStatus = {
    IDLE: "IDLE",
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    REJECTED: "REJECTED",
    ERROR: "ERROR"
};

const VerificationModal = ({ isOpen, onClose, onRetry, status }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}>
            <div className="bg-white p-8 rounded-3xl shadow-2xl relative max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
                    onClick={onClose}>
                    ×
                </button>
                {/* Badge */}
                <div className='flex justify-center my-1.75 font-sans text-body-text'>
                    <img src={status == UploadStatus.SUCCESS ? Verified : Unverified} className='pr-2' />
                </div>

                <h1 className="font-serif text-center pt-20 pb-10">
                    Upload {status == UploadStatus.SUCCESS ? "approved" : "failed"}
                </h1>
                <p className="text-center font-sans text-md text-body-text">
                    {status == UploadStatus.SUCCESS ? "Verifying your artwork as a collector or artist will give you a Digital Certificate of Verification or Authentication and will certify your painting is legitimate." : "Please re-upload a new DNG file and retry"}
                </p>

                <div className="text-center mb-8">
                    <a href="#"
                        className="text-blue-500 hover:text-blue-600 font-sans text-md">
                        Find out more →
                    </a>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    {status != UploadStatus.SUCCESS && <button
                        className="flex-1 py-3 px-6 border border-gray-300 rounded-md hover:bg-gray-50 font-sans text-md text-body-text"
                        onClick={() => {
                            console.log('User pressed Retry');
                            onRetry();
                        }}>
                        Retry
                    </button>}
                    <button className="flex-1 py-3 px-6 bg-slate-600 text-white rounded-md hover:bg-slate-700 font-sans text-md"
                        onClick={() => {
                            console.log('User pressed OK');
                            onClose();
                        }}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
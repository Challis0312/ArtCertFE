import React from 'react'

const LoadingSpinner = ({ loadingText }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
        {loadingText && ( <p className="mt-4 text-gray-600">Loading {loadingText}...</p> )}
      </div>
    </div>
  )
}

export default LoadingSpinner
import React from 'react'
import CreateSiteForm from '../forms/CreateSiteForm'

const SiteCreate = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      
      <div className="bg-white w-[80%] h-[90%] rounded-xl p-6">
        <button
          className="bg-sky-500 text-white font-bold px-10 py-3 rounded-lg float-end"
          onClick={onClose}>Close
        </button> 
        <CreateSiteForm />

      </div>
    </div>
  )
}

export default SiteCreate

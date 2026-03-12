import React from "react"

const VendorView = ({ vendor, onClose }) => {

  if (!vendor) return null

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

      <div className="bg-white w-[70%] rounded-2xl shadow-2xl p-8 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-3">
          Vendor Details
        </h2>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-3 text-lg">

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Vendor Name</p>
            <p className="font-semibold text-gray-800">{vendor.vendorName}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Vendor Contact Number</p>
            <p className="font-semibold text-gray-800">{vendor.vendorContactNumber}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Vendor Email</p>
            <p className="font-semibold text-gray-800">{vendor.vendorEmail}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Vendor Type</p>
            <p className="font-semibold text-gray-800">{vendor.vendorType}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Vendor Tag</p>
            <p className="font-semibold text-gray-800">{vendor.vendorTag}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">PAN</p>
            <p className="font-semibold text-gray-800">{vendor.pan}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">GST</p>
            <p className="font-semibold text-gray-800">{vendor.gst}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">MSME</p>
            <p className="font-semibold text-gray-800">{vendor.msme}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Status</p>
            <p className="font-semibold text-gray-800">{vendor.status}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Account Holder Name</p>
            <p className="font-semibold text-gray-800">{vendor.accountHolderName}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Account Number</p>
            <p className="font-semibold text-gray-800">{vendor.accountNumber}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">IFSC</p>
            <p className="font-semibold text-gray-800">{vendor.ifsc}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Bank Name</p>
            <p className="font-semibold text-gray-800">{vendor.bankName}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Location</p>
            <p className="font-semibold text-gray-800">{vendor.location}</p>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end mt-8 gap-4">

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Edit Vendor
          </button>

        </div>

      </div>
    </div>
  )
}

export default VendorView
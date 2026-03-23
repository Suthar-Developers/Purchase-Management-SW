import React, { useState } from "react"

const StatusBadge = ({ status }) => {

  const styles = {
    Active: "bg-green-100 text-green-700",
    Reject: "bg-red-100 text-red-700",
    Hold: "bg-yellow-100 text-yellow-700"
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

const PurchaseRequestList = ({ onCreate, data = [] }) => {

  return (
    <div className="w-full h-full bg-slate-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl h-full flex flex-col p-6">

        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-700">
            Purchase Requests
          </h1>

          <button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow">
            + New Request
          </button>
        </div>

        {/* Table Card */}
        <div className="flex-1 overflow-auto rounded-lg">

          <table className="w-full text-sm">

            <thead className="bg-[#4b5ea3] text-white">
              <tr>
                <th className="p-4 text-left">MR No</th>
                <th className="p-4 text-left">Material</th>
                <th className="p-4 text-left">Specification</th>
                <th className="p-4 text-left">Send To</th>
                <th className="p-4 text-left">Initiator</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-400">
                    No requests yet
                  </td>
                </tr>
              ) : (
                data.map((req, index) => (
                  <tr key={index}>
                    <td>MR-{index + 1}</td>
                    <td>{req.materials?.[0]?.material}</td>
                    <td>{req.materials?.[0]?.specification}</td>
                    <td>{req.sendTo}</td>
                    <td>{req.contactPerson}</td>
                    <td>Active</td>
                    <td>...</td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  )
}

export default PurchaseRequestList
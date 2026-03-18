import React from "react"

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

const PurchaseRequestList = ({ onCreate }) => {

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

            <tbody className="divide-y">

              <tr className="hover:bg-gray-50 transition border-b">
                <td className="p-4 font-medium">MR-001</td>
                <td className="p-4">Steel</td>
                <td className="p-4">Fe500</td>
                <td className="p-4">Pune Site</td>
                <td className="p-4">Admin</td>
                <td className="p-4"><StatusBadge status="Active" /></td>
                <td className="p-4 text-center space-x-2">
                  <button className="text-green-600 hover:underline">Active</button>
                  <button className="text-red-600 hover:underline">Reject</button>
                  <button className="text-yellow-600 hover:underline">Hold</button>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>
    </div>
  )
}

export default PurchaseRequestList
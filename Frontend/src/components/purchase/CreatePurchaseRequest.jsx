import React, { useState } from "react"
import AddMaterials from "./AddMaterials"

const CreatePurchaseRequest = ({ onBack }) => {

  const [materials, setMaterials] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="w-full h-full bg-slate-200 p-4">

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-2xl h-full flex flex-col">

        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-700">
            Create Purchase Request
          </h1>
        </div>

        {/* FORM */}
        <div className="px-6 py-4 grid grid-cols-4 gap-6">

          <div>
            <label className="text-sm text-gray-500">Project</label>
            <input className="input-line" placeholder="Select Project" />
          </div>

          <div>
            <label className="text-sm text-gray-500">Send To</label>
            <select className="input-line">
              <option>Head Office</option>
              <option>Factory</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Contact Person</label>
            <input className="input-line" />
          </div>

          <div>
            <label className="text-sm text-gray-500">Contact No./Email</label>
            <input className="input-line" />
          </div>

        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto rounded-lg">

          <table className="w-full text-sm">

            <thead className="bg-[#4b5ea3] text-white">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Material</th>
                <th className="p-3 text-left">Specification</th>
                <th className="p-3 text-left">Deliver Before</th>
                <th className="p-3 text-left">Make</th>
                <th className="p-3 text-left">Qty Required</th>
                <th className="p-3 text-left">Is NT Item</th>
                <th className="p-3 text-left">BOQ Ref No</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Attachment</th>
              </tr>
            </thead>

            <tbody>

              {materials.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-20 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      📦
                      <p>No materials added</p>
                      <p className="text-xs">
                        Click "Add Material" to start
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                materials.map((m, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{m.material}</td>
                    <td className="p-3">{m.specification}</td>
                    <td className="p-3">{m.deliveryDate}</td>
                    <td className="p-3">{m.make}</td>
                    <td className="p-3">{m.qty}</td>
                    <td className="p-3">{m.ntItem}</td>
                    <td className="p-3">{m.boq}</td>
                    <td className="p-3">{m.category}</td>
                    <td className="p-3">📎</td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        <div className="px-6 mb-25 py-4 border-t flex justify-between">

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#4b5ea3] text-white px-4 py-2 rounded"
          >
            Add Material
          </button>

          <div className="space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>

            <button
              onClick={onBack}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Back
            </button>
          </div>

        </div>

      </div>

      {/* MODAL */}
      {isModalOpen && (
        <AddMaterials
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            setMaterials([...materials, data])
            setIsModalOpen(false)
          }}
        />
      )}

    </div>
  )
}

export default CreatePurchaseRequest
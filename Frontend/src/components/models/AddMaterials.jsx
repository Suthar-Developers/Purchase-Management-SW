import React, { useState } from "react"
import Button from "../common/Button"

const AddMaterials = ({ onClose, onSave }) => {

  const [form, setForm] = useState({
    material: "",
    specification: "",
    make: "",
    size: "",
    thickness: "",
    qty: "",
    unit: "",
    isNtItem: "No",
    boqRef: "",
    scope: "Our Scope",
    category: "",
    deliverBefore: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white w-175 rounded-2xl shadow-lg">

        <div className="border-b px-5 py-5 font-semibold">
          Add Material
        </div>

        <div className="p-5 grid grid-cols-2 gap-4">

          <input name="material" placeholder="Material" className="input-line" onChange={handleChange} required/>
          <input name="specification" placeholder="Specification" className="input-line" onChange={handleChange}/>
          <input name="make" placeholder="Make" className="input-line" onChange={handleChange}/>
          <input name="size" placeholder="Size" className="input-line" onChange={handleChange} required/>
          <input name="thickness" placeholder="Thickness" className="input-line" onChange={handleChange}/>
          <input name="qty" placeholder="Qty Required" className="input-line" onChange={handleChange} required/>
          <input name="unit" placeholder="Unit" className="input-line" onChange={handleChange} required/>
          <div>
            <label className="text-xs text-blue-700 font-semibold" htmlFor="isNtItem">Is NT Item</label>
            <select className="input-line" name="isNtItem" onChange={handleChange} required>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <input name="boqRef" placeholder="Select BOQ Reference No" className="input-line" onChange={handleChange}/>
          <div>
            <label className="text-xs text-blue-700 font-semibold" htmlFor="scope">Scope</label>
            <select className="input-line" name="scope" onChange={handleChange} required>
              <option value="Our Scope">Our Scope</option>
              <option value="Client Scope">Client Scope</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-blue-700 font-semibold" htmlFor="category">Category</label>
            <select className="input-line" name="category" onChange={handleChange} required>
              <option>Select Category</option>
              <option value="Ply Board">Ply Board</option>
              <option value="Screw">Screw</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-blue-700 font-semibold" htmlFor="deliveryDate">Deliver Before</label>
            <input type="date" name="deliverBefore" className="input-line" onChange={handleChange}/>
          </div>

        </div>

        <div className="flex justify-end gap-3 p-4">
          <Button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 hover:cursor-pointer" lable={'Cancel'} />
          <Button onClick={handleSubmit} className='w-25 px-6 py-2 font-medium bg-blue-600 rounded-lg hover:bg-blue-700 hover:cursor-pointer text-white' lable={'Add'} />
        </div>

      </div>
    </div>
  )
}

export default AddMaterials
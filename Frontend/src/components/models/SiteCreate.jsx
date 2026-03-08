import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const SiteCreate = ({ isOpen, onClose, refreshSites }) => {
  if (!isOpen) return null

  const [formData, setFormData] = useState({
        siteName: "",
        siteCode: "",
        address: "",
        startDate: "",
        endDate: "",
        projectManager: "",
        contactNumber: "",
        clientName: "",
        status: "Planned",
        budget: "",
        description: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Site Data:", formData);

        try {
            const res = await axios.post(
                "http://localhost:3000/createSite", formData
            )

            alert(res.data.message);

            setFormData({
                siteName: "",
                siteCode: "",
                address: "",
                startDate: "",
                endDate: "",
                projectManager: "",
                contactNumber: "",
                clientName: "",
                status: "Planned",
                budget: "",
                description: ""
            })

            refreshSites()
            onClose()

        } catch(error){
            console.error(error)
            alert("Error while creating site")
        }
    };

    const inputStyle =
        "w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none";

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      
      <div className="bg-white w-[80%] h-[90%] rounded-xl p-6">
        <button
          className="bg-sky-500 text-white font-bold px-10 py-3 rounded-lg float-end"
          onClick={onClose}>Close
        </button> 
        
        <div>

            <div className="flex items-center justify-center p-4">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 space-y-6"
                >
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Create New Site
                    </h2>

                    {/* Grid Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="siteName"
                            placeholder="Site Name"
                            value={formData.siteName}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />

                        <input
                            type="text"
                            name="siteCode"
                            placeholder="Site Code"
                            value={formData.siteCode}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />

                        <input
                            type="text"
                            name="clientName"
                            placeholder="Client Name"
                            value={formData.clientName}
                            onChange={handleChange}
                            className={inputStyle}
                        />

                        <input
                            type="text"
                            name="projectManager"
                            placeholder="Project Manager"
                            value={formData.projectManager}
                            onChange={handleChange}
                            className={inputStyle}
                        />

                        <input
                            type="tel"
                            name="contactNumber"
                            placeholder="Contact Number"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className={inputStyle}
                        />

                        <input
                            type="number"
                            name="budget"
                            placeholder="Budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className={inputStyle}
                        />

                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className={inputStyle}
                        />

                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className={inputStyle}
                        />

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={inputStyle}
                        >
                            <option>Planned</option>
                            <option>Active</option>
                            <option>Completed</option>
                        </select>
                    </div>

                    {/* Address */}
                    <textarea
                        name="address"
                        placeholder="Site Address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`${inputStyle}`}
                    />

                    {/* Description */}
                    <textarea
                        name="description"
                        placeholder="Site Description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`${inputStyle}`}
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 transition"
                    >
                        Create Site
                    </button>
                </form>
            </div>

        </div>

      </div>
    </div>
  )
}

export default SiteCreate

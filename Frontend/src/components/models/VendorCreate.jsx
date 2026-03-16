import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const VendorCreate = ({ isOpen, onClose, refreshVendors }) => {
    if (!isOpen) return null

    const [formData, setFormData] = useState({
        vendorName: "",
        vendorContactNumber: "",
        vendorEmail: "",
        vendorType: "",
        clientTag: "",
        vendorPortal: "",
        pan: "",
        gst: "",
        msme: "",
        status: "Active",
        accountHolderName: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
        location: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Vendor Data:", formData);

        try {
            const res = await axios.post(
                "http://localhost:3000/api/createVendor", formData
            )

            alert(res.data.message);

            setFormData({
                vendorName: "",
                vendorContactNumber: "",
                vendorEmail: "",
                vendorType: "",
                clientTag: "",
                vendorPortal: "",
                pan: "",
                gst: "",
                msme: "",
                status: "Active",
                accountHolderName: "",
                accountNumber: "",
                ifsc: "",
                bankName: "",
                location: ""
            })

            refreshVendors()
            onClose()

        } catch (error) {
            console.error(error)
            alert("Error while creating vendors")
        }
    };

    const inputStyle =
        "w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

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
                                Create New Vendor
                            </h2>

                            {/* Grid Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    name="vendorName"
                                    placeholder="Vendor Name"
                                    value={formData.vendorName}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />

                                <input
                                    type="email"
                                    name="vendorEmail"
                                    placeholder="Vendor Email"
                                    value={formData.vendorEmail}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="tel"
                                    name="vendorContactNumber"
                                    placeholder="Vendor Contact Number"
                                    value={formData.vendorContactNumber}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="vendorPortal"
                                    placeholder="Vendor Portal"
                                    value={formData.vendorPortal}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="vendorType"
                                    placeholder="Vendor Type"
                                    value={formData.vendorType}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="vendorTag"
                                    placeholder="Vendor Tag"
                                    value={formData.vendorTag}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="pan"
                                    placeholder="PAN No."
                                    value={formData.pan}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="gst"
                                    value={formData.gst}
                                    placeholder='GST No.'
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="msme"
                                    value={formData.msme}
                                    placeholder='MSME'
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={inputStyle}
                                >
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>Order Not Premitted</option>
                                    <option>Black Listed</option>
                                </select>

                                <input
                                    type="text"
                                    name="accountHolderName"
                                    placeholder="Account Holder Name"
                                    value={formData.accountHolderName}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="accountNumber"
                                    placeholder="Account Number"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="ifsc"
                                    placeholder="IFSC"
                                    value={formData.ifsc}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="bankName"
                                    placeholder="Bank Name"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                            </div>

                            <textarea
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                                className={`${inputStyle}`}
                            />

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 transition"
                            >
                                Create Vendor
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default VendorCreate

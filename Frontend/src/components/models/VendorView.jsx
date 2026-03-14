import React, { useState, useEffect } from "react"
import axios from "axios"
import Button from "../common/Button"


/* Reusable Field Component */

const Field = ({ label, name, value, isEditing, handleChange, options }) => {

    const boxStyle = "bg-gray-100 p-4 rounded-lg"
    const inputStyle =
        "w-full border border-gray-300 rounded-lg px-2 py-1 mt-1"

    return (
        <div className={boxStyle}>

            <p className="text-gray-500 text-sm">{label}</p>

            {isEditing ? (

                options ? (

                    <select
                        name={name}
                        value={value || ""}
                        onChange={handleChange}
                        className={inputStyle}
                    >
                        {options.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>

                ) : (

                    <input
                        name={name}
                        value={value || ""}
                        onChange={handleChange}
                        className={inputStyle}
                    />

                )

            ) : (

                <p className="font-semibold text-gray-800">{value}</p>

            )}

        </div>
    )
}


const VendorView = ({ vendor, onClose, refreshVendors, startEditing }) => {

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})

   useEffect(() => {
    if (vendor) {
        setFormData(vendor)
        setIsEditing(startEditing)   // start edit mode if requested
    }
}, [vendor, startEditing])

    if (!vendor) return null

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async () => {

        try {

            const res = await axios.put(
                `http://localhost:3000/api/vendors/${formData.vendor_id}`,
                formData
            )

            alert(res.data.message || "Vendor updated successfully")
            await refreshVendors()
            setIsEditing(false)
            onClose()
        } catch (error) {
            console.error("Error updating vendor:", error);
            alert("Failed to update vendor");
        }
    }

    /* Field Configuration */

    const fields = [
        { label: "Vendor Name", name: "vendorName" },
        { label: "Vendor Contact Number", name: "vendorContactNumber" },
        { label: "Vendor Email", name: "vendorEmail" },
        { label: "Vendor Type", name: "vendorType" },
        { label: "Vendor Tag", name: "vendorTag" },
        { label: "PAN", name: "pan" },
        { label: "GST", name: "gst" },
        { label: "MSME", name: "msme" },
        { label: "Status", name: "status", options: ["Active", "Inactive", "Order Not Premitted", "Black Listed"] },
        { label: "Account Holder Name", name: "accountHolderName" },
        { label: "Account Number", name: "accountNumber" },
        { label: "IFSC", name: "ifsc" },
        { label: "Bank Name", name: "bankName" },
        { label: "Location", name: "location" }
    ]

    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

            <div className="bg-white w-[70%] rounded-2xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh]">

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

                {/* Fields Grid */}

                <div className="grid grid-cols-3 gap-3 text-lg">

                    {fields.map((field) => (

                        <Field
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            isEditing={isEditing}
                            handleChange={handleChange}
                            options={field.options}
                        />

                    ))}
                </div>

                {/* Buttons */}

                <div className="flex justify-end mt-8 gap-4">

                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Close
                    </button>

                    {isEditing ? (

                        <button
                            onClick={handleUpdate}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Save
                        </button>

                    ) : (

                        <Button lable='Edit Vendor' onClick={() => setIsEditing(true)} />

                    )}

                </div>
            </div>
        </div>

    )

}

export default VendorView
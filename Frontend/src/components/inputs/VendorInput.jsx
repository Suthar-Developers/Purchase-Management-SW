import React from 'react'

const VendorInput = ({ label, name, value, isEditing, handleChange }) => {
    const boxStyle = "bg-gray-100 p-4 rounded-lg"
    const inputStyle = "w-full border border-gray-300 rounded-lg px-2 py-1"
    return (
        <div className={boxStyle}>
            <p className="text-gray-500 text-sm">{label}</p>

            {isEditing ? (
                <input
                    name={name}
                    value={value || ""}
                    onChange={handleChange}
                    className={inputStyle}
                />
            ) : (
                <p className="font-semibold text-gray-800">{value}</p>
            )}

        </div>
    )
}

export default VendorInput

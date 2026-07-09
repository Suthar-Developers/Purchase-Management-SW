import React from 'react'

const Input = ({ label, placeholder, type = "text" }) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>

            <input
                type={type}
                placeholder={placeholder}
                className="w-full h-10 xl:h-12 rounded-xl border border-gray-300 px-5 outline-none focus:border-indigo-500 transition"
            />
        </div>
    )
}

export default Input

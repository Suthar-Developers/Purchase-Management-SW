import React from 'react'
import { Check } from "lucide-react";

const PasswordRule = ({ valid, text }) => {
    return (
        <div className="flex items-center gap-2">

            <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition
                            ${valid ? "bg-green-500 border-green-500" : "border-gray-300"}`}
            >
                {valid && (
                    <Check size={12} className="text-white" />
                )}
            </div>

            <span className={`text-sm ${valid ? "text-green-600" : "text-gray-500"}`}>{text}</span>

        </div>
    )
}

export default PasswordRule
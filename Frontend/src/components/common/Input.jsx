import React from "react";

const InputField = ({ label, placeholder, icon, rightText, name, value, onChange, type = "text" }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">{label}</label>

                {rightText && (
                    <span className="text-xs text-gray-400">{rightText}</span>
                )}
            </div>

            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full h-14 rounded-xl border border-gray-300 pl-12 pr-4 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-700 placeholder:text-gray-400"
                />
            </div>
        </div>
    );
};

export default InputField;
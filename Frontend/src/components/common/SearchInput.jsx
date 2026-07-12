import React from "react";

const SearchInput = ({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
    inputClassName = "",
}) => {
    return (
        <div className={className}>
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e)}
                placeholder={placeholder}
                className={`w-full rounded-lg px-4 py-2 bg-gray-100 text-black text-xs font-bold hover:bg-gray-200 outline-none ${inputClassName}`}
            />
        </div>
    );
};

export default SearchInput;
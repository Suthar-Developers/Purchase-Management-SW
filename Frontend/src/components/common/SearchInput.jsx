import React from "react";

const SearchInput = ({
    value,
    onChange,
    placeholder = "",
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
                className={`${inputClassName}`}
            />
        </div>
    );
};

export default SearchInput;

import React from "react";
import Button from "./Button";

const DownloadButton = ({
    onClick,
    title = "Download PDF",
    icon,
    className = "",
}) => {
    return (
        <Button
            onClick={onClick}
            title={title}
            aria-label={title}
            icon={
                icon || <i className="fa-solid fa-download"></i>
            }
            className={`grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:cursor-pointer ${className}`}
        />
    );
};

export default DownloadButton;
import React from 'react'

const Button = ({ lable, icon, key, type, loadingText, variant, className = "", onClick, loading = false, disabled }) => {

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-800 text-white",

    secondary:
      "bg-gray-100 hover:bg-gray-300 text-gray-800",

    success:
      "bg-green-600 hover:bg-green-800 text-white",

    danger:
      "bg-red-600 hover:bg-red-800 text-white",

    warning:
      "bg-yellow-500 hover:bg-yellow-700 text-white",

    outline:
      "border border-indigo-600 text-indigo-600 hover:bg-indigo-50 bg-white",
  };

  return (
    <div>
      <button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={`
                inline-flex
                items-center
                justify-center
                gap-2
                font-medium
                transition-all
                duration-300
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-400
                disabled:opacity-60
                disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
      >
        {loading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-100"
                fill="currentColor"
                d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
              />
            </svg>

            <span>{loadingText}</span>
          </>
        ) : (
          <>
            <span>{lable}</span>
            {icon}
          </>
        )}
      </button>
    </div>
  )
}

export default Button
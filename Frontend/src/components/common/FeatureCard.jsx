import React from 'react'

const FeatureCard = ({ title, desc }) => {
    return (
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">

                <svg
                    className="w-3 h-3 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>

            </div>

            <div>
                <h4 className="text-white font-semibold">
                    {title}
                </h4>

                <p className="text-gray-400 text-sm">
                    {desc}
                </p>
            </div>
        </div>
    )
}

export default FeatureCard

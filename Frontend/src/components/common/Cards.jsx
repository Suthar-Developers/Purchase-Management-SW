import React from 'react'

const toneClasses = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
}

// Dashboard KPI card used for live purchase/project/vendor counts.
const Cards = ({cardName, number, note, tone = 'slate'}) => {
    return (
        <div className='rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>
            <div className='flex items-start justify-between gap-4'>
                <div>
                    <h4 className='text-sm font-medium text-slate-500'>{cardName}</h4>
                    <h1 className='mt-3 text-3xl font-bold text-slate-950'>{number}</h1>
                    {note && <p className='mt-2 text-xs text-slate-500'>{note}</p>}
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-md text-sm font-bold ring-1 ${toneClasses[tone] || toneClasses.slate}`}>
                    {String(cardName).slice(0, 2).toUpperCase()}
                </div>
            </div>
        </div>
    )
}

export default Cards

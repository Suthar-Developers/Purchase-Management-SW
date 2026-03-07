import React from 'react'

const RecentItemsTable = () => {
  return (
    <div className='flex flex-col gap-3 w-full overflow-y-auto'>
      <div className='flex justify-around text-xl font-bold bg-slate-200 py-2'>
            <div className='w-1/4 text-center'>Item Name</div>
            <div className='w-1/4 text-center'>Category</div>
            <div className='w-1/4 text-center'>Location</div>
            <div className='w-1/4 text-center'>Qty</div>
            <div className='w-1/4 text-center'>Unit</div>
            <div className='w-1/4 text-center'>Amount</div>
      </div>

      <div className='flex justify-around text-lg'>
            <div className='w-1/4 text-center'>Green Ply</div>
            <div className='w-1/4 text-center'>Wood </div>
            <div className='w-1/4 text-center'>T2 Adani Airport AHMD</div>
            <div className='w-1/4 text-center'>50</div>
            <div className='w-1/4 text-center'>Pcs</div>
            <div className='w-1/4 text-center'>35,000</div>
      </div>

      <div className='flex justify-around text-lg'>
            <div className='w-1/4 text-center'>Fevicol </div>
            <div className='w-1/4 text-center'>Adhesive </div>
            <div className='w-1/4 text-center'>J Kumar</div>
            <div className='w-1/4 text-center'>100</div>
            <div className='w-1/4 text-center'>Kg</div>
            <div className='w-1/4 text-center'>35,000</div>
      </div>

      <div className='flex justify-around text-lg'>
            <div className='w-1/4 text-center'>Marine Ply</div>
            <div className='w-1/4 text-center'>Wood </div>
            <div className='w-1/4 text-center'>Reliance JWC</div>
            <div className='w-1/4 text-center'>100</div>
            <div className='w-1/4 text-center'>Pcs</div>
            <div className='w-1/4 text-center'>80,000</div>
      </div>

      <div className='flex justify-around text-lg'>
            <div className='w-1/4 text-center'>Fevicol </div>
            <div className='w-1/4 text-center'>Adhesive </div>
            <div className='w-1/4 text-center'>Palais Royale</div>
            <div className='w-1/4 text-center'>100</div>
            <div className='w-1/4 text-center'>Kg</div>
            <div className='w-1/4 text-center'>35,000</div>
      </div>
    </div>
  )
}

export default RecentItemsTable

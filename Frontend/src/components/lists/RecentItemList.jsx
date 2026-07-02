import React from 'react'
import RecentItemsTable from '../tables/RecentItemsTable'

const RecentItemList = ({ requests = [], isLoading = false }) => {
  return (
    <div className='min-w-0 rounded-md border border-slate-200 bg-white shadow-sm'>
      <div className='flex items-center justify-between border-b border-slate-200 px-5 py-4'>
        <div>
          <h2 className='text-base font-semibold text-slate-950'>Recent Request Items</h2>
          <p className='mt-1 text-xs text-slate-500'>Latest material rows loaded from purchase requests.</p>
        </div>
        <span className='rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700'>Live</span>
      </div>
      <RecentItemsTable requests={requests} isLoading={isLoading} />
    </div>
  )
}

export default RecentItemList

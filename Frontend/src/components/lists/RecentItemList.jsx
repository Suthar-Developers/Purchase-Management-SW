import React from 'react'
import RecentItemsTable from '../tables/RecentItemsTable'

const RecentItemList = () => {
  return (
    <div className='max-w-full bg-white m-5 rounded-2xl'>   
      <h1 className='text-2xl font-bold p-6'>Recently Purchased Items</h1>
      <div>
        <RecentItemsTable />
      </div>
    </div>
  )
}

export default RecentItemList

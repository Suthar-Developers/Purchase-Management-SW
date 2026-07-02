import React from 'react'
import RecentItemsTable from '../tables/RecentItemsTable'

const RecentItemList = () => {
  return (
    <div className='max-w-full h-[61vh] border bg-white m-5 rounded-2xl'>   
      <h1 className='text-lg text-white font-bold py-2 px-8 bg-cyan-700 rounded-t-2xl '>Recently Purchased Items</h1>
      <div>
        <RecentItemsTable />
      </div>
    </div>
  )
}

export default RecentItemList

import React from 'react'
import SiteTable from '../tables/SiteTable'

const SiteList = () => {
  return (
    <div className='max-w-full h-[80%] bg-white m-5 rounded-2xl overflow-auto'>
      <h1 className='text-2xl font-bold p-6'>All Sites</h1>
      <div className='text-center mb-5'>
        <input className='rounded-lg px-4 py-2 bg-gray-100 text-black text-lg font-bold hover:bg-gray-200 w-[98%]' type="search" name="siteSearch" placeholder='Search sites...' id="" />
      </div>
      <div>
        <SiteTable text='View' />
      </div>
    </div>
  )
}

export default SiteList

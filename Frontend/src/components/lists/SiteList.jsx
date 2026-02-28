import React from 'react'
import SiteTable from '../tables/SiteTable'

const SiteList = () => {
  return (
    <div className='max-w-full bg-white m-5 rounded-2xl'>   
      <h1 className='text-2xl font-bold p-6'>Sites</h1>
      <div>
        <SiteTable text='View' />
      </div>
    </div>
  )
}

export default SiteList

import React, { useState } from 'react'
import SiteTable from '../tables/SiteTable'
import Button from '../common/Button'
import SiteCreate from '../models/SiteCreate'

const SiteList = () => {
  const [isModelOpen, setIsModelOpen] = useState(false)

  const openModel = () => {
    setIsModelOpen(true)
  }
  const closeModel = () => {
    setIsModelOpen(false)
  }

  return (
    <div className='max-w-full h-[80%] bg-white m-5 rounded-2xl overflow-auto'>
      <h1 className='text-2xl font-bold p-6'>All Sites</h1>
      <div className='flex justify-around w-full px-15 text-center mb-5'>
        <input className='rounded-lg px-4 py-2 bg-gray-100 text-black text-lg font-bold hover:bg-gray-200 w-full mr-5' type="search" name="siteSearch" placeholder='Search sites...' id="" />
        <Button lable='Add' onClick={openModel} />
      </div>
      <div>
        <SiteTable view={<i className="fa-notdog fa-solid fa-eye mr-2"></i>} edit={<i className="fa-solid fa-pen-to-square ml-2"></i>} />
      </div>

      <div className='w-full h-full absolute top-auto left-auto'>
        <SiteCreate isOpen={isModelOpen} onClose={closeModel} />
      </div>
    </div>
  )
}

export default SiteList

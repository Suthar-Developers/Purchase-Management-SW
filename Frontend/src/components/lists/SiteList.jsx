import React, { useEffect, useState } from 'react'
import Button from '../common/Button'
import SiteCreate from '../models/SiteCreate'
import axios from 'axios'

const SiteList = () => {
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [sites, setSites] = useState([])

  const openModel = () => {
    setIsModelOpen(true)
  }
  const closeModel = () => {
    setIsModelOpen(false)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const fetchSites = async () => {
    try {
      const res = await axios.get('http://localhost:3000/sites')
      setSites(res.data)
    } catch (error) {
      console.error("Error fetching sites : ", error)
    }
  }

  useEffect(() => {
    fetchSites()
  }, [])

  return (
    <div className='max-w-full h-[80%] bg-white m-5 rounded-2xl overflow-auto'>
      <h1 className='text-2xl font-bold p-6'>All Sites</h1>
      <div className='flex justify-around w-full px-15 text-center mb-5'>
        <input className='rounded-lg px-4 py-2 bg-gray-100 text-black text-lg font-bold hover:bg-gray-200 w-full mr-5' type="search" name="siteSearch" placeholder='Search sites...' id="" />
        <Button lable='Add' onClick={openModel} />
      </div>

      <div className='flex flex-col gap-3 w-full overflow-auto'>
        <div className='flex justify-around text-xl font-bold bg-slate-200 py-3 mx-2'>
          <div className='w-1/12 text-center'>#</div>
          <div className='w-1/4 text-center'>Site Name</div>
          <div className='w-1/4 text-center'>Code</div>
          <div className='w-1/4 text-center'>Project Manager</div>
          <div className='w-1/4 text-center'>Start Date</div>
          <div className='w-1/4 text-center'>End Date</div>
          <div className='w-1/4 text-center'>Action</div>
        </div>

        {sites.map((site) => (
          <div key={site.id} className='flex justify-around items-center pb-2 text-lg border-b border-slate-300'>
            <div className='w-1/8 text-center'>{site.id}</div>
            <div className='w-1/4 text-center'>{site.siteName}</div>
            <div className='w-1/4 text-center'>{site.siteCode}</div>
            <div className='w-1/4 text-center'>{site.projectManager}</div>
            <div className='w-1/4 text-center'>{formatDate(site.startDate)}</div>
            <div className='w-1/4 text-center'>{formatDate(site.endDate)}</div>
            <div className='w-1/4 text-center'><a href="/"><i className="fa-notdog fa-solid fa-eye mr-2"></i> <i className="fa-solid fa-pen-to-square ml-2"></i></a></div>
          </div>
        ))}
      </div>

      <div className='w-full h-full absolute top-auto left-auto'>
        <SiteCreate isOpen={isModelOpen} onClose={closeModel} refreshSites={fetchSites} />
      </div>
    </div>
  )
}

export default SiteList

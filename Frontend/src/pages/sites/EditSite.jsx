import React from 'react'
import SiteNav from '../../components/mini-navbar/SiteNav'
import SiteTable from '../../components/tables/SiteTable'

const EditSite = () => {
    return (
        <div className='main-screen bg-slate-200 h-screen rounded-2xl overflow-y-auto'>
            <SiteNav />

            <div className='max-w-full h-[80%] bg-white m-5 rounded-2xl'>
                <h1 className='text-2xl font-bold p-6'>Sites</h1>
                <div className='text-center mb-5'>
                    <input className='rounded-lg px-4 py-2 bg-gray-100 text-black text-lg font-bold hover:bg-gray-200 w-[98%]' type="search" name="siteSearch" placeholder='Search sites...' id="" />
                </div>
                <div>
                    <SiteTable text='Edit' />
                </div>
            </div>
        </div >
    )
}

export default EditSite

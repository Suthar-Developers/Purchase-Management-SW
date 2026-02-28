import React from 'react'
import SiteNav from '../../components/mini-navbar/SiteNav'
import SiteList from '../../components/lists/SiteList'

const Sites = () => {
    return (
        <div className='main-screen w-full h-screen bg-slate-200 overflow-y-auto'>
            <h1 className='text-2xl font-bold mx-8 py-2 shadow-xl'>Sites</h1>

            <SiteNav />
            <SiteList />
        </div>
    )
}

export default Sites

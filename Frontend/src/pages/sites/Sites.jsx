import React from 'react'
import SiteNav from '../../components/mini-navbar/SiteNav'
import SiteList from '../../components/lists/SiteList'

const Sites = () => {
    return (
        <div className='main-screen w-full h-screen bg-slate-200 overflow-y-auto'>

            <SiteNav />
            <SiteList />
        </div>
    )
}

export default Sites

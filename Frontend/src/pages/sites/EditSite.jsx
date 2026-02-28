import React from 'react'
import SiteNav from '../../components/mini-navbar/SiteNav'
import SiteTable from '../../components/tables/SiteTable'

const EditSite = () => {
    return (
        <div className='main-screen bg-slate-200 h-screen rounded-2xl overflow-y-auto'>
            <h1 className='text-2xl font-bold mx-8 py-2 shadow-xl'>Edit Site</h1>
            <SiteNav />

            <div className='max-w-full bg-white m-5 rounded-2xl'>
                <h1 className='text-2xl font-bold p-6'>Sites</h1>
                <div>
                    <SiteTable text='Edit' />
                </div>
            </div>
        </div >
    )
}

export default EditSite

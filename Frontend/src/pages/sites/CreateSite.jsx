import React from 'react'
import SiteNav from '../../components/mini-navbar/SiteNav'
import CreateSiteForm from '../../components/forms/CreateSiteForm'

const CreateSite = () => {
  return (
    <div className='main-screen bg-slate-200 h-screen overflow-y-auto'>
            <h1 className='text-2xl font-bold mx-8 py-2 shadow-xl'>Add New Site</h1>
            <SiteNav />
            <CreateSiteForm />
    </div>
  )
}

export default CreateSite

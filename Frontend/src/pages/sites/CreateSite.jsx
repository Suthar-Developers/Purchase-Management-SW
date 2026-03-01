import React from 'react'
import SiteNav from '../../components/mini-navbar/SiteNav'
import CreateSiteForm from '../../components/forms/CreateSiteForm'

const CreateSite = () => {
  return (
    <div className='main-screen bg-slate-200 h-screen overflow-y-auto'>
            <SiteNav />
            <CreateSiteForm />
    </div>
  )
}

export default CreateSite

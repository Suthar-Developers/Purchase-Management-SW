import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import SideNav from './components/common/SideNav'
import Header from './components/common/Header'
import Sites from './pages/sites/Sites'
import SiteCreate from './components/models/SiteCreate'

const App = () => {
  return (
    <div className='flex overflow-hidden'>
      <SideNav />
      <div className='w-screen h-screen'>
        <Header />

        <div className='scroller w-full h-full overflow-y-auto'>

          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/all-sites' element={<Sites />} />
            <Route path='/create-site' element={<SiteCreate />} />
          </Routes>
        </div>
      </div>

    </div>
  )
}

export default App

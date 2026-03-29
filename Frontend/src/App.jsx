import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import SideNav from './components/common/SideNav'
import Header from './components/common/Header'
import Projects from './pages/project/Projects'
import ProjectCreate from './components/models/ProjectCreate'
import Footer from './components/common/Footer'
import Vendors from './pages/vendors/Vendors'
import VendorCreate from './components/models/VendorCreate'
import PurchaseRequests from './pages/purchase/PurchaseRequests'
import PurchaseOrders from './pages/purchase/PurchaseOrders'

const App = () => {
  return (
    <div className='flex overflow-hidden'>
      <SideNav />
      <div className='w-screen h-screen'>
        <Header />

        <div className='scroller w-full h-full overflow-y-auto'>

          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/create-project' element={<ProjectCreate />} />
            <Route path='/vendors' element={<Vendors />} />
            <Route path='/create-vendor' element={<VendorCreate />} />
            <Route path='/purchase-requests' element={<PurchaseRequests />} />
            <Route path='/purchase-orders' element={<PurchaseOrders />} />
          </Routes>
        </div>
      </div>

      <Footer />

    </div>
  )
}

export default App

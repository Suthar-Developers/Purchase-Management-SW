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
import PurchaseOrderRequests from './components/models/PurchaseOrderRequests'
import ApprovedPurchaseOrders from './components/models/ApprovedPurchaseOrders'
import Reports from './pages/reports/Reports'

const App = () => {
  return (
    <div className='flex h-screen overflow-hidden'>
      <SideNav />
      <div className='flex min-w-0 flex-1 flex-col h-screen overflow-hidden'>
        <Header />

        <div className='scroller min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden'>

          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/create-project' element={<ProjectCreate />} />
            <Route path='/vendors' element={<Vendors />} />
            <Route path='/create-vendor' element={<VendorCreate />} />
            <Route path='/purchase-requests' element={<PurchaseRequests />} />
            <Route path='/purchase-orders' element={<PurchaseOrders />} />
            <Route path='/purchase-orders/drafted-purchase-orders' element={<PurchaseOrderRequests />} />
            <Route path='/purchase-orders/approved-purchase-orders' element={<ApprovedPurchaseOrders />} />
            <Route path='/reports' element={<Reports />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default App

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import CreateUser from './pages/settings/users/CreateUser'
import Dashboard from './pages/dashboard/Dashboard'
import Projects from './pages/project/Projects'
import ProjectCreate from './components/models/ProjectCreate'
import Vendors from './pages/vendors/Vendors'
import VendorCreate from './components/models/VendorCreate'
import PurchaseRequests from './pages/purchase/PurchaseRequests'
import PurchaseOrders from './pages/purchase/PurchaseOrders'
import PurchaseOrderRequests from './components/models/PurchaseOrderRequests'
import ApprovedPurchaseOrders from './components/models/ApprovedPurchaseOrders'
import Reports from './pages/reports/Reports'

const App = () => {
  return (
    <div className='h-screen overflow-hidden'>

      <Routes>

        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/create-user" element={<CreateUser />} />
        </Route>

        {/* Main Application */}
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="create-project" element={<ProjectCreate />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="create-vendor" element={<VendorCreate />} />
          <Route path="purchase-requests" element={<PurchaseRequests />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route
            path="purchase-orders/drafted-purchase-orders"
            element={<PurchaseOrderRequests />}
          />
          <Route
            path="purchase-orders/approved-purchase-orders"
            element={<ApprovedPurchaseOrders />}
          />
          <Route path="reports" element={<Reports />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import CreateUser from './pages/settings/users/CreateUser'
import LoginUser from './pages/settings/users/LoginUser'
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
import Profile from './pages/settings/Profile'
import PermissionRoute from './components/auth/PermissionRoute'
import Unauthorized from './pages/errors/Unauthorized'
import Authorization from './pages/settings/Authorization'
import Sessions from './pages/settings/Sessions'
import AuditLogs from './pages/settings/AuditLogs'

const App = () => {
  return (
    <div className='h-screen overflow-hidden'>

      <Routes>

        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginUser />} />
        </Route>

        {/* Main Application */}
        <Route element={<ProtectedRoute />}>
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
            <Route path="profile" element={<Profile />} />
            <Route path="/create-user"
              element={
                <PermissionRoute permission="user.create">
                  <CreateUser />
                </PermissionRoute>
              }
            />
            <Route path="authorization" element={<PermissionRoute permission="role.view"><Authorization /></PermissionRoute>} />
            <Route path="sessions" element={<PermissionRoute permission="session.view"><Sessions /></PermissionRoute>} />
            <Route path="audit-logs" element={<PermissionRoute permission="audit_log.view"><AuditLogs /></PermissionRoute>} />

            <Route path="unauthorized" element={<Unauthorized />} />
          </Route>
        </Route>

      </Routes>
    </div>
  )
}

export default App

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import CreateUser from './pages/profile/users/CreateUser'
import LoginUser from './pages/profile/users/LoginUser'
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
import Analysis from './pages/reports/Analysis'
import Settings from './pages/settings/Settings'
import Materials from './pages/settings/materials/Materials'
import Categories from './pages/settings/materials/Categories'
import Units from './pages/settings/materials/Units'
import Profile from './pages/profile/Profile'
import RoleGuard from "./auth/RoleGuard";
import Unauthorized from "./pages/errors/Unauthorized";

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
            <Route index element={<RoleGuard permission={{ module: "dashboard", action: "view" }}><Dashboard /></RoleGuard>} />
            <Route path="projects" element={<RoleGuard permission={{ module: "projects", action: "view" }}><Projects /></RoleGuard>} />
            <Route path="create-project" element={<RoleGuard permission={{ module: "projects", action: "create" }}><ProjectCreate /></RoleGuard>} />
            <Route path="vendors" element={<RoleGuard permission={{ module: "vendors", action: "view" }}><Vendors /></RoleGuard>} />
            <Route path="create-vendor" element={<RoleGuard permission={{ module: "vendors", action: "create" }}><VendorCreate /></RoleGuard>} />
            <Route path="purchase-requests" element={<RoleGuard permission={{ module: "purchase_requests", action: "view" }}><PurchaseRequests /></RoleGuard>} />
            <Route path="purchase-orders" element={<RoleGuard permission={{ module: "purchase_orders", action: "create" }}><PurchaseOrders /></RoleGuard>} />
            <Route
              path="purchase-orders/drafted-purchase-orders"
              element={<RoleGuard permission={{ module: "purchase_orders", action: "view" }}><PurchaseOrderRequests /></RoleGuard>}
            />
            <Route
              path="purchase-orders/approved-purchase-orders"
              element={<RoleGuard permission={{ module: "purchase_orders", action: "view" }}><ApprovedPurchaseOrders /></RoleGuard>}
            />
            <Route path="reports" element={<RoleGuard permission={{ module: "reports", action: "view" }}><Reports /></RoleGuard>} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="settings" element={<Settings />} />
            <Route path="materials" element={<Materials />} />
            <Route path="material-categories" element={<Categories />} />
            <Route path="material-units" element={<Units />} />
            <Route path="profile" element={<Profile />} />
            
            <Route path="/create-user"
              element={
                <RoleGuard roles={["Admin"]}>
                  <CreateUser />
                </RoleGuard>
              }
            />

            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>
        </Route>

      </Routes>
    </div>
  )
}

export default App

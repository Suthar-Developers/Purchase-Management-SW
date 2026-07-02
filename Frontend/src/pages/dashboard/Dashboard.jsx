import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Cards from '../../components/common/Cards'
import RecentItemList from '../../components/lists/RecentItemList'
import { fetchPurchaseRequests } from '../../api/purchaseRequestApi'
import { fetchApprovedPurchaseOrders, fetchDraftedPurchaseOrders } from '../../api/purchaseOrderApi'
import { fetchProjects } from '../../api/projectApi'
import { fetchVendors } from '../../api/vendorApi'

const Dashboard = () => {
    const location = useLocation()
    const [dashboardData, setDashboardData] = useState({
        purchaseRequests: [],
        draftedOrders: [],
        approvedOrders: [],
        projects: [],
        vendors: [],
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [lastUpdated, setLastUpdated] = useState('')

    // Central dashboard refresh: checks backend connection and reloads all dashboard data.
    const refreshDashboard = useCallback(async () => {
        try {
            setIsLoading(true)
            setError('')

            const [purchaseRequests, draftedOrders, approvedOrders, projects, vendors] = await Promise.all([
                fetchPurchaseRequests(),
                fetchDraftedPurchaseOrders(),
                fetchApprovedPurchaseOrders(),
                fetchProjects(),
                fetchVendors(),
            ])

            setDashboardData({
                purchaseRequests: Array.isArray(purchaseRequests) ? purchaseRequests : [],
                draftedOrders: Array.isArray(draftedOrders) ? draftedOrders : [],
                approvedOrders: Array.isArray(approvedOrders) ? approvedOrders : [],
                projects: Array.isArray(projects) ? projects : [],
                vendors: Array.isArray(vendors) ? vendors : [],
            })
            setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        } catch (err) {
            console.error('Dashboard data load failed', err)
            setError('Unable to load dashboard data. Please confirm the backend server and database are running.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        refreshDashboard()
    }, [refreshDashboard, location.key])

    const stats = useMemo(() => {
        const { purchaseRequests, draftedOrders, approvedOrders, projects, vendors } = dashboardData
        const allMaterials = purchaseRequests.flatMap((request) => request.materials || [])
        const pendingMaterials = allMaterials.filter((item) => item.materialStatus !== 'Approved' && item.materialStatus !== 'Rejected')
        const approvedRequests = purchaseRequests.filter((request) => request.requestStatus === 'Approved' || request.requestStatus === 'Partially Approved')
        const pendingRequests = purchaseRequests.filter((request) => request.requestStatus === 'Pending')

        return [
            { label: 'Open PR', value: pendingRequests.length, note: 'Purchase requests waiting', tone: 'blue' },
            { label: 'Approved PR', value: approvedRequests.length, note: 'Ready for purchase order', tone: 'emerald' },
            { label: 'PO for Approval', value: draftedOrders.length, note: 'Draft purchase orders', tone: 'amber' },
            { label: 'Approved PO', value: approvedOrders.length, note: 'Released orders', tone: 'violet' },
            { label: 'Pending Items', value: pendingMaterials.length, note: 'Material decisions open', tone: 'rose' },
            { label: 'Masters', value: projects.length + vendors.length, note: `${projects.length} projects, ${vendors.length} vendors`, tone: 'slate' },
        ]
    }, [dashboardData])

    return (
        <main className='min-h-full bg-slate-50 px-5 py-5 lg:px-8'>
            <div className='mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-wide text-cyan-700'>Purchase command center</p>
                    <h1 className='mt-1 text-2xl font-bold text-slate-950'>Dashboard</h1>
                    <p className='mt-2 max-w-2xl text-sm text-slate-600'>Live overview from purchase requests, purchase orders, projects, and vendors.</p>
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                    <div className='flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm'>
                        <span className={`h-2.5 w-2.5 rounded-full ${error ? 'bg-rose-500' : isLoading ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                        {isLoading ? 'Refreshing data' : error ? 'Backend unavailable' : 'Backend connected'}
                        {lastUpdated && !isLoading && <span className='hidden border-l border-slate-200 pl-2 text-xs text-slate-400 sm:inline'>{lastUpdated}</span>}
                    </div>
                    <button type='button' onClick={refreshDashboard} disabled={isLoading} title='Refresh dashboard data' aria-label='Refresh dashboard data' className='grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'>
                        <i className={`fa-solid fa-rotate-right ${isLoading ? 'animate-spin' : ''}`}></i>
                    </button>
                </div>
            </div>

            {error && <div className='mb-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>{error}</div>}

            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {stats.map((stat) => <Cards key={stat.label} cardName={stat.label} number={isLoading ? '...' : stat.value} note={stat.note} tone={stat.tone} />)}
            </div>

            <div className='mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]'>
                <RecentItemList requests={dashboardData.purchaseRequests} isLoading={isLoading} />

                <aside className='rounded-md border border-slate-200 bg-white p-5 shadow-sm'>
                    <h2 className='text-base font-semibold text-slate-950'>Work Summary</h2>
                    <div className='mt-4 space-y-4'>
                        <div className='flex items-center justify-between border-b border-slate-100 pb-3'><span className='text-sm text-slate-600'>Total PR</span><strong className='text-sm text-slate-950'>{dashboardData.purchaseRequests.length}</strong></div>
                        <div className='flex items-center justify-between border-b border-slate-100 pb-3'><span className='text-sm text-slate-600'>Total PO</span><strong className='text-sm text-slate-950'>{dashboardData.draftedOrders.length + dashboardData.approvedOrders.length}</strong></div>
                        <div className='flex items-center justify-between border-b border-slate-100 pb-3'><span className='text-sm text-slate-600'>Active Projects</span><strong className='text-sm text-slate-950'>{dashboardData.projects.length}</strong></div>
                        <div className='flex items-center justify-between'><span className='text-sm text-slate-600'>Registered Vendors</span><strong className='text-sm text-slate-950'>{dashboardData.vendors.length}</strong></div>
                    </div>
                </aside>
            </div>
        </main>
    )
}

export default Dashboard

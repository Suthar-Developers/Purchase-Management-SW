import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SideNav = () => {
    const location = useLocation()
    const isPOActive = location.pathname.startsWith('/purchase-orders')

    // Initialize open state based on whether we are already viewing a PO path
    const [openPO, setOpenPO] = useState(isPOActive)

    // Helper to check active route
    const isActive = (path) => location.pathname === path

    // Smoothly close the dropdown when a different standalone route gets clicked
    useEffect(() => {
        if (!isPOActive) {
            setOpenPO(false)
        }
    }, [location.pathname, isPOActive])

    return (
        <aside className='flex h-screen w-20 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-2 py-4 text-slate-300 shadow-xl sm:w-64 sm:px-3'>
            <div className='mb-2 border-b border-slate-800 px-2 pb-2'>
                <h1 className='text-center text-sm font-bold text-white sm:text-left sm:text-lg tracking-wide uppercase'>JRC Interiors</h1>
                <p className='mt-1 hidden text-xs text-slate-400 sm:block'>Purchase workspace</p>
            </div>

            {/* Main Navigation items container */}
            <nav className='flex flex-1 flex-col overflow-y-auto'>
                <div className='space-y-2'>
                    {/* Dashboard */}
                    <Link
                        to='/'
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200 ${isActive('/') ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className={`grid h-7 w-7 place-items-center rounded ${isActive('/') ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-800 text-slate-300'}`}>
                            <i className="fa-solid fa-house text-xs"></i>
                        </span>
                        <span className='hidden truncate font-medium sm:inline'>Dashboard</span>
                    </Link>

                    {/* Projects */}
                    <Link
                        to='/projects'
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200 ${isActive('/projects') ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className={`grid h-7 w-7 place-items-center rounded ${isActive('/projects') ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-800 text-slate-300'}`}>
                            <i className="fa-regular fa-map text-xs"></i>
                        </span>
                        <span className='hidden truncate font-medium sm:inline'>Projects</span>
                    </Link>

                    {/* Vendors */}
                    <Link
                        to='/vendors'
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200 ${isActive('/vendors') ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className={`grid h-7 w-7 place-items-center rounded ${isActive('/vendors') ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-800 text-slate-300'}`}>
                            <i className="fa-solid fa-users-between-lines text-xs"></i>
                        </span>
                        <span className='hidden truncate font-medium sm:inline'>Vendors</span>
                    </Link>

                    {/* Purchase Requests */}
                    <Link
                        to='/purchase-requests'
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200 ${isActive('/purchase-requests') ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className={`grid h-7 w-7 place-items-center rounded ${isActive('/purchase-requests') ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-800 text-slate-300'}`}>
                            <i className="fa-solid fa-list-check text-xs"></i>
                        </span>
                        <span className='hidden truncate font-medium sm:inline'>Purchase Requests</span>
                    </Link>

                    {/* Collapsible Purchase Orders Dropdown Menu Block */}
                    <div className="space-y-1">
                        <button
                            type='button'
                            onClick={() => setOpenPO(!openPO)}
                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors duration-200 ${isPOActive ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <span className='flex min-w-0 items-center gap-3'>
                                <span className={`grid h-7 w-7 place-items-center rounded ${isPOActive ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-800 text-slate-300'}`}>
                                    <i className="fa-solid fa-check-to-slot text-xs"></i>
                                </span>
                                <span className='hidden truncate font-medium sm:inline'>Purchase Orders</span>
                            </span>
                            <span className={`hidden text-xs transition-transform duration-200 sm:inline ${openPO ? 'rotate-180' : ''}`}>
                                <i className="fa-solid fa-chevron-down"></i>
                            </span>
                        </button>

                        <div className={`space-y-1 overflow-hidden pl-0 transition-[max-height,opacity] duration-200 ease-in-out sm:pl-10 ${openPO ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <Link to='/purchase-orders'>
                                <div className={`rounded-md px-3 py-2 text-sm ${isActive('/purchase-orders') ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}>Create PO</div>
                            </Link>

                            <Link to='/purchase-orders/drafted-purchase-orders'>
                                <div className={`rounded-md px-3 py-2 text-sm ${isActive('/purchase-orders/drafted-purchase-orders') ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}>PO Requests</div>
                            </Link>

                            <Link to='/purchase-orders/approved-purchase-orders'>
                                <div className={`rounded-md px-3 py-2 text-sm ${isActive('/purchase-orders/approved-purchase-orders') ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}>Approved POs</div>
                            </Link>
                        </div>
                    </div>

                    {/* Reports */}
                    <Link
                        to='/reports'
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200 ${isActive('/reports') ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className={`grid h-7 w-7 place-items-center rounded ${isActive('/reports') ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-800 text-slate-300'}`}>
                            <i className="fa-solid fa-square-poll-vertical text-xs"></i>
                        </span>
                        <span className='hidden truncate font-medium sm:inline'>Reports</span>
                    </Link>

                    {/* Setting */}
                    <Link
                        to='/setting'
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200 ${isActive('/setting') ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className={`grid h-7 w-7 place-items-center rounded ${isActive('/setting') ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-800 text-slate-300'}`}>
                            <i className="fa-solid fa-gear text-xs"></i>
                        </span>
                        <span className='hidden truncate font-medium sm:inline'>Setting</span>
                    </Link>
                </div>
            </nav>

            {/* Bottom System Info Widget */}
            <div className='hidden rounded-md border border-slate-800 bg-slate-900 px-3 py-2 sm:block'>
                <p className='text-xs font-semibold text-white'>System status</p>
                <p className='mt-1 text-xs text-slate-400'>Data loads from the backend API.</p>
            </div>
        </aside>
    )
}

export default SideNav
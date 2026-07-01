import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navSections = [
    {
        items: [
            { path: '/', label: 'Dashboard', icon: 'DA' },
            { path: '/projects', label: 'Projects', icon: 'PR' },
            { path: '/vendors', label: 'Vendors', icon: 'VE' },
            { path: '/purchase-requests', label: 'Purchase Requests', icon: 'RQ' },
        ],
    },
    {
        title: 'Operations',
        items: [
            { path: '/reports', label: 'Reports', icon: 'RP' },
        ],
    },
]

const NavLinkItem = ({ path, label, icon, active }) => (
    <Link
        to={path}
        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
            active ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
    >
        <span className={`grid h-7 w-7 place-items-center rounded text-[10px] font-bold ${
            active ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-800 text-slate-300'
        }`}>
            {icon}
        </span>
        <span className='hidden truncate font-medium sm:inline'>{label}</span>
    </Link>
)

const SideNav = () => {
    const [openPO, setOpenPO] = useState(false)
    const location = useLocation()

    const isActive = (path) => location.pathname === path
    const isPOActive = location.pathname.startsWith('/purchase-orders')

    return (
        <aside className='flex h-screen w-20 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-2 py-4 text-slate-300 shadow-xl sm:w-64 sm:px-3'>
            <div className='mb-6 border-b border-slate-800 px-2 pb-5'>
                <h1 className='text-center text-sm font-bold text-white sm:text-left sm:text-lg'>JRC</h1>
                <p className='mt-1 hidden text-xs text-slate-400 sm:block'>Purchase workspace</p>
            </div>

            <nav className='flex flex-1 flex-col gap-5 overflow-y-auto'>
                {navSections.map((section, index) => (
                    <div key={section.title || index}>
                        {section.title && (
                            <p className='mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
                                {section.title}
                            </p>
                        )}
                        <div className='space-y-1'>
                            {section.items.map((item) => (
                                <NavLinkItem
                                    key={item.path}
                                    path={item.path}
                                    label={item.label}
                                    icon={item.icon}
                                    active={isActive(item.path)}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                <div>
                    <button
                        type='button'
                        onClick={() => setOpenPO(!openPO)}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition ${
                            isPOActive ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <span className='flex min-w-0 items-center gap-3'>
                            <span className={`grid h-7 w-7 place-items-center rounded text-[10px] font-bold ${
                                isPOActive ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-800 text-slate-300'
                            }`}>
                                PO
                            </span>
                            <span className='hidden truncate font-medium sm:inline'>Purchase Orders</span>
                        </span>
                        <span className={`hidden text-xs transition-transform sm:inline ${openPO || isPOActive ? 'rotate-180' : ''}`}>v</span>
                    </button>

                    <div className={`mt-1 space-y-1 overflow-hidden pl-0 transition-all duration-300 sm:pl-10 ${openPO || isPOActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <Link to='/purchase-orders'>
                            <div className={`rounded-md px-3 py-2 text-sm ${isActive('/purchase-orders') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>Create PO</div>
                        </Link>

                        <Link to='/purchase-orders/drafted-purchase-orders'>
                            <div className={`rounded-md px-3 py-2 text-sm ${isActive('/purchase-orders/drafted-purchase-orders') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>PO Requests</div>
                        </Link>

                        <Link to='/purchase-orders/approved-purchase-orders'>
                            <div className={`rounded-md px-3 py-2 text-sm ${isActive('/purchase-orders/approved-purchase-orders') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>Approved POs</div>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className='mt-5 hidden rounded-md border border-slate-800 bg-slate-900 p-3 sm:block'>
                <p className='text-xs font-semibold text-white'>System status</p>
                <p className='mt-1 text-xs text-slate-400'>Data loads from the backend API.</p>
            </div>
        </aside>
    )
}

export default SideNav

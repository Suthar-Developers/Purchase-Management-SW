import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SideNav = () => {

    const [openPO, setOpenPO] = useState(false)
    const location = useLocation()

    // helper to check active route
    const isActive = (path) => location.pathname === path

    return (
        <div className='flex flex-col items-center w-fit px-3 h-screen bg-slate-900 text-gray-300 shadow-r-xl'>
            <div className='py-5 w-full'>
                <h1 className='text-center text-2xl font-bold'>JRC INTERIORS</h1>
            </div>

            <div className='pb-4'>
                <Link to={'/'}>
                    <div className={`btn py-2.5 rounded w-3xs mb-3 ${isActive('/') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                        <button className='flex items-center gap-2 ml-2 text-left'>
                            <i className="fa-notdog fa-solid fa-house fa-lg"></i>
                            Dashboard
                        </button>
                    </div>
                </Link>

                <Link to={'/projects'}>
                    <div className={`btn py-2.5 rounded w-3xs mb-3 ${isActive('/projects') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                        <button className='flex items-center gap-2 ml-2 text-left'>
                            <i className="fa-regular fa-map fa-lg"></i>
                            Projects
                        </button>
                    </div>
                </Link>

                <Link to={'/vendors'}>
                    <div className={`btn py-2.5 rounded w-3xs mb-3 ${isActive('/vendors') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                        <button className='flex items-center gap-2 ml-2 text-left'>
                            <i className="fa-solid fa-users-between-lines fa-lg"></i>
                            Vendors
                        </button>
                    </div>
                </Link>
            </div >

            <div className='pb-4'>
                <Link to={'/purchase-requests'}>
                    <div className={`btn py-2.5 rounded w-3xs mb-3 ${isActive('/purchase-requests') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                        <button className='flex items-center gap-2 ml-2 text-left'>
                            <i className="fa-solid fa-list-check fa-lg"></i>
                            Purchase Requests
                        </button>
                    </div>
                </Link>

                <div onClick={() => setOpenPO(!openPO)} className="flex items-center justify-between cursor-pointer">
                    <div className='btn py-2.5 rounded w-3xs mb-1'>
                        <button className='flex items-center gap-2 ml-2 text-left'>
                            <i className="fa-solid fa-check-to-slot fa-lg"></i>
                            Purchase Orders
                            <i className={`fa-solid fa-chevron-down ml-4 transition-transform duration-300 ${openPO ? 'rotate-180' : ''}`}></i>
                        </button>
                    </div>
                </div>

                <div className={`flex flex-col gap-2 mb-4 text-sm overflow-hidden transition-all duration-300 ${openPO ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Link to="/purchase-orders">
                        <div className={`btn py-2 px-7 cursor-pointer hover:text-white ${isActive('/purchase-orders') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                            <span>Create PO</span>
                        </div>
                    </Link>

                    <Link to="/purchase-orders/drafted-purchase-orders">
                        <div className={`btn py-2 px-7 cursor-pointer hover:text-white ${isActive('/purchase-orders/po-requests') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                            <span>PO Requests</span>
                        </div>
                    </Link>

                    <Link to="/purchase-orders/po-approved">
                        <div className={`btn py-2 px-7 cursor-pointer hover:text-white ${isActive('/purchase-orders/po-approved') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                            <span>Approved POs</span>
                        </div>
                    </Link>
                </div>

                <div className={`btn py-2.5 rounded w-3xs mb-3 ${isActive('/good-receipt') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                    <button className='flex items-center gap-2 ml-2 text-left'>
                        <i className="fa-solid fa-receipt fa-lg"></i>
                        Good Receipt
                    </button>
                </div>
            </div>

            <div className='pb-4'>
                <div className={`btn py-2.5 rounded w-3xs mb-3 ${isActive('/stocks') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                    <button className='flex items-center gap-2 ml-2 text-left'>
                        <i className="fa-solid fa-cart-flatbed fa-lg"></i>
                        Stocks
                    </button>
                </div>

                <div className={`btn py-2.5 rounded w-3xs mb-3 ${isActive('/bills') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                    <button className='flex items-center gap-2 ml-2 text-left'>
                        <i className="fa-solid fa-file-invoice fa-lg"></i>
                        Bills
                    </button>
                </div>

                <div className={`btn py-2.5 rounded w-3xs mb-3 ${isActive('/reports') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                    <button className='flex items-center gap-2 ml-2 text-left'>
                        <i className="fa-solid fa-square-poll-vertical fa-lg"></i>
                        Reports
                    </button>
                </div>
            </div>

            <div>
                <div className={`btn py-2.5 rounded w-3xs mb-3 ${isActive('/setting') ? 'text-white font-semibold bg-gray-800' : ''}`}>
                    <button className='flex items-center gap-2 ml-2 text-left'>
                        <i className="fa-solid fa-gear fa-lg"></i>
                        Setting
                    </button>
                </div>
            </div>

        </div >
    )
}

export default SideNav

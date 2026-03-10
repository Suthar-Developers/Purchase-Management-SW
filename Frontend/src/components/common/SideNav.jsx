import React from 'react'
import NavButtons from './NavButtons'
import { Link } from 'react-router-dom'

const SideNav = () => {
    return (
        <div className='flex flex-col items-center w-fit px-3 h-screen bg-slate-900 text-gray-300 shadow-r-xl'>
            <div className='py-5 w-full'>
                <h1 className='text-center text-2xl font-bold'>JRC INTERIORS</h1>
            </div>

            <div className='pb-4 mb-3'>
                <Link to={'/'}>
                <NavButtons
                    icon={<i className="fa-notdog fa-solid fa-house fa-lg"></i>}
                    text="Dashboard"> </NavButtons>
                </Link>

                <Link to={'/projects'}>
                    <NavButtons
                        icon={<i className="fa-regular fa-map fa-lg"></i>}
                        text="Projects"> </NavButtons>
                </Link>

                <Link to={'/vendors'}>
                <NavButtons
                    icon={<i className="fa-solid fa-users-between-lines fa-lg"></i>}
                    text="Vendors"> </NavButtons>
                    </Link>
            </div>

            <div className='pb-4 mb-3'>
                <NavButtons
                    icon={<i className="fa-solid fa-list-check fa-lg"></i>}
                    text="Purchase Request"> </NavButtons>

                <NavButtons
                    icon={<i className="fa-solid fa-check-to-slot fa-lg"></i>}
                    text="Purchase Orders"> </NavButtons>

                <NavButtons
                    icon={<i className="fa-solid fa-receipt fa-lg"></i>}
                    text="Good Receipt"> </NavButtons>
            </div>

            <div className='pb-4 mb-3'>
                <NavButtons
                    icon={<i className="fa-solid fa-cart-flatbed fa-lg"></i>}
                    text="Stocks"> </NavButtons>

                <NavButtons
                    icon={<i className="fa-solid fa-file-invoice fa-lg"></i>}
                    text="Bills"> </NavButtons>

                <NavButtons
                    icon={<i className="fa-solid fa-square-poll-vertical fa-lg"></i>}
                    text="Reports"> </NavButtons>
            </div>

            <div>
                <NavButtons
                    icon={<i className="fa-solid fa-gear fa-lg"></i>}
                    text="Setting"> </NavButtons>
            </div>

        </div>
    )
}

export default SideNav

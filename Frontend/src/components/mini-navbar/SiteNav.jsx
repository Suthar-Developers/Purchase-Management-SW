import React from 'react'
import { Link } from 'react-router-dom'

const MiniNavbar = () => {
    return (
        <div className='flex mx-2 rounded-2xl bg-white '>
            <Link to={'/all-sites'}><button className='btn font-bold text-black rounded-2xl py-1 px-8 m-2'><h2 className='border-b'>All Sites</h2></button></Link>
            <Link to={'/create-site'}><button className='btn font-bold text-black rounded-2xl py-1 px-8 m-2'><h2 className='border-b'>Create Site</h2></button></Link>
            <Link to={'/edit-site'}><button className='btn font-bold text-black rounded-2xl py-1 px-8 m-2'><h2 className='border-b'>Edit Site</h2></button></Link>
        </div>
    )
}

export default MiniNavbar

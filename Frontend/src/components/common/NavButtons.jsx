import React from 'react'

const NavButtons = ({ icon, text }) => {
    return (
        <div className='btn py-3 rounded w-3xs mb-3'>
            <button className='flex items-center gap-2 ml-2 text-left'>
                {icon}
                {text}
            </button>
        </div>
    )
}

export default NavButtons

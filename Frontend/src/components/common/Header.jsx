import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between w-full h-min py-3 shadow-xl bg-white'>
        <div></div>
      <h1 className='text-3xl font-bold'>Purchase Management</h1>
      <div className='flex items-center gap-4 mr-5'>
        <div className='flex flex-col items-center'>
            <h3>Kamlesh Suthar</h3>
            <h5>Admin</h5>
        </div>
        <i className="fa-solid fa-circle-user fa-2xl"></i>
      </div>
    </div>
  )
}

export default Header

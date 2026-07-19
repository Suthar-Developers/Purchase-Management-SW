import React from 'react'
import { getDisplayName, getInitials, getStoredUser, formatRole } from '../../utils/userPreferences'

const Header = () => {
  const user = getStoredUser()
  const displayName = getDisplayName(user)
  const roleName = formatRole(user.role_id || user.role)

  return (
    <header className='z-10 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm lg:px-8'>
      <div>
        <h1 className='text-lg font-bold text-slate-950'>Purchase Management</h1>
        <p className='text-xs text-slate-500'>Projects, vendors, requests, and orders</p>
      </div>
      <div className='flex items-center gap-3'>
        <div className='hidden text-right sm:block'>
          <h3 className='text-sm font-semibold text-slate-900'>{displayName}</h3>
          <h5 className='text-xs text-slate-500'>{roleName}</h5>
        </div>
        <div className='grid h-10 w-10 place-items-center rounded-md bg-slate-900 text-sm font-bold text-white'>
          {getInitials(displayName)}
        </div>
      </div>
    </header>
  )
}

export default Header

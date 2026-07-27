import React, { useEffect, useMemo, useState } from 'react'
import { Bell, Check, Eye, LayoutDashboard, Moon, ShieldCheck, SlidersHorizontal, Sun, UserPlus, UserRound, UsersRound, X } from 'lucide-react'
import { getUsers } from '../../api/userApi'
import { applyStoredTheme, formatRole, getDisplayName, getStoredPreferences, getStoredUser, isAdminUser, saveStoredPreferences } from '../../utils/userPreferences'
import CreateUser from './users/CreateUser'

const ProfileToggle = ({ checked, label, note, icon: Icon, onChange }) => (
  <button
    type='button'
    onClick={() => onChange(!checked)}
    className='flex w-full items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-cyan-300 hover:bg-slate-50'
  >
    <span className='flex min-w-0 items-center gap-3'>
      <span className='grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700'>
        <Icon size={18} />
      </span>
      <span className='min-w-0'>
        <span className='block text-sm font-semibold text-slate-950'>{label}</span>
        <span className='block text-xs text-slate-500'>{note}</span>
      </span>
    </span>
    <span className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${checked ? 'bg-cyan-600' : 'bg-slate-300'}`}>
      <span className={`h-4 w-4 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : ''}`}></span>
    </span>
  </button>
)

const Profile = () => {
  const [preferences, setPreferences] = useState(getStoredPreferences)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showUsers, setShowUsers] = useState(false)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const user = useMemo(() => getStoredUser(), [])
  const displayName = getDisplayName(user)
  const roleName = formatRole(user.role_id || user.role)
  const isAdmin = isAdminUser(user)

  const updatePreference = (key, value) => {
    setPreferences((current) => saveStoredPreferences({ ...current, [key]: value }))
  }

  useEffect(() => {
    applyStoredTheme(preferences.theme)
  }, [preferences.theme])

  const openUsers = async () => {
    setShowUsers(true)
    await loadUsers()
  }

  const loadUsers = async () => {
    setUsersError('')
    setUsersLoading(true)

    try {
      setUsers(await getUsers())
    } catch (error) {
      setUsersError(error.message || 'Failed to load users')
    } finally {
      setUsersLoading(false)
    }
  }

  const formatDate = (value) => {
    if (!value) return 'Not available'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString()
  }

  const detailItems = [
    { label: 'Full name', value: displayName },
    { label: 'Username', value: user.username || 'Not available' },
    { label: 'Role', value: roleName },
  ]

  return (
    <main className='min-h-full bg-slate-50 px-5 py-5 lg:px-8'>
      <div className='mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-wide text-cyan-700'>Workspace profile</p>
          <h1 className='mt-1 text-2xl font-bold text-slate-950'>Profile</h1>
          <p className='mt-2 max-w-2xl text-sm text-slate-600'>
            Manage your profile, appearance, and day-to-day workspace preferences.
          </p>
        </div>

        {isAdmin && (
          <div className='flex flex-wrap gap-3'>
            <button
              type='button'
              onClick={openUsers}
              className='inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400'
            >
              <Eye size={18} />
              <span>Show Users</span>
            </button>
            <button
              type='button'
              onClick={() => setShowCreateUser(true)}
              className='inline-flex h-10 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400'
            >
              <UserPlus size={18} />
              <span>Create User</span>
            </button>
          </div>
        )}
      </div>

      <div className='grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]'>
        <section className='rounded-md border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-3'>
            <span className='grid h-10 w-10 place-items-center rounded-md bg-cyan-100 text-cyan-700'>
              <UserRound size={20} />
            </span>
            <div>
              <h2 className='text-base font-semibold text-slate-950'>Account Details</h2>
              <p className='text-xs text-slate-500'>Pulled from the logged-in session.</p>
            </div>
          </div>

          <div className='mt-5 space-y-3'>
            {detailItems.map((item) => (
              <div key={item.label} className='flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0'>
                <span className='text-sm text-slate-500'>{item.label}</span>
                <strong className='max-w-47.5 truncate text-right text-sm font-semibold text-slate-950'>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className='space-y-5'>
          <div className='rounded-md border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='flex items-center gap-3'>
              <span className='grid h-10 w-10 place-items-center rounded-md bg-slate-100 text-slate-700'>
                <SlidersHorizontal size={20} />
              </span>
              <div>
                <h2 className='text-base font-semibold text-slate-950'>Appearance</h2>
                <p className='text-xs text-slate-500'>Choose the look that fits your workspace.</p>
              </div>
            </div>

            <div className='mt-5 grid gap-3 sm:grid-cols-2'>
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
              ].map((option) => {
                const Icon = option.icon
                const active = preferences.theme === option.value

                return (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => updatePreference('theme', option.value)}
                    className={`flex items-center justify-between rounded-md border px-4 py-3 text-left transition ${active ? 'border-cyan-500 bg-cyan-50 text-cyan-800' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300'}`}
                  >
                    <span className='flex items-center gap-3'>
                      <Icon size={18} />
                      <span className='text-sm font-semibold'>{option.label}</span>
                    </span>
                    {active && <Check size={18} />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className='grid gap-3 md:grid-cols-2'>
            <ProfileToggle
              checked={preferences.density === 'compact'}
              label='Compact workspace'
              note='Tighter spacing for tables and busy screens.'
              icon={LayoutDashboard}
              onChange={(checked) => updatePreference('density', checked ? 'compact' : 'comfortable')}
            />
            <ProfileToggle
              checked={preferences.notifications}
              label='Activity notifications'
              note='Keep purchase activity alerts enabled.'
              icon={Bell}
              onChange={(checked) => updatePreference('notifications', checked)}
            />
            <ProfileToggle
              checked={preferences.reduceMotion}
              label='Reduce motion'
              note='Use calmer transitions where possible.'
              icon={ShieldCheck}
              onChange={(checked) => updatePreference('reduceMotion', checked)}
            />
          </div>
        </section>
      </div>

      {isAdmin && showCreateUser && (
        <CreateUser
          isModal
          onClose={() => setShowCreateUser(false)}
          onCreated={() => {
            if (showUsers) loadUsers()
          }}
        />
      )}

      {isAdmin && showUsers && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6'>
          <section className='max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-md bg-white shadow-xl'>
            <div className='flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4'>
              <div className='flex items-center gap-3'>
                <span className='grid h-10 w-10 place-items-center rounded-md bg-cyan-100 text-cyan-700'>
                  <UsersRound size={20} />
                </span>
                <div>
                  <h2 className='text-base font-semibold text-slate-950'>All Users</h2>
                  <p className='text-xs text-slate-500'>Admin-only user list. Passwords are encrypted and hidden.</p>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setShowUsers(false)}
                aria-label='Close users'
                className='grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900'
              >
                <X size={18} />
              </button>
            </div>

            <div className='max-h-[calc(88vh-81px)] overflow-auto p-5'>
              {usersLoading && <p className='text-sm text-slate-600'>Loading users...</p>}
              {usersError && <p className='rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>{usersError}</p>}
              {!usersLoading && !usersError && (
                <div className='overflow-hidden rounded-md border border-slate-200'>
                  <table className='min-w-full divide-y divide-slate-200 text-left text-sm'>
                    <thead className='bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500'>
                      <tr>
                        <th className='px-4 py-3'>Name</th>
                        <th className='px-4 py-3'>Username</th>
                        <th className='px-4 py-3'>Password</th>
                        <th className='px-4 py-3'>Role</th>
                        <th className='px-4 py-3'>Status</th>
                        <th className='px-4 py-3'>Created</th>
                        <th className='px-4 py-3'>Updated</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100 bg-white'>
                      {users.length === 0 && (
                        <tr>
                          <td className='px-4 py-6 text-center text-slate-500' colSpan='7'>No users found.</td>
                        </tr>
                      )}
                      {users.map((item) => (
                        <tr key={item.id} className='hover:bg-slate-50'>
                          <td className='px-4 py-3 font-medium text-slate-950'>
                            <span className='block'>{item.fullName || 'Not available'}</span>
                            <span className='text-xs font-normal text-slate-500'>ID: {item.id}</span>
                          </td>
                          <td className='px-4 py-3 text-slate-700'>{item.username || 'Not available'}</td>
                          <td className='px-4 py-3 text-slate-500'>Encrypted / hidden</td>
                          <td className='px-4 py-3 text-slate-700'>{formatRole(item.role)}</td>
                          <td className='px-4 py-3 text-slate-700'>{item.status || 'Active'}</td>
                          <td className='px-4 py-3 text-slate-700'>{formatDate(item.createdAt)}</td>
                          <td className='px-4 py-3 text-slate-700'>{formatDate(item.updatedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default Profile

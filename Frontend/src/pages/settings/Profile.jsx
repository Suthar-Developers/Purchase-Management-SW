import React, { useEffect, useState } from 'react'
import { Bell, Check, LayoutDashboard, Moon, ShieldCheck, SlidersHorizontal, Sun, Trash2, UserPlus, UserRound, Users, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { applyStoredTheme, getStoredPreferences, saveStoredPreferences } from '../../utils/userPreferences'
import useAuth from "../../hooks/useAuth";
import CreateUser from './users/CreateUser'
import { deleteUser, getAllUsers } from '../../api/userApi'
import { getRoleLabel, isRoleAllowed } from '../../utils/roles'

const ProfileToggle = ({ checked, label, note, icon, onChange }) => (
  <button
    type='button'
    onClick={() => onChange(!checked)}
    className='flex w-full items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-cyan-300 hover:bg-slate-50'
  >
    <span className='flex min-w-0 items-center gap-3'>
      <span className='grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700'>
        {icon}
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
  const [deletingUserId, setDeletingUserId] = useState(null)

  const { user } = useAuth();
  const roleName = user?.role_id || "";
  const isAdmin = isRoleAllowed(roleName, ["Admin"]);
  const currentUserId = user?.user_id || user?.id;

  const updatePreference = (key, value) => {
    setPreferences((current) => saveStoredPreferences({ ...current, [key]: value }))
  }

  useEffect(() => {
    applyStoredTheme(preferences.theme)
  }, [preferences.theme])

  const loadUsers = async () => {
    try {
      setUsersLoading(true)
      const response = await getAllUsers()

      // Store the latest user rows returned from the protected admin API.
      setUsers(response.users || [])
    } catch (error) {
      toast.error(error.message || "Unable to load users")
    } finally {
      setUsersLoading(false)
    }
  }

  const handleShowUsers = () => {
    setShowUsers(true)
    loadUsers()
  }

  const handleDeleteUser = async (selectedUser) => {
    const userName = selectedUser.full_name || selectedUser.username
    const confirmed = window.confirm(`Delete ${userName}? This action cannot be undone.`)

    if (!confirmed) return

    try {
      setDeletingUserId(selectedUser.user_id)
      const response = await deleteUser(selectedUser.user_id)

      toast.success(response.message || "User deleted")

      // Remove the deleted row locally so the table updates without a full page reload.
      setUsers((currentUsers) => currentUsers.filter((item) => item.user_id !== selectedUser.user_id))
    } catch (error) {
      toast.error(error.message || "Unable to delete user")
    } finally {
      setDeletingUserId(null)
    }
  }

  const detailItems = [
    { label: "Full name", value: user?.full_name || "-", },
    { label: "Username", value: user?.username || "-", },
    { label: "Role", value: getRoleLabel(user?.role_id), },
  ];

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
              onClick={() => setShowCreateUser(true)}
              className='inline-flex h-10 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400'
            >
              <UserPlus size={18} />
              <span>Create User</span>
            </button>

            <button
              type='button'
              onClick={handleShowUsers}
              className='inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400'
            >
              <Users size={18} />
              <span>Show Users</span>
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
              icon={<LayoutDashboard size={18} />}
              onChange={(checked) => updatePreference('density', checked ? 'compact' : 'comfortable')}
            />
            <ProfileToggle
              checked={preferences.notifications}
              label='Activity notifications'
              note='Keep purchase activity alerts enabled.'
              icon={<Bell size={18} />}
              onChange={(checked) => updatePreference('notifications', checked)}
            />
            <ProfileToggle
              checked={preferences.reduceMotion}
              label='Reduce motion'
              note='Use calmer transitions where possible.'
              icon={<ShieldCheck size={18} />}
              onChange={(checked) => updatePreference('reduceMotion', checked)}
            />
          </div>
        </section>
      </div>

      {isAdmin && showCreateUser && (
        <CreateUser isModal onClose={() => setShowCreateUser(false)} />
      )}

      {isAdmin && showUsers && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]'>
          <div className='w-full max-w-4xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl'>
            <div className='flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4'>
              <div className='flex min-w-0 items-center gap-3'>
                <span className='grid h-10 w-10 shrink-0 place-items-center rounded-md bg-cyan-100 text-cyan-700'>
                  <Users size={20} />
                </span>
                <div className='min-w-0'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-cyan-700'>Admin action</p>
                  <h2 className='text-lg font-bold text-slate-950'>All Users</h2>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setShowUsers(false)}
                aria-label='Close users list'
                className='grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900'
              >
                <X size={18} />
              </button>
            </div>

            <div className='max-h-[calc(100vh-180px)] overflow-auto px-5 py-5'>
              {usersLoading ? (
                <div className='py-10 text-center text-sm font-medium text-slate-500'>Loading users...</div>
              ) : users.length === 0 ? (
                <div className='py-10 text-center text-sm font-medium text-slate-500'>No users found.</div>
              ) : (
                <table className='w-full min-w-[720px] border-collapse text-left text-sm'>
                  <thead>
                    <tr className='border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500'>
                      <th className='px-3 py-3 font-semibold'>Full name</th>
                      <th className='px-3 py-3 font-semibold'>Username</th>
                      <th className='px-3 py-3 font-semibold'>Role</th>
                      <th className='px-3 py-3 font-semibold'>Status</th>
                      <th className='px-3 py-3 text-right font-semibold'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((listedUser) => {
                      const isCurrentUser = Number(listedUser.user_id) === Number(currentUserId)

                      return (
                        <tr key={listedUser.user_id} className='border-b border-slate-100 last:border-b-0'>
                          <td className='px-3 py-3 font-semibold text-slate-900'>{listedUser.full_name || "-"}</td>
                          <td className='px-3 py-3 text-slate-600'>{listedUser.username}</td>
                          <td className='px-3 py-3 text-slate-600'>{getRoleLabel(listedUser.role_id)}</td>
                          <td className='px-3 py-3 text-slate-600'>{listedUser.status || "Active"}</td>
                          <td className='px-3 py-3 text-right'>
                            <button
                              type='button'
                              onClick={() => handleDeleteUser(listedUser)}
                              disabled={isCurrentUser || deletingUserId === listedUser.user_id}
                              aria-label={`Delete ${listedUser.username}`}
                              title={isCurrentUser ? "You cannot delete your current account" : "Delete user"}
                              className='inline-grid h-9 w-9 place-items-center rounded-md text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40'
                            >
                              {deletingUserId === listedUser.user_id ? (
                                <span className='h-4 w-4 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600' />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Profile

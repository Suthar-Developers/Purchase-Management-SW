import React, { useEffect, useMemo, useState } from 'react'
import { Bell, Check, LayoutDashboard, Moon, ShieldCheck, SlidersHorizontal, Sun, UserRound } from 'lucide-react'
import { applyStoredTheme, formatRole, getDisplayName, getStoredPreferences, getStoredUser, saveStoredPreferences } from '../../utils/userPreferences'

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
  const user = useMemo(() => getStoredUser(), [])
  const displayName = getDisplayName(user)
  const roleName = formatRole(user.role_id || user.role)

  const updatePreference = (key, value) => {
    setPreferences((current) => saveStoredPreferences({ ...current, [key]: value }))
  }

  useEffect(() => {
    applyStoredTheme(preferences.theme)
  }, [preferences.theme])

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
    </main>
  )
}

export default Profile

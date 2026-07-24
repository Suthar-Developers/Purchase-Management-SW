const STORAGE_KEY = import.meta.env.VITE_PREFERENCES_STORAGE_KEY;

const fallbackUser = {
  full_name: 'Workspace User',
  username: 'user',
  role_id: 'Team Member',
}

export const defaultPreferences = {
  theme: 'light',
  density: 'comfortable',
  notifications: true,
  reduceMotion: false,
}

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    console.warn(`Unable to read ${key} from local storage`, error)
    return fallback
  }
}

export const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'U'

  return words.slice(0, 2).map((word) => word[0].toUpperCase()).join('')
}

export const getStoredPreferences = () => ({
  ...defaultPreferences,
  ...readJson(STORAGE_KEY, defaultPreferences),
})

export const saveStoredPreferences = (preferences) => {
  const nextPreferences = { ...defaultPreferences, ...preferences }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences))
  return nextPreferences
}

export const applyStoredTheme = (theme = getStoredPreferences().theme) => {
  const root = document.documentElement
  root.classList.toggle('pm-theme-dark', theme === 'dark')
  root.classList.toggle('pm-theme-light', theme !== 'dark')
}

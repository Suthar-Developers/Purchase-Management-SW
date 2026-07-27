const USER_STORAGE_KEY = 'user'
const PREFERENCES_STORAGE_KEY = 'pm_app_preferences'

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

export const getStoredPreferences = () => ({
  ...defaultPreferences,
  ...readJson(PREFERENCES_STORAGE_KEY, defaultPreferences),
})

export const saveStoredPreferences = (preferences) => {
  const nextPreferences = { ...defaultPreferences, ...preferences }
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(nextPreferences))
  return nextPreferences
}

export const applyStoredTheme = (theme = getStoredPreferences().theme) => {
  const root = document.documentElement
  root.classList.toggle('pm-theme-dark', theme === 'dark')
  root.classList.toggle('pm-theme-light', theme !== 'dark')
}

export const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'U'

  return words.slice(0, 2).map((word) => word[0].toUpperCase()).join('')
}

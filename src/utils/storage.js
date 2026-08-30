export const safeGet = (key) => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export const safeSet = (key, value) => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // storage unavailable (private mode / quota) — ignore silently
  }
}

export const safeRemove = (key) => {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // storage unavailable — ignore silently
  }
}
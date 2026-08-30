import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const showToast = useCallback((message) => {
    setToast({ id: Date.now(), message })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={`toast ${toast ? 'show' : ''}`} key={toast?.id}>
        <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
        {toast?.message}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

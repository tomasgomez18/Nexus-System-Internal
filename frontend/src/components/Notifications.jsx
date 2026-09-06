import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ToastContext = createContext(null)

let toastId = 0
let confirmCallback = null

const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const styles = {
  success: {
    border: 'border-emerald-500/40',
    icon: 'text-emerald-400',
    bar: 'bg-emerald-500',
  },
  error: {
    border: 'border-red-500/40',
    icon: 'text-red-400',
    bar: 'bg-red-500',
  },
  info: {
    border: 'border-sky-500/40',
    icon: 'text-sky-400',
    bar: 'bg-sky-500',
  },
}

function ToastItem({ toast, onClose }) {
  const [exiting, setExiting] = useState(false)
  const s = styles[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 3500)
    const close = setTimeout(onClose, 3900)
    return () => {
      clearTimeout(timer)
      clearTimeout(close)
    }
  }, [onClose])

  return (
    <div
      role="status"
      className={`pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border bg-gray-900/90 px-4 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 ${s.border} ${
        exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
      style={{ animation: 'toast-in .3s ease-out' }}
    >
      <div className="flex items-start gap-3">
        <span className={`shrink-0 ${s.icon}`}>{icons[toast.type]}</span>
        <p className="flex-1 text-sm text-gray-100 leading-snug">{toast.message}</p>
        <button
          onClick={onClose}
          aria-label="Cerrar notificación"
          className="text-gray-500 hover:text-gray-200 text-lg leading-none"
        >
          ×
        </button>
      </div>
      <div
        className={`absolute bottom-0 left-0 h-0.5 w-full ${s.bar}`}
        style={{ animation: 'toast-progress 3.8s linear forwards' }}
      />
    </div>
  )
}

export function NotificationsProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [confirmState, setConfirmState] = useState(null)

  useEffect(() => {
    confirmCallback = (options) =>
      new Promise((resolve) => setConfirmState({ ...options, resolve }))
    return () => {
      confirmCallback = null
    }
  }, [])

  const push = useCallback((type, message) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const toast = {
    success: (message) => push('success', message),
    error: (message) => push('error', message),
    info: (message) => push('info', message),
  }

  const closeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const closeConfirm = (result) => {
    confirmState?.resolve(result)
    setConfirmState(null)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 px-4 pt-4">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => closeToast(t.id)} />
        ))}
      </div>

      {confirmState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            style={{ animation: 'modal-backdrop .2s ease-out' }}
            onClick={() => closeConfirm(false)}
          />
          <div
            className="relative w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-2xl"
            style={{ animation: 'modal-in .25s ease-out' }}
          >
            <div
              className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                confirmState.danger ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'
              }`}
            >
              {confirmState.danger ? icons.error : icons.info}
            </div>
            <h2 className="text-center text-lg font-bold text-white">{confirmState.title}</h2>
            {confirmState.message && (
              <p className="mt-2 whitespace-pre-line text-center text-sm text-gray-400">
                {confirmState.message}
              </p>
            )}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => closeConfirm(false)}
                className="rounded-xl bg-gray-800 py-2.5 text-sm font-medium text-gray-300 active:scale-95 hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => closeConfirm(true)}
                className={`rounded-xl py-2.5 text-sm font-semibold text-white active:scale-95 ${
                  confirmState.danger ? 'bg-red-600' : 'bg-emerald-600'
                }`}
              >
                {confirmState.confirmLabel || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

export function confirmDialog(options) {
  if (!confirmCallback) return Promise.resolve(true)
  return confirmCallback(options)
}
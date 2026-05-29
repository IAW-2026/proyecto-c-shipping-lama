export interface ToastNotification {
  id: string
  app: 'seller' | 'payments'
  method: string
  url: string
  status: number | null
  ok: boolean
  body: unknown
  error?: string
}

export type ToastInput = Omit<ToastNotification, 'id'>

export function showToast(data: ToastInput) {
  if (typeof window === 'undefined') return
  const id = Math.random().toString(36).slice(2, 9)
  window.dispatchEvent(new CustomEvent('lama:toast', { detail: { ...data, id } }))
}

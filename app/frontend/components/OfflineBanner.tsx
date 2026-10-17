import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Icon } from '@/components/Icon'

// Real check: the browser tells us when the connection drops (common on the shop floor)
export function OfflineBanner() {
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null
  return (
    <div
      role="alert"
      className="fixed top-0 right-0 left-0 z-[60] flex items-center justify-center gap-space-md bg-on-surface px-gutter py-space-sm text-inverse-on-surface"
    >
      <Icon name="wifi_off" className="text-[1.5rem]" />
      <span className="text-body-lg-bold">Sem conexão</span>
      <button
        type="button"
        onClick={() => router.reload()}
        className="rounded-lg bg-inverse-on-surface px-space-md py-1 text-label-md text-on-surface"
      >
        Tentar de novo
      </button>
    </div>
  )
}

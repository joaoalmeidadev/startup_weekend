import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'

type Notify = (message: string) => void

const MockNoticeContext = createContext<Notify>(() => {})

const VISIBLE_MS = 2400

// Toast for actions that are only mocked for now, so every button answers the click
export function MockNoticeProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const notify = useCallback<Notify>((text) => {
    clearTimeout(timer.current)
    setMessage(text)
    timer.current = setTimeout(() => setMessage(null), VISIBLE_MS)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <MockNoticeContext.Provider value={notify}>
      {children}
      {message && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-space-sm rounded-xl bg-on-surface px-space-lg py-space-md text-inverse-on-surface shadow-xl lg:bottom-6"
        >
          <Icon name="check_circle" className="text-[1.625rem] text-tertiary-fixed" />
          <span className="text-body-lg-bold">{message}</span>
        </div>
      )}
    </MockNoticeContext.Provider>
  )
}

export function useMockNotice() {
  return useContext(MockNoticeContext)
}

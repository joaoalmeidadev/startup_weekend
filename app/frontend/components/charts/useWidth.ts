import { useEffect, useRef, useState } from 'react'

const FALLBACK_WIDTH = 600

// Measures the container so the SVG draws at real pixels (text never stretches)
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(FALLBACK_WIDTH)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}

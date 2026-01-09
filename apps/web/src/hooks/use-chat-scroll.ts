import { useEffect, useRef } from 'react'

export function useChatScroll(deps: any[]) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitialRef = useRef(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100

    if (isInitialRef.current || isAtBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: isInitialRef.current ? 'auto' : 'smooth',
      })
      isInitialRef.current = false
    }
  }, deps)

  return containerRef
}

import {useEffect, useState} from 'react'

const useResizeObserver = (ref) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      // if change detected, re-render to sync
      setCount((c) => c + 1)
    })

    if (ref.current) resizeObserver.observe(ref.current)

    return () => resizeObserver.disconnect()
  }, [ref])

  return count
}

export default useResizeObserver

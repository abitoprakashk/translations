import {useEffect, useRef} from 'react'

const useColResize = (
  {target, onResizeStart, onResize, onResizeEnd},
  throttleTime = 100
) => {
  const timeoutRef = useRef()

  useEffect(() => {
    let startX = 0
    let coolingPeriod = false

    const mouseMove = (e) => {
      e.preventDefault()

      if (!coolingPeriod) {
        const movedX = e.screenX - startX
        typeof onResize == 'function' && onResize(movedX)
        coolingPeriod = true

        timeoutRef.current = setTimeout(() => {
          coolingPeriod = false
        }, throttleTime)
      }
    }

    const mousedown = (e) => {
      startX = e.screenX
      typeof onResizeStart == 'function' && onResizeStart()
      document.body.addEventListener('mousemove', mouseMove)
      document.body.addEventListener('mouseup', mouseup)
    }

    const mouseup = () => {
      startX = 0
      typeof onResizeEnd == 'function' && onResizeEnd()
      document.body.removeEventListener('mousemove', mouseMove)
      document.body.removeEventListener('mouseup', mouseup)
    }

    if (target) {
      target.addEventListener('mousedown', mousedown)
    }

    return () => {
      if (target) {
        target.removeEventListener('mousedown', mousedown)
      }
    }
  }, [target, onResize])
}

export default useColResize

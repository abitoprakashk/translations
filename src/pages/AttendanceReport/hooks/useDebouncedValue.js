/**
 * copied from https://mantine.dev/hooks/use-debounced-value/
 *
 */

import {useEffect, useState, useRef} from 'react'

export function useDebouncedValue(
  value,
  wait = 300,
  options = {leading: false}
) {
  const [_value, setValue] = useState(value)
  const mountedRef = useRef(false)
  const timeoutRef = useRef(null)
  const cooldownRef = useRef(false)

  const cancel = () => window.clearTimeout(timeoutRef.current)

  useEffect(() => {
    if (mountedRef.current) {
      if (!cooldownRef.current && options.leading) {
        cooldownRef.current = true
        setValue(value)
      } else {
        cancel()
        timeoutRef.current = window.setTimeout(() => {
          cooldownRef.current = false
          setValue(value)
        }, wait)
      }
    }
  }, [value, options.leading, wait])

  useEffect(() => {
    mountedRef.current = true
    return cancel
  }, [])

  return [_value, cancel]
}

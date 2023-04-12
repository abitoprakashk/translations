import {useEffect, useState} from 'react'
import {isMobile as isMobileFunc} from '@teachmint/krayon'
export default function useIsMobile() {
  const [isMobile, setisMobile] = useState(isMobileFunc())

  useEffect(() => {
    window.addEventListener('resize', () => {
      setisMobile(isMobileFunc())
    })
    return () => {
      window.removeEventListener('resize', () => {
        setisMobile(isMobileFunc())
      })
    }
  }, [])

  return isMobile
}

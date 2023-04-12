import {useEffect, useState} from 'react'
import {debounce} from '../../../utils/Helpers'

const isMobileFunc = (width) => {
  const deviceWidth = document?.body.clientWidth || window?.innerWidth
  return deviceWidth < width
}

export default function useCheckDeviceWidth(width = 1024) {
  const [isMobile, setIsMobile] = useState()

  useEffect(() => {
    setIsMobile(isMobileFunc(width))

    const resize = debounce(() => {
      setIsMobile(isMobileFunc(width))
    }, 200)

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return isMobile
}

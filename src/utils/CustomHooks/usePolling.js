import {useEffect, useState} from 'react'

const usePolling = (callBack, {delay = 1000}) => {
  const [intervalId, setIntervalId] = useState(null)

  function start() {
    const interval = setInterval(callBack, delay)
    setIntervalId(interval)
  }

  useEffect(() => {
    return () => clearInterval(intervalId)
  }, [])

  return {
    clear: () => {
      clearInterval(intervalId)
      setIntervalId(null)
    },
    start,
    intervalId,
  }
}

export default usePolling

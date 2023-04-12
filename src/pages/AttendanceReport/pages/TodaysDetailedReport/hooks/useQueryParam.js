import {useLayoutEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'

function useQueryParam(key) {
  const search = useLocation().search
  const [val, setval] = useState(null)

  useLayoutEffect(() => {
    setval(new URLSearchParams(search)?.get(key))
  }, [search, key])
  return val
}

export default useQueryParam

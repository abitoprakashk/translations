import {useMemo, useState} from 'react'

/**
 * @var {function} compare - args (item, query)
 */
const useSearchFilter = ({list = [], compare}) => {
  const [query, setQuery] = useState()

  const filteredList = useMemo(() => {
    const trimmedQuery = query?.trim().toLowerCase() || ''
    if (!trimmedQuery.length) return list

    return list.filter((item) => {
      if (compare && typeof compare == 'function')
        return compare(item, trimmedQuery)
      return item.name?.toLowerCase().includes(trimmedQuery)
    })
  }, [list, query])

  return {
    query,
    setQuery,
    filteredList,
  }
}

export default useSearchFilter

import {useMemo, useState} from 'react'

export const SORT_ORDER = {
  AESC: 0,
  DESC: 1,
}

export const SORT_DATA_TYPE = {
  STRING: 0,
  INTEGER: 1,
}

const COMPARISION = {
  [SORT_DATA_TYPE.INTEGER]: {
    [SORT_ORDER.AESC]: (key) => (a, b) => a[key] - b[key],
    [SORT_ORDER.DESC]: (key) => (a, b) => b[key] - a[key],
  },
  [SORT_DATA_TYPE.STRING]: {
    [SORT_ORDER.AESC]: (key) => (a, b) => a[key].localeCompare(b[key]),
    [SORT_ORDER.DESC]: (key) => (a, b) => b[key].localeCompare(a[key]),
  },
}

const useSort = ({list = [], initialActive = null}) => {
  const [active, setActive] = useState(initialActive)

  const sortedList = useMemo(() => {
    if (!active) return list

    const {
      order = SORT_ORDER.AESC,
      dataType = SORT_DATA_TYPE.INTEGER,
      key,
    } = active || {}

    return [...list].sort(COMPARISION[dataType][order](key))
  }, [list, active])

  return {
    sortedList,
    setActive,
  }
}

export default useSort

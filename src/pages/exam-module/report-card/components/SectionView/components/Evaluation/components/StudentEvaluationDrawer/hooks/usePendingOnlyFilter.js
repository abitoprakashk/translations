import {useMemo, useState} from 'react'
import {EVALUATION_TYPE} from '../../../../../../../constants'

const usePendingOnlyFilter = ({list = [], type}) => {
  const [active, setActive] = useState(false)

  const filteredList = useMemo(() => {
    if (active) {
      return list.filter(({score, value}) => {
        if (type == EVALUATION_TYPE.SCHOLASTIC)
          return !(score != null && !isNaN(score))
        else
          return type == EVALUATION_TYPE.ATTENDANCE
            ? !(value != null && value >= 0)
            : !value
      })
    }
    return list
  }, [list, active])

  return {
    active,
    setActive,
    filteredList,
  }
}

export default usePendingOnlyFilter

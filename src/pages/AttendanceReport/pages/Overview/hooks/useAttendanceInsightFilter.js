import {useState} from 'react'
import {INSIGHT_FILTER} from '../../../AttendanceReport.constant'

function useAttendanceInsightFilter(initVal) {
  const [selectedFilter, setFilter] = useState(
    initVal || INSIGHT_FILTER.SESSION
  )

  const onFilterChange = (val) => {
    setFilter(val)
  }

  return [selectedFilter, onFilterChange]
}

export default useAttendanceInsightFilter

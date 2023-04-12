import {useState} from 'react'
import {TREND_FILTER} from '../../../AttendanceReport.constant'

function useAttendanceTrendFilter() {
  const [selectedFilter, setFilter] = useState(TREND_FILTER.DAILY)

  const onFilterChange = (val) => {
    setFilter(val)
  }

  return [selectedFilter, onFilterChange]
}

export default useAttendanceTrendFilter

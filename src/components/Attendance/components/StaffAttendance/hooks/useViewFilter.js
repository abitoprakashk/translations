import {useMemo} from 'react'
import {useSelector} from 'react-redux'
import {resolveLeaveStatus} from '../components/AttendanceCard/utils'
import {
  ATTENDANCE_DAY_STATS,
  ATTENDANCE_VIEW_TYPE,
  ATTENDANCE_VIEW_TYPE_MAP,
  EDIT_ATTENDANCE_STATUS,
  STAFF_ATTENDANCE_STATUS,
} from '../StaffAttendanceConstants'

const {PRESENT, ABSENT, NOT_MARKED, TOTAL_STAFF} = ATTENDANCE_VIEW_TYPE
const {HALF_DAY_PRESENT} = EDIT_ATTENDANCE_STATUS

const useViewFilter = ({
  staffList = [],
  attendanceInfo = {},
  viewType = null,
}) => {
  const todayStatus = useSelector((state) => state.staffAttendance.todayStatus)

  const staffListFiltered = useMemo(() => {
    if (![PRESENT, ABSENT, NOT_MARKED, TOTAL_STAFF].includes(viewType))
      return []

    if (todayStatus === ATTENDANCE_DAY_STATS.NOT_MARKED_THIS_DAY.value) {
      if ([PRESENT, ABSENT].includes(viewType)) return []
      if (NOT_MARKED === viewType) return staffList
    }
    if (viewType === TOTAL_STAFF) return staffList

    return staffList.filter((item) => {
      const status =
        attendanceInfo[item._id]?.status || STAFF_ATTENDANCE_STATUS.NOT_MARKED
      const leaveStatus = resolveLeaveStatus(attendanceInfo[item._id]?.leave)
      if (leaveStatus) {
        return ATTENDANCE_VIEW_TYPE_MAP[viewType].scope.includes(leaveStatus)
      } else {
        if (status === HALF_DAY_PRESENT) {
          return ATTENDANCE_VIEW_TYPE_MAP[viewType].scope.includes(
            HALF_DAY_PRESENT
          )
        }
      }

      return status === ATTENDANCE_VIEW_TYPE[viewType]
    })
  }, [staffList, attendanceInfo, viewType])

  return staffListFiltered
}

export default useViewFilter

import {useMemo} from 'react'
import {resolveLeaveStatus} from '../components/AttendanceCard/utils'
import {
  ABSENT_ATTENDANCE_COUNT_STATUS,
  ATTENDANCE_LEAVE_STATUS,
  ATTENDANCE_VIEW_TYPE,
  EDIT_ATTENDANCE_STATUS,
  STAFF_ATTENDANCE_STATUS,
} from '../StaffAttendanceConstants'

const {PRESENT, ABSENT, NOT_MARKED, TOTAL_STAFF} = ATTENDANCE_VIEW_TYPE
const {PRESENT_HALF_DAY, REQUESTED} = ATTENDANCE_LEAVE_STATUS
const {HALF_DAY_PRESENT} = EDIT_ATTENDANCE_STATUS

const useAttendanceCount = ({staffList = [], attendanceInfo = {}}) => {
  const {
    [PRESENT]: present = 0,
    [ABSENT]: absent = 0,
    [NOT_MARKED]: notMarked = 0,
    [TOTAL_STAFF]: total = staffList.length,
  } = useMemo(() => {
    return staffList
      .map((item) => ({
        ...item,
        attendanceStatus:
          attendanceInfo[item._id]?.status ||
          STAFF_ATTENDANCE_STATUS.NOT_MARKED,
        leaveStatus: resolveLeaveStatus(attendanceInfo[item._id]?.leave),
      }))
      .reduce((acc, curr) => {
        const attendanceStatus = curr.attendanceStatus
        const leaveStatus = curr.leaveStatus

        if (!acc[TOTAL_STAFF]) acc[TOTAL_STAFF] = 0
        acc[TOTAL_STAFF] += 1

        if (ABSENT_ATTENDANCE_COUNT_STATUS.includes(leaveStatus)) {
          if (!acc[ABSENT]) acc[ABSENT] = 0
          acc[ABSENT] += 1
        } else if (
          leaveStatus === PRESENT_HALF_DAY ||
          attendanceStatus === HALF_DAY_PRESENT
        ) {
          if (!acc[PRESENT]) acc[PRESENT] = 0
          acc[PRESENT] += 1
        } else if (leaveStatus === REQUESTED) {
          if (!acc[NOT_MARKED]) acc[NOT_MARKED] = 0
          acc[NOT_MARKED] += 1
        } else if (leaveStatus) {
          if (!acc[leaveStatus]) acc[leaveStatus] = 0
          acc[leaveStatus] += 1
        } else {
          if (!acc[attendanceStatus]) acc[attendanceStatus] = 0
          acc[attendanceStatus] += 1
        }
        return acc
      }, {})
  }, [staffList, attendanceInfo])

  return {
    [PRESENT]: Math.min(present, total),
    [ABSENT]: Math.min(absent, total),
    [NOT_MARKED]: Math.min(notMarked, total),
    [TOTAL_STAFF]: total,
  }
}

export default useAttendanceCount

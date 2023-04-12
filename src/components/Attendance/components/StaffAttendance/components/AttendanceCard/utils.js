import {Icon} from '@teachmint/krayon'
import {LEAVE_BASE_TYPE} from '../../../../../../pages/LeaveManagement/LeaveManagement.constant'
import {
  ATTENDANCE_LEAVE_STATUS_MAP,
  STAFF_ATTENDANCE_STATUS,
} from '../../StaffAttendanceConstants'
import styles from './styles.module.css'

export const resolveLeaveStatus = (status) => {
  const {FULL_DAY, FIRST_HALF, SECOND_HALF} = status || {}
  // priority is for requested leave of any slot
  if (
    [FULL_DAY?.status, FIRST_HALF?.status, SECOND_HALF?.status].includes(
      LEAVE_BASE_TYPE.REQUESTED
    )
  )
    return ATTENDANCE_LEAVE_STATUS_MAP.REQUESTED.value

  if (FULL_DAY?.status) {
    switch (FULL_DAY?.status) {
      case LEAVE_BASE_TYPE.CREATED:
      case LEAVE_BASE_TYPE.APPROVED: {
        let leaveFullDayStatus =
          ATTENDANCE_LEAVE_STATUS_MAP.ON_LEAVE_FULL_DAY.value
        if (FULL_DAY?.type !== '') {
          if (FULL_DAY?.type === 'CASUAL') {
            leaveFullDayStatus =
              ATTENDANCE_LEAVE_STATUS_MAP.ABSENT_CASUAL_LEAVE.value
          } else if (FULL_DAY?.type === 'SICK') {
            leaveFullDayStatus =
              ATTENDANCE_LEAVE_STATUS_MAP.ABSENT_SICK_LEAVE.value
          } else if (FULL_DAY?.type === 'UNPAID') {
            leaveFullDayStatus =
              ATTENDANCE_LEAVE_STATUS_MAP.ABSENT_UNPAID_LEAVE.value
          }
        }
        return leaveFullDayStatus
      }

      case LEAVE_BASE_TYPE.REQUESTED:
        return ATTENDANCE_LEAVE_STATUS_MAP.REQUESTED.value
      default:
        null
    }
  } else if (
    (FIRST_HALF?.status === LEAVE_BASE_TYPE.APPROVED ||
      FIRST_HALF?.status === LEAVE_BASE_TYPE.CREATED) &&
    (SECOND_HALF?.status === LEAVE_BASE_TYPE.APPROVED ||
      SECOND_HALF?.status === LEAVE_BASE_TYPE.CREATED)
  ) {
    // two apporved leave on same day, merge to absent
    return ATTENDANCE_LEAVE_STATUS_MAP.ON_LEAVE_FULL_DAY.value
  } else if (FIRST_HALF?.status || SECOND_HALF?.status) {
    switch (FIRST_HALF?.status || SECOND_HALF?.status) {
      case LEAVE_BASE_TYPE.CREATED:
      case LEAVE_BASE_TYPE.APPROVED:
        return ATTENDANCE_LEAVE_STATUS_MAP.PRESENT_HALF_DAY.value

      case LEAVE_BASE_TYPE.REQUESTED:
        return ATTENDANCE_LEAVE_STATUS_MAP.REQUESTED.value
      default:
        null
    }
  }
}

export const resolveAttendanceStatus = (status, attendStatusType = null) => {
  switch (status) {
    case STAFF_ATTENDANCE_STATUS.ABSENT: {
      return ATTENDANCE_LEAVE_STATUS_MAP.ABSENT.value
    }

    case STAFF_ATTENDANCE_STATUS.PRESENT: {
      let statusType = ATTENDANCE_LEAVE_STATUS_MAP.PRESENT.value
      if (attendStatusType && attendStatusType !== '') {
        if (attendStatusType === 'ARRIVE_LATE') {
          statusType = ATTENDANCE_LEAVE_STATUS_MAP.PRESENT_ARRIVE_LATE.value
        } else if (attendStatusType === 'LEFT_EARLY') {
          statusType = ATTENDANCE_LEAVE_STATUS_MAP.PRESENT_LEFT_EARLY.value
        } else if (attendStatusType === 'ARRIVE_LATE_LEFT_EARLY') {
          statusType =
            ATTENDANCE_LEAVE_STATUS_MAP.PRESENT_ARRIVE_LATE_LEFT_EARLY.value
        }
      }
      return statusType
    }
    case STAFF_ATTENDANCE_STATUS.HALF_DAY_PRESENT: {
      return ATTENDANCE_LEAVE_STATUS_MAP.PRESENT_HALF_DAY.value
    }

    default:
      return null
  }
}

export const resolveFooterState = (leaveType, attendanceType, showToggle) => {
  let toggle = null
  let footerStatus = null

  // maintain below logic in such way that both (toggle & footerStatus) can't be true at a time

  if (leaveType && leaveType === STAFF_ATTENDANCE_STATUS.ABSENT) {
    // this is a single case when there are two approved leaves, we show ABSENT
    // and showToggle will have no effect on it, it is handled in next else if block
    // but higlighting here as this is a special case
    footerStatus = leaveType
  } else if (leaveType) {
    footerStatus = leaveType
  } else if (showToggle) {
    toggle = true
  } else if (attendanceType) {
    footerStatus = attendanceType
  } else {
    toggle = true
  }

  return {
    toggle,
    footerStatus,
  }
}

export const getAttendanceMethodHTML = ({attendanceInfo}) => {
  let cstHTML = null
  if (
    attendanceInfo?.attendance_method &&
    attendanceInfo?.attendance_method !== ''
  ) {
    if (attendanceInfo?.attendance_method === 'BIOMETRIC')
      cstHTML = (
        <div className={styles.attendanceMethodBlock}>
          <Icon name="fingerprint" size="xxx_s" />
        </div>
      )
    else if (attendanceInfo?.attendance_method === 'GEOFENCE') {
      cstHTML = (
        <div className={styles.attendanceMethodBlock}>
          <Icon name="gpsNotFixed" size="xxx_s" />
        </div>
      )
    }
  }
  return cstHTML
}

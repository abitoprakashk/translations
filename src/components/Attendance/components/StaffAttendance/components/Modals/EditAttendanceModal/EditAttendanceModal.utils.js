import {t} from 'i18next'
import {
  EDIT_ATTENDANCE_STATUS,
  GRACE_LABEL_CONST,
} from '../../../StaffAttendanceConstants'

const {
  NOT_MARKED,
  PRESENT,
  HALF_DAY_PRESENT,
  PRESENT_HALF_DAY,
  ARRIVE_LATE,
  LEFT_EARLY,
  ABSENT,
  ARRIVE_LATE_LEFT_EARLY,
} = EDIT_ATTENDANCE_STATUS
const {GRACE_ALLOWED, GRACE_USED, PENALTY} = GRACE_LABEL_CONST

export const initialOperationEditAttendance = ({
  attendanceInfo,
  leaveStatus,
  type,
  setEditLeaveSelect,
  setFields,
  absentLeaveStatus,
  setPresentLeaveSelected,
}) => {
  if (attendanceInfo && Object.keys(attendanceInfo)?.length > 0) {
    if (leaveStatus && Object.keys(leaveStatus)?.length > 0) {
      if (type === PRESENT_HALF_DAY) {
        setEditLeaveSelect(HALF_DAY_PRESENT)
        setFields((fields) => ({
          ...fields,
          leaveType: Object.values(leaveStatus)?.[0]?.type || '',
        }))
      } else {
        if (absentLeaveStatus.includes(type)) {
          setEditLeaveSelect(ABSENT)
          setFields((fields) => ({
            ...fields,
            leaveType: Object.values(leaveStatus)?.[0]?.type || '',
          }))
        }
      }
    } else {
      if (
        attendanceInfo?.status !== '' &&
        attendanceInfo?.status !== NOT_MARKED
      ) {
        setEditLeaveSelect(attendanceInfo?.status)

        if (
          attendanceInfo?.status === PRESENT &&
          attendanceInfo?.status_type !== ''
        ) {
          if (attendanceInfo?.status_type === ARRIVE_LATE_LEFT_EARLY) {
            setPresentLeaveSelected([ARRIVE_LATE, LEFT_EARLY])
          } else {
            if (
              attendanceInfo.status_type &&
              attendanceInfo?.status_type !== ''
            ) {
              setPresentLeaveSelected([attendanceInfo.status_type])
            }
          }
        }
      }
    }
  }
}

export const getGraceCalculation = ({graceStateData, isChecked}) => {
  const graceAllowed = graceStateData[GRACE_ALLOWED]
  let tempGraceCount = graceStateData[GRACE_USED]
  let tempPenaltyCount = graceStateData[PENALTY]
  if (isChecked) {
    tempGraceCount = graceStateData[GRACE_USED] + 1
    if (graceAllowed < tempGraceCount) {
      const calPenatly = (tempGraceCount - graceAllowed) / 2
      tempPenaltyCount = calPenatly
    }
  } else {
    tempGraceCount = graceStateData[GRACE_USED] - 1
    if (graceAllowed <= tempGraceCount) {
      const calPenatly = (tempGraceCount - graceAllowed) / 2
      tempPenaltyCount = calPenatly > 0 ? calPenatly : 0
    }
  }
  const updateGraceObj = {
    GRACE_ALLOWED: graceStateData[GRACE_ALLOWED],
    GRACE_USED: tempGraceCount,
    PENALTY: tempPenaltyCount,
  }
  return updateGraceObj
}

export const EDIT_BADGES_STATUS = {
  GRACE_ALLOWED: {
    id: 'GRACE_ALLOWED',
    type: 'basic',
    label: t('graceAllowed'),
    tooltip: false,
    valueSuffix: t('perMonth'),
  },
  GRACE_USED: {
    id: 'GRACE_USED',
    type: 'success',
    label: t('graceUsed'),
    tooltip: false,
    valueSuffix: null,
  },
  PENALTY: {
    id: 'PENALTY',
    type: 'error',
    label: t('penalty'),
    tooltip: true,
    valueSuffix: t('unpaidLeaves'),
  },
}

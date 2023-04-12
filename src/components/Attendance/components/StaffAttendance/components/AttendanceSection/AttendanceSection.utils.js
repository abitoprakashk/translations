import {STAFF_ATTENDANCE_STATUS} from '../../StaffAttendanceConstants'

export const totalNotMarked = (totalStaff, totalPresent, totalAbsent) => {
  const notMarkedCount = totalStaff - (totalPresent + totalAbsent)
  return notMarkedCount
}

export const getStaffPresentAbsentListData = (
  staffFiltersListData,
  staffAttendanceListData,
  selectedDateUTCTimestamp
) => {
  let newStaffAttendanceMapsList = []
  let markedPresentListIds = []
  let markedAbsentListIds = []
  if (
    staffFiltersListData &&
    staffAttendanceListData &&
    staffAttendanceListData?.[selectedDateUTCTimestamp]?.staff_attendance_info
      ?.length > 0
  ) {
    const staffAttendanceStatusList =
      staffAttendanceListData[selectedDateUTCTimestamp].staff_attendance_info

    newStaffAttendanceMapsList = staffFiltersListData.map((item) => {
      const staffAttendanceMapObj = staffAttendanceStatusList.find(
        (user) => user.iid === item._id
      )
      if (
        staffAttendanceMapObj &&
        staffAttendanceMapObj.status == STAFF_ATTENDANCE_STATUS.PRESENT
      ) {
        markedPresentListIds.push(item._id)
      } else if (
        staffAttendanceMapObj &&
        staffAttendanceMapObj.status == STAFF_ATTENDANCE_STATUS.ABSENT
      ) {
        markedAbsentListIds.push(item._id)
      }
      return {
        ...item,
        status: staffAttendanceMapObj
          ? staffAttendanceMapObj.status
          : STAFF_ATTENDANCE_STATUS.NOT_MARKED,
      }
    })
  }
  return {newStaffAttendanceMapsList, markedPresentListIds, markedAbsentListIds}
}

export const diffChecker = (initialState, currentState, getVal) => {
  const keys = Object.keys(currentState)
  const changed = []

  keys.forEach((key) => {
    let sourceState = initialState[key] || {}
    let targetState = currentState[key] || {}
    let sourceVal = getVal(sourceState)
    let targetVal = getVal(targetState)
    if (sourceVal != targetVal) {
      changed.push({iid: key, status: targetVal})
    }
  })
  return {changes: changed, hasChanged: Object.keys(changed).length > 0}
}

// This not used now
export const diffCheckerOld = (initialState, currentState, getVal) => {
  const keys = Object.keys(currentState)
  const changed = {}

  keys.forEach((key) => {
    let sourceState = initialState[key] || {}
    let targetState = currentState[key] || {}
    let sourceVal = getVal(sourceState)
    let targetVal = getVal(targetState)
    if (sourceVal != targetVal) {
      changed[key] = targetVal
    }
  })

  return {changes: changed, hasChanged: Object.keys(changed).length > 0}
}

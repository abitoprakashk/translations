import {
  STAFF_ATTENDANCE_STATUS,
  STAFF_ATTENDANCE_USERS_STATUS_TABS,
} from '../../StaffAttendanceConstants'

// Get tabs wise staff user list
export const getTabsWiseStaffUserList = ({
  selectedTabValue,
  staffAttendanceListWithStatusData,
}) => {
  let newStaffFilerlist = {}
  STAFF_ATTENDANCE_USERS_STATUS_TABS.forEach((tabItem, index) => {
    if (selectedTabValue == tabItem.id) {
      newStaffFilerlist = staffAttendanceListWithStatusData.filter(
        (staffFilterList) => {
          if (
            index == 0 &&
            staffFilterList?.status == STAFF_ATTENDANCE_STATUS.PRESENT
          ) {
            return staffFilterList
          } else if (
            index == 1 &&
            staffFilterList?.status == STAFF_ATTENDANCE_STATUS.ABSENT
          ) {
            return staffFilterList
          } else {
            if (
              index == 2 &&
              (!staffFilterList.status ||
                staffFilterList.status == STAFF_ATTENDANCE_STATUS.NOT_MARKED)
            ) {
              return staffFilterList
            }
          }
        }
      )
    }
  })
  return newStaffFilerlist
}

// Get present absent list Ids
export const getPresentAbsentListIds = (staffFiltersListData) => {
  let markedPresentListIds = []
  let markedAbsentListIds = []
  staffFiltersListData?.forEach((item) => {
    if (
      item.status == STAFF_ATTENDANCE_STATUS.PRESENT &&
      !markedPresentListIds.includes(item._id)
    ) {
      markedPresentListIds.push(item._id)
    }
    if (
      (item.status == STAFF_ATTENDANCE_STATUS.ABSENT ||
        item.status == STAFF_ATTENDANCE_STATUS.NOT_MARKED) &&
      !markedAbsentListIds.includes(item._id)
    ) {
      markedAbsentListIds.push(item._id)
    }
  })
  return {markedPresentListIds, markedAbsentListIds}
}

// Get Staff Attendance Status List
export const getStaffAttendanceStatusList = ({
  selectedDateUTCTimestamp,
  staffFiltersListData,
  staffAttendanceListData,
}) => {
  let newStaffAttendanceMapList = []
  if (
    staffFiltersListData &&
    staffAttendanceListData &&
    staffAttendanceListData?.[selectedDateUTCTimestamp]?.staff_attendance_info
      ?.length > 0
  ) {
    const staffAttendanceStatusList =
      staffAttendanceListData[selectedDateUTCTimestamp].staff_attendance_info
    newStaffAttendanceMapList = staffFiltersListData.map((item) => {
      const staffAttendanceMapObj = staffAttendanceStatusList.find(
        (user) => user.iid === item._id
      )
      return {
        ...item,
        status: staffAttendanceMapObj
          ? staffAttendanceMapObj.status
          : STAFF_ATTENDANCE_STATUS.NOT_MARKED,
      }
    })
  }
  return newStaffAttendanceMapList
}

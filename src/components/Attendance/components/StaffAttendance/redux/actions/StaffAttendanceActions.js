import {
  EDIT_ATTENDANCE,
  FETCH_LEAVE_DETAILS,
  FETCH_LEAVE_DETAILS_FAILED,
  FETCH_LEAVE_DETAILS_SUCCESS,
  MARK_INDIVIDUAL_ATTENDANCE_STATUS,
  REVERT_MARKED_INDIVIDUAL_ATTENDANCE_STATUS,
  StaffAttendanceActionType,
  GET_STAFF_ATTENDANCE,
  UPDATE_ALL_ATTENDANCE,
  SYNC_STAFF_ATTENDANCE,
} from '../actionTypes'

// Fetch Staff Attendance date action
export const fetchStaffAttendanceDates = (selectedDate) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_DATES,
    payload: selectedDate,
  }
}

// UTC timestamp action
export const fetchUTCTimestamp = (timestamp) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_UTC_TIMESTAMP,
    payload: timestamp,
  }
}

// Selected Tab action
export const selectedTabAction = (selectedTab) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_SELECTED_TAB,
    payload: selectedTab,
  }
}

// Staff Attendance UI Manage States Action
export const staffAttendanceUIManageStatesAction = (statesObject) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_UI_STATES_MANAGE,
    payload: statesObject,
  }
}

// Fetch Staff list requests
export const fetchStaffListRequestAction = () => {
  return {
    type: StaffAttendanceActionType.GET_STAFF_DETAILS_LIST,
  }
}

export const fetchStaffListAction = (staffList) => {
  return {
    type: StaffAttendanceActionType.STAFF_LIST_GET_SUCCEEDED,
    payload: staffList,
  }
}

// Fetch Staff Filters list
export const fetchStaffListFiltersRequestAction = (staffFiltersList) => {
  return {
    type: StaffAttendanceActionType.GET_STAFF_FILTERS_LIST,
    payload: staffFiltersList,
  }
}

// Fetch Staff Attendance List
export const fetchStaffAttendanceListRequestAction = (
  staffAttendanceListParams
) => {
  return {
    type: StaffAttendanceActionType.GET_STAFF_ATTENDANCE_LIST,
    payload: staffAttendanceListParams,
  }
}

export const fetchStaffAttendanceListAction = (staffAttendanceList) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_LIST_GET_SUCCEEDED,
    payload: staffAttendanceList,
  }
}

// Staff Attendance with status List
export const fetchStaffAttendanceWithStatusListAction = (
  staffAttendanceWithStatusList
) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_LIST_WITH_STATUS,
    payload: staffAttendanceWithStatusList,
  }
}

// Staff Attendance Apply Filters Data
export const fetchStaffAttendanceFilters = (selectedFilters) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_FILTERS,
    payload: selectedFilters,
  }
}

// Store Staff Attendance Serach Term
export const storeStaffAttendanceSearchTerm = (searchTerm) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_SEARCH_TERM,
    payload: searchTerm,
  }
}

// Staff Attendance Present Absent Count Store
export const staffAttendancePresentAbsentCountStoreAction = (
  staffAttendanceCountObj
) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_PRESENT_ABSENT_COUNT,
    payload: staffAttendanceCountObj,
  }
}

// Staff Attendance Submit Action
export const markStaffAttendanceSubmitRequestAction = (submitParams) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_SUBMIT_REQUEST,
    payload: submitParams,
  }
}

// Staff Attendance Download Report
export const fetchStaffAttendanceDownloadReportsRequestAction = (
  downloadParams
) => {
  return {
    type: StaffAttendanceActionType.STAFF_ATTENDANCE_DOWNLOAD_REPORT_REQUEST,
    payload: downloadParams,
  }
}

export const markIndividualAttendance = (staffId, status) => ({
  type: MARK_INDIVIDUAL_ATTENDANCE_STATUS,
  payload: {staffId, status},
})

export const revertMarkedIndividualAttendance = (payload) => ({
  type: REVERT_MARKED_INDIVIDUAL_ATTENDANCE_STATUS,
  payload,
})

export const updateAllAttendance = (payload) => ({
  type: UPDATE_ALL_ATTENDANCE,
  payload,
})

export const editAttendance = (payload) => ({
  type: EDIT_ATTENDANCE,
  payload,
})

export const fetchLeaveDetails = (payload) => ({
  type: FETCH_LEAVE_DETAILS,
  payload,
})

export const fetchLeaveDetailsSuccess = (payload) => ({
  type: FETCH_LEAVE_DETAILS_SUCCESS,
  payload,
})

export const fetchLeaveDetailsFailed = (payload) => ({
  type: FETCH_LEAVE_DETAILS_FAILED,
  payload,
})

export const getStaffAttendance = (payload) => ({
  type: GET_STAFF_ATTENDANCE,
  payload,
})

export const syncStaffAttendance = (payload) => ({
  type: SYNC_STAFF_ATTENDANCE,
  payload,
})

export const attendanceActionList = [
  'fetchAttendanceRequests',
  'resolveAttendanceRequest',
  'fetchStaffAttendanceSummary',
  'fetchNonTeachingStaffAttendance',
  'fetchTodayNonTeachingStaffAttendance',
]

import {createTransducer} from '../../../../../../redux/helpers'
import {getCurrentDate, getUTCTimeStamp} from '../../commonFunctions'
import {
  EDIT_ATTENDANCE,
  FETCH_LEAVE_DETAILS,
  FETCH_LEAVE_DETAILS_FAILED,
  FETCH_LEAVE_DETAILS_SUCCESS,
  MARK_INDIVIDUAL_ATTENDANCE_STATUS,
  REVERT_MARKED_INDIVIDUAL_ATTENDANCE_STATUS,
  StaffAttendanceActionType,
  SYNC_STAFF_ATTENDANCE,
  UPDATE_ALL_ATTENDANCE,
} from '../actionTypes'
import {
  ATTENDANCE_DAY_STATS,
  STAFF_ATTENDANCE_USERS_STATUS_TABS,
} from '../../StaffAttendanceConstants'
import produce from 'immer'

const INITIAL_STATE = {
  staffAttendanceSelectedDate: getCurrentDate(),
  selectedDateUTCTimestamp: getUTCTimeStamp(getCurrentDate()),
  selectedTabValue: STAFF_ATTENDANCE_USERS_STATUS_TABS[0].id,
  // staffAttendanceStatesManageData: {
  //   isShowMarkAttendance: false,
  //   isShowMarkAttendanceToggle: false,
  //   isAllPresentAbsentAttendance: false,
  //   isMarkAttendanceUpdateView: false,
  //   isEditMarkAttendance: false,
  // },
  // staffSearchText: '',

  info: {},
  commitedInfo: {},
  todayStatus: null,
  editing: false,

  leaveDetails: {
    loading: false,
    data: {},
  },

  staffAttendanceListParams: null,
  staffListData: null,
  isStaffListLoading: true,
  staffFiltersListData: null,
  staffListFailedMessage: null,

  staffAttendanceListData: null,
  isStaffAttendanceListLoading: true,
  staffAttendanceListWithStatusData: null,
  staffAttendanceListFailedMessage: null,

  // totalPresentAbsentCounts: {
  //   totalStaffCount: 0,
  //   totalPresentCount: 0,
  //   totalAbsentCount: 0,
  //   totalNotMarkedCount: 0,
  // },

  // staffAttendanceSelectedFiltersData: {
  //   staffRolesNames: [],
  // },
  // staffAttendaceSubmitParams: null,
  // staffAttendaceSubmitSucceededMsg: null,
  // staffAttendaceSubmitFailedMsg: null,
  // isStaffAttendaceDataSubmitLoading: true,

  // staffAttendanceDownloadReportParams: null,
  // staffAttendanceDownloadReportLoading: true,
  // staffAttendanceDownloadReportData: null,
  // staffAttendanceDownloadReportFailedMsg: null,
}

// Selected date
const fetchStaffAttendanceDateReducer = (state, {payload}) => {
  return {
    ...state,
    staffAttendanceSelectedDate: payload,
  }
}

// UTC timestamp get
const fetchStaffAttendanceUTCTimestampReducer = (state, {payload}) => {
  return {
    ...state,
    selectedDateUTCTimestamp: payload,
  }
}

// Selected Filters data
const fetchStaffAttendanceFiltersReducer = (state, {payload}) => {
  return {
    ...state,
    staffAttendanceSelectedFiltersData: payload,
  }
}

// Staff attendance UI states manage
const staffAttendanceUIStatesManageReducer = (state, {payload}) => {
  return {
    ...state,
    staffAttendanceStatesManageData: {
      ...state.staffAttendanceStatesManageData,
      ...payload,
    },
  }
}

// Staff Selected tab value
const staffSelectedTabReducer = (state, {payload}) => {
  return {
    ...state,
    selectedTabValue: payload,
  }
}

// Fetch staff list
const staffListRequestReducer = (state) => {
  return {
    ...state,
    isStaffListLoading: true,
  }
}

const staffListSucceededReducer = (state, {payload}) => {
  return {
    ...state,
    isStaffListLoading: false,
    staffListData: payload.sort((a, b) => a?.name.localeCompare(b?.name)),
  }
}

const staffListFailedReducer = (state, {payload}) => {
  return {
    ...state,
    staffListFailedMessage: payload,
  }
}

// Staff filters list
const staffFiltersListRequestReducer = (state, {payload}) => {
  return {
    ...state,
    staffFiltersListData: payload,
  }
}

// Fetch Staff Attendance list request
const staffAttendanceListRequestReducer = (state, {payload}) => {
  return {
    ...state,
    isStaffListLoading: true,
    isStaffAttendanceListLoading: true,
    staffAttendanceListParams: payload,
  }
}

const staffAttendanceListReducer = (state, {payload}) => {
  const {staff_attendance_info = [], is_attendence_marked = false} =
    payload[state.selectedDateUTCTimestamp] || {}
  return {
    ...state,
    editing: false,
    isStaffListLoading: false,
    isStaffAttendanceListLoading: false,
    staffAttendanceListData: payload,
    todayStatus: is_attendence_marked
      ? ATTENDANCE_DAY_STATS.MARKED_THIS_DAY.value
      : ATTENDANCE_DAY_STATS.NOT_MARKED_THIS_DAY.value,
    info: staff_attendance_info.reduce((acc, item) => {
      acc[item.iid] = item
      return acc
    }, {}),
    commitedInfo: staff_attendance_info.reduce((acc, item) => {
      acc[item.iid] = item
      return acc
    }, {}),
  }
}

const staffAttendanceListFailedReducer = (state, {payload}) => {
  return {
    ...state,
    staffAttendanceListFailedMessage: payload,
  }
}

// Staff Attendance list data with updated status
const staffAttendancelistWithStatusReducer = (state, {payload}) => {
  return {
    ...state,
    staffAttendanceListWithStatusData: payload,
  }
}

// Staff Attedance Search term data store
const staffAttendanceSearchTermReducer = (state, {payload}) => {
  return {
    ...state,
    staffSearchText: payload,
  }
}

// Staff Attendance Present Absent count
const staffAttendancePresentAbsentCountReducer = (state, {payload}) => {
  return {
    ...state,
    totalPresentAbsentCounts: payload,
  }
}

// Staff Attendance submit
const staffAttendanceSubmitRequestReducer = (state, {payload}) => {
  return {
    ...state,
    isStaffListLoading: true,
    staffAttendaceSubmitParams: payload,
  }
}

const staffAttendanceSubmitSucceededReducer = (state, {payload}) => {
  return {
    ...state,
    isStaffListLoading: false,
    staffAttendaceSubmitSucceededMsg: payload,
  }
}

const staffAttendanceSubmitFailedReducer = (state, {payload}) => {
  return {
    ...state,
    isStaffListLoading: false,
    staffAttendaceSubmitFailedMsg: payload,
  }
}

// Staff Attendance download report
const staffAttendanceDownloadReportRequestReducer = (state, {payload}) => {
  return {
    ...state,
    isStaffListLoading: true,
    staffAttendanceDownloadReportLoading: true,
    staffAttendanceDownloadReportParams: payload,
  }
}

const staffAttendanceDownloadReportSuccessdedReducer = (state, {payload}) => {
  return {
    ...state,
    isStaffListLoading: false,
    staffAttendanceDownloadReportLoading: false,
    staffAttendanceDownloadReportData: payload,
  }
}

const staffAttendanceDownloadReportFailedReducer = (state, {payload}) => {
  return {
    ...state,
    staffAttendanceDownloadReportFailedMsg: payload,
  }
}

const markIndividualAttendance = (state, {payload}) => {
  const {staffId, status} = payload
  return produce(state, (draft) => {
    if (!draft.info[staffId]) draft.info[staffId] = {}
    draft.info[staffId].status = status
    return draft
  })
}

const revertMarkedIndividualAttendance = (state) => {
  const {commitedInfo} = state
  return produce(state, (draft) => {
    draft.editing = false
    draft.info = JSON.parse(JSON.stringify(commitedInfo))
    return draft
  })
}

const updateAllAttendance = (state, {payload}) => {
  const {staffListData} = state
  return produce(state, (draft) => {
    staffListData.forEach(({_id}) => {
      draft.info[_id] = {
        ...(draft.info[_id] || {}),
        // if any leave status is set, can't update attendance status
        status:
          draft.info[_id]?.leave && Object.keys(draft.info[_id]?.leave).length
            ? draft.info[_id].status
            : payload.status,
        iid: _id,
      }
    })
    return draft
  })
}

const editAttendance = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.editing = payload
    return draft
  })
}

const fetchLeaveDetails = (state) => {
  return produce(state, (draft) => {
    draft.leaveDetails.loading = true
    draft.leaveDetails.data = {}
    return draft
  })
}

const fetchLeaveDetailsSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.leaveDetails.loading = false
    draft.leaveDetails.data = payload
    return draft
  })
}

const fetchLeaveDetailsFailed = (state) => {
  return produce(state, (draft) => {
    draft.leaveDetails.loading = false
    return draft
  })
}

const synStaffAttendance = (state, {payload}) => {
  const {staff_attendance_info = []} =
    payload[state.selectedDateUTCTimestamp] || {}

  return {
    ...state,
    info: staff_attendance_info.reduce(
      (acc, item) => {
        acc[item.iid] = item
        return acc
      },
      {...state.info}
    ),
    commitedInfo: staff_attendance_info.reduce(
      (acc, item) => {
        acc[item.iid] = item
        return acc
      },
      {...state.commitedInfo}
    ),
  }
}

const staffAttendanceReducer = {
  // Staff attendance general reducer
  [StaffAttendanceActionType.STAFF_ATTENDANCE_DATES]:
    fetchStaffAttendanceDateReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_UTC_TIMESTAMP]:
    fetchStaffAttendanceUTCTimestampReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_FILTERS]:
    fetchStaffAttendanceFiltersReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_UI_STATES_MANAGE]:
    staffAttendanceUIStatesManageReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_SELECTED_TAB]:
    staffSelectedTabReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_PRESENT_ABSENT_COUNT]:
    staffAttendancePresentAbsentCountReducer,

  // Staff Attendance for search term
  [StaffAttendanceActionType.STAFF_ATTENDANCE_SEARCH_TERM]:
    staffAttendanceSearchTermReducer,

  // Staff list reducer
  [StaffAttendanceActionType.GET_STAFF_DETAILS_LIST]: staffListRequestReducer,
  [StaffAttendanceActionType.STAFF_LIST_GET_SUCCEEDED]:
    staffListSucceededReducer,
  [StaffAttendanceActionType.GET_STAFF_FILTERS_LIST]:
    staffFiltersListRequestReducer,
  [StaffAttendanceActionType.STAFF_LIST_GET_FAILED]: staffListFailedReducer,

  // Staff Attendance data get reducer
  [StaffAttendanceActionType.GET_STAFF_ATTENDANCE_LIST]:
    staffAttendanceListRequestReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_LIST_GET_SUCCEEDED]:
    staffAttendanceListReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_LIST_WITH_STATUS]:
    staffAttendancelistWithStatusReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_LIST_GET_FAILED]:
    staffAttendanceListFailedReducer,

  // Staff Attendance submit reducer
  [StaffAttendanceActionType.STAFF_ATTENDANCE_SUBMIT_REQUEST]:
    staffAttendanceSubmitRequestReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_SUBMIT_SUCCEEDED]:
    staffAttendanceSubmitSucceededReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_SUBMIT_FAILED]:
    staffAttendanceSubmitFailedReducer,

  // Staff Attendance report download reducer
  [StaffAttendanceActionType.STAFF_ATTENDANCE_DOWNLOAD_REPORT_REQUEST]:
    staffAttendanceDownloadReportRequestReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_DOWNLOAD_REPORT_SUCCESSDED]:
    staffAttendanceDownloadReportSuccessdedReducer,
  [StaffAttendanceActionType.STAFF_ATTENDANCE_DOWNLOAD_REPORT_FAILED]:
    staffAttendanceDownloadReportFailedReducer,
  [MARK_INDIVIDUAL_ATTENDANCE_STATUS]: markIndividualAttendance,
  [REVERT_MARKED_INDIVIDUAL_ATTENDANCE_STATUS]:
    revertMarkedIndividualAttendance,
  [UPDATE_ALL_ATTENDANCE]: updateAllAttendance,
  [EDIT_ATTENDANCE]: editAttendance,
  [FETCH_LEAVE_DETAILS]: fetchLeaveDetails,
  [FETCH_LEAVE_DETAILS_SUCCESS]: fetchLeaveDetailsSuccess,
  [FETCH_LEAVE_DETAILS_FAILED]: fetchLeaveDetailsFailed,
  [SYNC_STAFF_ATTENDANCE]: synStaffAttendance,
}

export const attendanceReducerMapping = {
  fetchAttendanceRequests: 'attendanceRequests',
  resolveAttendanceRequest: 'resolveAttendanceRequest',
  fetchStaffAttendanceSummary: 'staffAttendanceSummary',
  fetchNonTeachingStaffAttendance: 'nonTeachingStaffAttendance',
  fetchTodayNonTeachingStaffAttendance: 'todayNonTeachingStaffAttendance',
}

export default createTransducer(staffAttendanceReducer, INITIAL_STATE)

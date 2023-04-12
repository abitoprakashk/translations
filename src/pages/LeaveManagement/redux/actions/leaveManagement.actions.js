import {
  APPROVE_LEAVE,
  APPROVE_LEAVE_FAILURE,
  APPROVE_LEAVE_SUCCESS,
  CANCEL_LEAVE,
  CANCEL_LEAVE_FAILURE,
  CANCEL_LEAVE_SUCCESS,
  GET_LEAVE_BALANCE,
  GET_LEAVE_BALANCE_FAILURE,
  GET_LEAVE_BALANCE_SUCCESS,
  GET_PAST_LEAVES,
  GET_PAST_LEAVES_FAILURE,
  GET_PAST_LEAVES_SUCCESS,
  GET_PENDING_LEAVES,
  GET_PENDING_LEAVES_FAILURE,
  GET_PENDING_LEAVES_SUCCESS,
  GET_STAFF_HISTORY,
  GET_STAFF_HISTORY_FAILURE,
  GET_STAFF_HISTORY_SUCCESS,
  GET_STAFF_LEAVE_BALANCE,
  GET_STAFF_LEAVE_BALANCE_SUCCESS,
  GET_STAFF_LIST,
  GET_STAFF_LIST_SUCCESS,
  GET_STAFF_SELECTED_LEAVE_COUNT,
  GET_STAFF_SELECTED_LEAVE_COUNT_FAILURE,
  GET_STAFF_SELECTED_LEAVE_COUNT_SUCCESS,
  GET_TOTAL_LEAVE_STATS,
  GET_TOTAL_LEAVE_STATS_SUCCESS,
  HIDE_ADD_LEAVE_POPUP,
  HIDE_APPROVE_MODAL,
  HIDE_LEAVE_DETAILS_MODAL,
  HIDE_REJECT_MODAL,
  HIDE_REQUEST_LEAVE_POPUP,
  HIDE_STAFF_HISTORY_MODAL,
  REJECT_LEAVE,
  REJECT_LEAVE_FAILURE,
  REJECT_LEAVE_SUCCESS,
  REQUEST_LEAVE,
  REQUEST_LEAVE_FAILURE,
  REQUEST_LEAVE_SUCCESS,
  RESET_DATA,
  RESET_SESSION_LEAVE_BALANCE_RESPONSE,
  SHOW_ADD_LEAVE_POPUP,
  SHOW_APPROVE_MODAL,
  SHOW_LEAVE_BALANCE_UPDATE_FORM,
  SHOW_LEAVE_DETAILS_MODAL,
  SHOW_REJECT_MODAL,
  SHOW_REQUEST_LEAVE_POPUP,
  SHOW_STAFF_HISTORY_MODAL,
  CREATE_LEAVE,
  CREATE_LEAVE_FAILURE,
  CREATE_LEAVE_SUCCESS,
  SUBMIT_SESSION_LEAVE_BALANCE,
  SUBMIT_SESSION_LEAVE_BALANCE_FAILURE,
  SUBMIT_SESSION_LEAVE_BALANCE_SUCCESS,
  TESTDATA_MUTATE,
  TESTDATA_MUTATE_API,
  GET_CURRENT_USER_LEAVE_STATS,
  GET_CURRENT_USER_LEAVE_STATS_SUCCESS,
  SHOW_CANCEL_MODAL,
  HIDE_CANCEL_MODAL,
  CANCEL_LEAVE_BY_STAFF,
  CANCEL_LEAVE_BY_STAFF_SUCCESS,
  CANCEL_LEAVE_BY_STAFF_FAILURE,
  RESET_PENDING_LEAVES,
  RESET_PAST_LEAVES,
  DOWNLOAD_LEAVE_BALANCE_REPORT,
  DOWNLOAD_LEAVE_BALANCE_REPORT_SUCCESS,
  RESET_LEAVE_BALANCE_REPORT,
  GET_STAFF_UPCOMING_LEAVES,
  GET_STAFF_UPCOMING_LEAVES_SUCCESS,
  REMOVE_LEAVE_FROM_UPCOMING_LEAVE_LIST,
  SHOW_EDIT_LEAVE_POPUP,
  HIDE_EDIT_LEAVE_POPUP,
  EDIT_LEAVE,
  EDIT_LEAVE_SUCCESS,
  EDIT_LEAVE_FAILURE,
  SEARCH_STAFF,
} from '../actiontypes'

export const testmutateData = (payload) => ({
  type: TESTDATA_MUTATE,
  payload,
})
export const testmutateAPI = (payload) => ({
  type: TESTDATA_MUTATE_API,
  payload,
})

export const getLeaveBalance = () => ({
  type: GET_LEAVE_BALANCE,
})
export const getLeaveBalanceSuccess = (payload) => ({
  type: GET_LEAVE_BALANCE_SUCCESS,
  payload,
})

export const getLeaveBalanceFailure = (payload) => ({
  type: GET_LEAVE_BALANCE_FAILURE,
  payload,
})

export const submitSessionLeaves = (payload) => ({
  type: SUBMIT_SESSION_LEAVE_BALANCE,
  payload,
})

export const submitSessionLeavesSuccess = (payload) => ({
  type: SUBMIT_SESSION_LEAVE_BALANCE_SUCCESS,
  payload,
})

export const submitSessionLeavesFailed = (payload) => ({
  type: SUBMIT_SESSION_LEAVE_BALANCE_FAILURE,
  payload,
})

export const resetSessionLeaveResponse = (payload) => ({
  type: RESET_SESSION_LEAVE_BALANCE_RESPONSE,
  payload,
})

export const getPendingLeaves = (payload) => {
  return {
    type: GET_PENDING_LEAVES,
    payload,
  }
}
export const getPendingLeavesSuccess = (payload) => ({
  type: GET_PENDING_LEAVES_SUCCESS,
  payload,
})

export const getPendingLeavesFailure = (payload) => ({
  type: GET_PENDING_LEAVES_FAILURE,
  payload,
})

export const resetPendingLeaves = (payload) => ({
  type: RESET_PENDING_LEAVES,
  payload,
})

export const getPastLeaves = (payload) => ({
  type: GET_PAST_LEAVES,
  payload,
})
export const getPastLeavesSuccess = (payload) => ({
  type: GET_PAST_LEAVES_SUCCESS,
  payload,
})
export const getPastLeavesFailure = (payload) => ({
  type: GET_PAST_LEAVES_FAILURE,
  payload,
})
export const resetPastLeaves = (payload) => ({
  type: RESET_PAST_LEAVES,
  payload,
})

export const showApproveModal = (payload) => ({
  type: SHOW_APPROVE_MODAL,
  payload,
})

export const showRejectModal = (payload) => ({
  type: SHOW_REJECT_MODAL,
  payload,
})

export const showCancelModal = (payload) => ({
  type: SHOW_CANCEL_MODAL,
  payload,
})

export const hideApproveModal = (payload) => ({
  type: HIDE_APPROVE_MODAL,
  payload,
})

export const hideRejectModal = (payload) => ({
  type: HIDE_REJECT_MODAL,
  payload,
})

export const hideCancelModal = (payload) => ({
  type: HIDE_CANCEL_MODAL,
  payload,
})

export const approveLeave = (payload) => ({
  type: APPROVE_LEAVE,
  payload,
})

export const approveLeaveSuccess = (payload) => ({
  type: APPROVE_LEAVE_SUCCESS,
  payload,
})

export const approveLeaveFailure = (payload) => ({
  type: APPROVE_LEAVE_FAILURE,
  payload,
})

export const rejectLeave = (payload) => ({
  type: REJECT_LEAVE,
  payload,
})

export const rejectLeaveSuccess = (payload) => ({
  type: REJECT_LEAVE_SUCCESS,
  payload,
})

export const rejectLeaveFailure = (payload) => ({
  type: REJECT_LEAVE_FAILURE,
  payload,
})

export const showStaffHsitoryModal = (payload) => ({
  type: SHOW_STAFF_HISTORY_MODAL,
  payload,
})

export const hideStaffHsitoryModal = (payload) => ({
  type: HIDE_STAFF_HISTORY_MODAL,
  payload,
})

export const getStaffHistory = (payload) => ({
  type: GET_STAFF_HISTORY,
  payload,
})
export const getStaffHistorySuccess = (payload) => ({
  type: GET_STAFF_HISTORY_SUCCESS,
  payload,
})
export const getStaffHistoryFailure = (payload) => ({
  type: GET_STAFF_HISTORY_FAILURE,
  payload,
})

export const showLeaveDetails = (payload) => ({
  type: SHOW_LEAVE_DETAILS_MODAL,
  payload,
})

export const hideLeaveDetails = (payload) => ({
  type: HIDE_LEAVE_DETAILS_MODAL,
  payload,
})

export const showAddLeavePopup = (payload) => ({
  type: SHOW_ADD_LEAVE_POPUP,
  payload,
})

export const hideAddLeavePopup = (payload) => ({
  type: HIDE_ADD_LEAVE_POPUP,
  payload,
})

export const showRequestLeavePopup = (payload) => ({
  type: SHOW_REQUEST_LEAVE_POPUP,
  payload,
})

export const hideRequestLeavePopup = (payload) => ({
  type: HIDE_REQUEST_LEAVE_POPUP,
  payload,
})

export const showEditLeavePopup = (payload) => ({
  type: SHOW_EDIT_LEAVE_POPUP,
  payload,
})

export const hideEditLeavePopup = (payload) => ({
  type: HIDE_EDIT_LEAVE_POPUP,
  payload,
})

export const getStaffList = (payload) => ({
  type: GET_STAFF_LIST,
  payload,
})

export const getStaffListSuccess = (payload) => ({
  type: GET_STAFF_LIST_SUCCESS,
  payload,
})

export const getStaffLeaveBalance = (payload) => ({
  type: GET_STAFF_LEAVE_BALANCE,
  payload,
})

export const gesStaffLeaveBalanceSuccess = (payload) => ({
  type: GET_STAFF_LEAVE_BALANCE_SUCCESS,
  payload,
})

export const getSelectedLeaveCount = (payload) => ({
  type: GET_STAFF_SELECTED_LEAVE_COUNT,
  payload,
})
export const getSelectedLeaveCountSuccess = (payload) => ({
  type: GET_STAFF_SELECTED_LEAVE_COUNT_SUCCESS,
  payload,
})

export const getSelectedLeaveCountFailure = (payload) => ({
  type: GET_STAFF_SELECTED_LEAVE_COUNT_FAILURE,
  payload,
})

export const createLeave = (payload) => ({
  type: CREATE_LEAVE,
  payload,
})
export const createLeaveSuccess = (payload) => ({
  type: CREATE_LEAVE_SUCCESS,
  payload,
})
export const createLeaveFailure = (payload) => ({
  type: CREATE_LEAVE_FAILURE,
  payload,
})
export const requestLeave = (payload) => ({
  type: REQUEST_LEAVE,
  payload,
})
export const requestLeaveSuccess = (payload) => ({
  type: REQUEST_LEAVE_SUCCESS,
  payload,
})
export const requestLeaveFailure = (payload) => ({
  type: REQUEST_LEAVE_FAILURE,
  payload,
})
export const editLeave = (payload) => ({
  type: EDIT_LEAVE,
  payload,
})
export const editLeaveSuccess = (payload) => ({
  type: EDIT_LEAVE_SUCCESS,
  payload,
})
export const editLeaveFailure = (payload) => ({
  type: EDIT_LEAVE_FAILURE,
  payload,
})
export const cancelLeave = (payload) => ({
  type: CANCEL_LEAVE,
  payload,
})
export const cancelLeaveSuccess = (payload) => ({
  type: CANCEL_LEAVE_SUCCESS,
  payload,
})
export const cancelLeavefailure = (payload) => ({
  type: CANCEL_LEAVE_FAILURE,
  payload,
})
export const cancelLeaveByStaff = (payload) => ({
  type: CANCEL_LEAVE_BY_STAFF,
  payload,
})
export const cancelLeaveByStaffSuccess = (payload) => ({
  type: CANCEL_LEAVE_BY_STAFF_SUCCESS,
  payload,
})
export const cancelLeaveByStafffailure = (payload) => ({
  type: CANCEL_LEAVE_BY_STAFF_FAILURE,
  payload,
})
export const getTotalLeaveStats = (payload) => ({
  type: GET_TOTAL_LEAVE_STATS,
  payload,
})
export const getTotalLeaveStatsSuccess = (payload) => ({
  type: GET_TOTAL_LEAVE_STATS_SUCCESS,
  payload,
})
export const resetData = (payload) => ({
  type: RESET_DATA,
  payload,
})

export const showLeaveBalanceUpdateForm = () => ({
  type: SHOW_LEAVE_BALANCE_UPDATE_FORM,
  payload: true,
})

export const hideLeaveBalanceUpdateForm = () => ({
  type: SHOW_LEAVE_BALANCE_UPDATE_FORM,
  payload: false,
})

export const getCurrentUserLeaveStats = (payload) => ({
  type: GET_CURRENT_USER_LEAVE_STATS,
  payload,
})

export const getCurrentUserLeaveStatsSuccess = (payload) => ({
  type: GET_CURRENT_USER_LEAVE_STATS_SUCCESS,
  payload,
})

export const downloadLeaveBalanceReport = (payload) => ({
  type: DOWNLOAD_LEAVE_BALANCE_REPORT,
  payload,
})

export const downloadLeaveBalanceReportSucces = (payload) => ({
  type: DOWNLOAD_LEAVE_BALANCE_REPORT_SUCCESS,
  payload,
})

export const resetLeaveBalanceReport = (payload) => ({
  type: RESET_LEAVE_BALANCE_REPORT,
  payload,
})

export const getStaffUpcomingLeaves = (payload) => ({
  type: GET_STAFF_UPCOMING_LEAVES,
  payload,
})

export const getStaffUpcomingLeavesSuccess = (payload) => ({
  type: GET_STAFF_UPCOMING_LEAVES_SUCCESS,
  payload,
})

export const removeLeaveFromStaffUpcomingLeaves = (payload) => ({
  type: REMOVE_LEAVE_FROM_UPCOMING_LEAVE_LIST,
  payload,
})

export const searchStaff = (payload) => ({
  type: SEARCH_STAFF,
  payload,
})

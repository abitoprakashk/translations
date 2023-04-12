import produce from 'immer'
import {createTransducer} from '../../../../redux/helpers'
import {
  LEAVE_BASE_TYPE,
  UPCOMING_LEAVE_DURATION,
} from '../../LeaveManagement.constant'
import {dayDiffFromToday, isFutureDate} from '../../LeaveManagement.utils'
import {
  APPROVE_LEAVE,
  APPROVE_LEAVE_FAILURE,
  APPROVE_LEAVE_SUCCESS,
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
  GET_STAFF_HISTORY_SUCCESS,
  GET_STAFF_LEAVE_BALANCE,
  GET_STAFF_LEAVE_BALANCE_SUCCESS,
  GET_STAFF_LIST,
  GET_STAFF_LIST_SUCCESS,
  GET_STAFF_SELECTED_LEAVE_COUNT,
  GET_STAFF_SELECTED_LEAVE_COUNT_FAILURE,
  GET_STAFF_SELECTED_LEAVE_COUNT_SUCCESS,
  GET_TOTAL_LEAVE_STATS_SUCCESS,
  HIDE_ADD_LEAVE_POPUP,
  HIDE_APPROVE_MODAL,
  HIDE_LEAVE_BALANCE_UPDATE_FORM,
  HIDE_LEAVE_DETAILS_MODAL,
  HIDE_REJECT_MODAL,
  HIDE_STAFF_HISTORY_MODAL,
  REJECT_LEAVE,
  REJECT_LEAVE_FAILURE,
  REJECT_LEAVE_SUCCESS,
  RESET_DATA,
  RESET_SESSION_LEAVE_BALANCE_RESPONSE,
  SHOW_ADD_LEAVE_POPUP,
  SHOW_APPROVE_MODAL,
  SHOW_LEAVE_BALANCE_UPDATE_FORM,
  SHOW_LEAVE_DETAILS_MODAL,
  SHOW_REJECT_MODAL,
  SHOW_STAFF_HISTORY_MODAL,
  CREATE_LEAVE,
  REQUEST_LEAVE,
  CREATE_LEAVE_FAILURE,
  CREATE_LEAVE_SUCCESS,
  SUBMIT_SESSION_LEAVE_BALANCE,
  SUBMIT_SESSION_LEAVE_BALANCE_FAILURE,
  SUBMIT_SESSION_LEAVE_BALANCE_SUCCESS,
  TESTDATA_MUTATE,
  SHOW_REQUEST_LEAVE_POPUP,
  HIDE_REQUEST_LEAVE_POPUP,
  REQUEST_LEAVE_SUCCESS,
  REQUEST_LEAVE_FAILURE,
  GET_CURRENT_USER_LEAVE_STATS,
  GET_CURRENT_USER_LEAVE_STATS_SUCCESS,
  SHOW_CANCEL_MODAL,
  HIDE_CANCEL_MODAL,
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
import {
  addLeavesToDraft,
  addLeaveToDraft,
  addOrUpdateLeaveToDraft,
  LEAVE_SORT,
  OPERATION_TYPE,
  removeLeaveFromDraft,
  sortLeaveInDraft,
} from './helper'

const PENDING_LEAVES = 'pendingLeaves'
const PAST_LEAVES = 'pastLeaves'
const UPCOMING_LEAVES = 'upcomingLeaves'

const INITIAL_STATE = {
  testData: 'qqq',
  loading: false,

  yearlyLeavesOfInstitute: {
    loading: false,
    // loading key was used as a anchor at leaveManagement initially
    // so need another var to track submit response progress
    submitting: false,
    submitSuccess: null,
    submitError: null,
    error: null,
    data: {
      balance: {},
      default: false,
    },
    showLeaveBalanceUpdateForm: false,
  },
  [PENDING_LEAVES]: {
    loading: false,
    error: null,
    data: null,
    maxSinglePageItems: 10,
    allLoaded: false,
    selectedItem: null,
    showApproveModal: false,
    showRejectModal: false,
    showDetailsModal: false,
    showCancelModal: false,
  },
  [PAST_LEAVES]: {
    loading: false,
    error: null,
    data: null,
    maxSinglePageItems: 10,
    allLoaded: false,
    selectedItem: null,
    showApproveModal: false,
    showRejectModal: false,
    showDetailsModal: false,
    showCancelModal: false,
  },
  leave: {
    showLeaveDetailsModal: false,
    selectedLeave: null,
    from: null,
    manage: null,
  },
  staffHistory: {
    staffData: null,
    showPopup: false,
    stats: null,
    leaveHistory: null,
    maxSinglePageItems: 10,
    allLoaded: false,
  },
  addLeave: {
    selectedStaff: null,
    selectedStaffBalance: null,
    showAddLeavePopup: false,
    request: false,
    edit: false,
    leaveData: null,
    loading: false,
    staffList: [],
    selectedLeaveCount: null,
  },
  [UPCOMING_LEAVES]: {
    loading: false,
    data: [],
    error: false,
    duration: null,
  },
  currentUserLeaveInfo: {
    loading: false,
    data: {},
    error: null,
  },
  report: {
    loading: false,
    data: null,
    error: false,
    duration: null,
  },
  search: {
    staffList: [],
    searchedIds: [],
    active: false,
  },
  totalLeaveStats: null,
}

const setTestData = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.testData = payload
    return draft
  })
}

const getleavebalance = (state) => {
  return produce(state, (draft) => {
    draft.yearlyLeavesOfInstitute.loading = true
    draft.yearlyLeavesOfInstitute.error = null
    draft.yearlyLeavesOfInstitute.data = {balance: {}, default: false}
    return draft
  })
}

const getLeaveBalanceSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.yearlyLeavesOfInstitute.loading = false
    draft.yearlyLeavesOfInstitute.error = null
    draft.yearlyLeavesOfInstitute.data = payload
    return draft
  })
}

const getLeaveBalanceFailure = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.yearlyLeavesOfInstitute.loading = false
    draft.yearlyLeavesOfInstitute.error = payload
    draft.yearlyLeavesOfInstitute.data = null
    return draft
  })
}

const submitSessionLeaves = (state) => {
  return produce(state, (draft) => {
    draft.yearlyLeavesOfInstitute.submitting = true
    draft.yearlyLeavesOfInstitute.submitError = null
    draft.yearlyLeavesOfInstitute.submitSuccess = null
    return draft
  })
}

const submitSessionLeavesSuccess = (state) => {
  return produce(state, (draft) => {
    draft.yearlyLeavesOfInstitute.submitting = false
    draft.yearlyLeavesOfInstitute.submitError = null
    draft.yearlyLeavesOfInstitute.submitSuccess = true
  })
}

const submitSessionLeavesFailure = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.yearlyLeavesOfInstitute.submitting = false
    draft.yearlyLeavesOfInstitute.submitError = payload
    draft.yearlyLeavesOfInstitute.submitSuccess = null
  })
}

const resetSessionLeaveResponse = (state) => {
  return produce(state, (draft) => {
    draft.yearlyLeavesOfInstitute.submitting = false
    draft.yearlyLeavesOfInstitute.submitError = null
    draft.yearlyLeavesOfInstitute.submitSuccess = null
  })
}

const changeLeaveUpdateBalanceView = (state, {payload}) =>
  produce(state, (draft) => {
    draft.yearlyLeavesOfInstitute.showLeaveBalanceUpdateForm = Boolean(payload)
  })

const getPendingLeaves = (state) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.loading = true
    draft.pendingLeaves.error = null
    return draft
  })
}
const getPendingLeavesSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.pendingLeaves = {
      ...draft.pendingLeaves,
      loading: false,
      error: null,
      allLoaded: payload.length !== draft.pendingLeaves.maxSinglePageItems,
    }

    addLeavesToDraft(draft, payload, {
      key: PENDING_LEAVES,
      operation: OPERATION_TYPE.PUSH,
    })
    return draft
  })
}

const getPendingLeavesFailure = (state) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.loading = false
    if (!draft.pendingLeaves.data?.length) {
      draft.pendingLeaves.error = true
    } else {
      draft.pendingLeaves.error = false
    }
    return draft
  })
}

const resetPendingLeaves = (state) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.loading = false
    draft.pendingLeaves.error = null
    draft.pendingLeaves.data = null
    draft.pendingLeaves.allLoaded = false
    return draft
  })
}

const getPastLeaves = (state) => {
  return produce(state, (draft) => {
    draft.pastLeaves.loading = true
    return draft
  })
}
const getPastLeavesSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.pastLeaves = {
      ...draft.pastLeaves,
      loading: false,
      error: null,
      allLoaded: payload.length !== draft.pastLeaves.maxSinglePageItems,
    }

    addLeavesToDraft(draft, payload, {
      key: PAST_LEAVES,
      operation: OPERATION_TYPE.PUSH,
    })
    return draft
  })
}
const getPastLeavesFailure = (state) => {
  return produce(state, (draft) => {
    draft.pastLeaves.loading = false
    if (!draft.pastLeaves.data?.length) {
      draft.pastLeaves.error = true
    } else {
      draft.pastLeaves.error = false
    }
    return draft
  })
}
const resetPastLeaves = (state) => {
  return produce(state, (draft) => {
    draft.pastLeaves.loading = false
    draft.pastLeaves.error = null
    draft.pastLeaves.data = null
    draft.pastLeaves.allLoaded = false
    return draft
  })
}

const showApproveModal = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showApproveModal = true
    draft.pendingLeaves.selectedItem = payload
    return draft
  })
}
const showRejectModal = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showRejectModal = true
    draft.pendingLeaves.selectedItem = payload
    return draft
  })
}
const hideApproveModal = (state) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showApproveModal = false
    draft.pendingLeaves.selectedItem = null
    return draft
  })
}
const hideRejectModal = (state) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showRejectModal = false
    draft.pendingLeaves.selectedItem = null
    return draft
  })
}
const showCancelModal = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showCancelModal = true
    draft.pendingLeaves.selectedItem = payload
    return draft
  })
}
const hideCancelModal = (state) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showCancelModal = false
    draft.pendingLeaves.selectedItem = null
    return draft
  })
}
const approveLeave = (state) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showApproveModal = false
    return draft
  })
}

const addUpcomingLeaves = (draft, leave) => {
  const dayDiff = dayDiffFromToday(leave.leaveDates.from)
  const duration = draft[UPCOMING_LEAVES].duration
  const {TODAY, THIS_WEEK, THIS_MONTH} = UPCOMING_LEAVE_DURATION
  if (
    (duration == TODAY.value && dayDiff == 0) ||
    (duration == THIS_WEEK.value && dayDiff < 7) ||
    (duration == THIS_MONTH.value && dayDiff < 30)
  )
    addLeaveToDraft(draft, leave, {key: UPCOMING_LEAVES})
}

const sortUpcomingLeaves = (draft) => {
  sortLeaveInDraft(draft, {
    key: UPCOMING_LEAVES,
    sortKey: 'name',
    sortType: LEAVE_SORT.TYPE.STRING,
  })
  if (draft[UPCOMING_LEAVES].duration != UPCOMING_LEAVE_DURATION.TODAY) {
    sortLeaveInDraft(draft, {
      key: UPCOMING_LEAVES,
      sortKey: 'from_date',
      sortType: LEAVE_SORT.TYPE.NUMBER,
    })
  }
}

const approveLeaveSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showApproveModal = false

    const leave = payload[0]
    const {CREATED, REQUESTED, APPROVED} = LEAVE_BASE_TYPE

    if (leave && leave.status) {
      removeLeaveFromDraft(draft, leave, {key: PENDING_LEAVES})

      addOrUpdateLeaveToDraft(draft, leave, {
        key: PAST_LEAVES,
        operation: OPERATION_TYPE.PREPEND,
      })

      // for upcoming leaves handling
      const isFuture = isFutureDate(leave.leaveDates?.from)
      if (isFuture && [CREATED, REQUESTED, APPROVED].includes(leave.status)) {
        addUpcomingLeaves(draft, leave)
        sortUpcomingLeaves(draft)
      }
    }

    draft.pendingLeaves.selectedItem = null

    return draft
  })
}
const approveLeaveFailure = (state) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showApproveModal = false
    draft.pendingLeaves.selectedItem = null
    return draft
  })
}

const rejectLeave = (state) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showRejectModal = false
    return draft
  })
}
const rejectLeaveSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showRejectModal = false

    removeLeaveFromDraft(draft, payload[0], {key: PENDING_LEAVES})
    removeLeaveFromDraft(draft, payload[0], {key: UPCOMING_LEAVES})

    addOrUpdateLeaveToDraft(draft, payload[0], {
      key: PAST_LEAVES,
      operation: OPERATION_TYPE.PREPEND,
    })

    draft.pendingLeaves.selectedItem = null

    return draft
  })
}
const rejectLeaveFailure = (state) => {
  return produce(state, (draft) => {
    draft.pendingLeaves.showRejectModal = false
    draft.pendingLeaves.selectedItem = null
    return draft
  })
}
const showStaffHistoryModal = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.staffHistory.staffData = payload
    draft.staffHistory.showPopup = true
    return draft
  })
}
const hideStaffHistoryModal = (state) => {
  return produce(state, (draft) => {
    draft.staffHistory = {
      staffData: null,
      showPopup: false,
      stats: null,
      leaveHistory: null,
      maxSinglePageItems: 10,
      allLoaded: false,
      apiErrorMsg: null,
    }
    return draft
  })
}
const getStaffHistory = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.staffHistory.loading = !payload?.u
    return draft
  })
}

const getStaffHistorySuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    const {stats, leaveHistory} = payload
    draft.staffHistory.loading = false
    let newStats = {}
    Object.keys(stats)
      .reverse()
      .map((key) => {
        if (stats[key]) {
          newStats[key] = stats[key]
        }
      })
    draft.staffHistory.stats = newStats
    draft.staffHistory.leaveHistory = draft.staffHistory.leaveHistory
      ? [...draft.staffHistory.leaveHistory, ...leaveHistory]
      : leaveHistory
    draft.staffHistory.allLoaded =
      leaveHistory.length !== draft.staffHistory.maxSinglePageItems

    return draft
  })
}

const showStaffDetailsModal = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.leave.selectedLeave = payload?.item
    draft.leave.showLeaveDetailsModal = true
    draft.leave.from = payload.from
    draft.leave.manage = payload.manage
    return draft
  })
}
const hideStaffDetailsModal = (state) => {
  return produce(state, (draft) => {
    draft.leave.selectedLeave = null
    draft.leave.showLeaveDetailsModal = false
    draft.leave.from = null
    draft.leave.manage = null
    return draft
  })
}
const showRequestLeavePopup = (state, {payload: {staff}}) => {
  return manageLeavePopup(state, {staff: staff, request: true})
}
const hideRequestLeavePopup = (state) => {
  return hideLeavePopup(state, {request: false})
}
const showEditLeavePopup = (state, {payload: {leave, request}}) => {
  return manageLeavePopup(state, {
    staff: leave,
    leave,
    edit: true,
    request,
  })
}
const hideEditLeavePopup = (state) => {
  return hideLeavePopup(state, {edit: false})
}
const showAddLeavePopup = (state, {payload: {staff}}) => {
  return manageLeavePopup(state, {staff: staff})
}
const hideAddLeavePopup = (state) => {
  return hideLeavePopup(state)
}
const manageLeavePopup = (
  state,
  {staff = null, leave = null, request = false, edit = false}
) => {
  return produce(state, (draft) => {
    draft.addLeave = {
      ...draft.addLeave,
      selectedStaff: staff || null,
      showAddLeavePopup: true,
      request: request,
      edit: edit,
      leaveData: leave,
      loading: false,
      selectedStaffBalance: null,
      selectedLeaveCount: null,
      apiErrorMsg: null,
    }
    return draft
  })
}

const hideLeavePopup = (state) => {
  return produce(state, (draft) => {
    draft.addLeave = {
      ...draft.addLeave,
      selectedStaff: null,
      showAddLeavePopup: false,
      request: false,
      edit: false,
      leaveData: null,
      loading: false,
      selectedStaffBalance: null,
      selectedLeaveCount: null,
      apiErrorMsg: null,
    }
    return draft
  })
}
const getStaffList = (state) => {
  return produce(state, (draft) => {
    draft.addLeave.loading = true
    return draft
  })
}

const getStaffListSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.addLeave.loading = false
    draft.addLeave.staffList = payload
    draft.search.staffList = payload
    return draft
  })
}

const getStaffLeaveBalance = (state) => {
  return produce(state, (draft) => {
    draft.addLeave.loading = true
    return draft
  })
}
const getStaffLeaveBalanceSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.addLeave.loading = false
    draft.addLeave.selectedStaffBalance = payload
    return draft
  })
}
const getSelectedLeaveCount = (state) => {
  return produce(state, (draft) => {
    draft.addLeave.loading = true
    return draft
  })
}
const getSelectedLeaveCountSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.addLeave.loading = false
    draft.addLeave.selectedLeaveCount = payload?.no_of_days
    return draft
  })
}
const getSelectedLeaveCountFailure = (state) => {
  return produce(state, (draft) => {
    draft.addLeave.loading = false
    draft.addLeave.selectedLeaveCount = null
    return draft
  })
}
const createLeave = (state) => {
  return produce(state, (draft) => {
    draft.addLeave.loading = true
    draft.addLeave.apiErrorMsg = null
    return draft
  })
}

const createLeaveSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.addLeave = {
      ...draft.addLeave,
      selectedStaff: null,
      showAddLeavePopup: false,
      request: false,
      loading: false,
      selectedStaffBalance: null,
      selectedLeaveCount: null,
      apiErrorMsg: null,
    }

    const leave = payload[0]
    const {CREATED, APPROVED, REQUESTED} = LEAVE_BASE_TYPE

    if (leave && leave.status) {
      if (leave.status === CREATED)
        addLeaveToDraft(draft, leave, {
          key: PAST_LEAVES,
          operation: OPERATION_TYPE.PREPEND,
        })

      // for upcoming leaves handling
      const isFuture = isFutureDate(leave.leaveDates.from)
      if (isFuture && [CREATED, REQUESTED, APPROVED].includes(leave.status)) {
        addUpcomingLeaves(draft, leave)
        sortUpcomingLeaves(draft)
      }
    }
  })
}
const createLeaveFailure = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.addLeave.loading = false
    draft.addLeave.apiErrorMsg = payload?.msg
    return draft
  })
}

const requestLeave = createLeave

const requestLeaveSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.addLeave = {
      ...draft.addLeave,
      selectedStaff: null,
      showAddLeavePopup: false,
      request: false,
      loading: false,
      selectedStaffBalance: null,
      selectedLeaveCount: null,
      apiErrorMsg: null,
    }

    const leave = payload[0]
    const {CREATED, REQUESTED, APPROVED} = LEAVE_BASE_TYPE

    if (leave && leave.status) {
      if (leave.status === REQUESTED)
        addLeaveToDraft(draft, leave, {
          key: PENDING_LEAVES,
          operation: OPERATION_TYPE.PREPEND,
        })

      const isFuture = isFutureDate(leave.leaveDates.from)

      if (!isFuture || leave.status === CREATED)
        addLeaveToDraft(draft, leave, {
          key: PAST_LEAVES,
          operation: OPERATION_TYPE.PREPEND,
        })

      // for upcoming leaves handling
      if (isFuture && [CREATED, REQUESTED, APPROVED].includes(leave.status)) {
        addUpcomingLeaves(draft, leave)
        sortUpcomingLeaves(draft)
      }
    }
  })
}

const requestLeaveFailure = createLeaveFailure

const editLeave = createLeave

const editLeaveSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.addLeave = {
      ...draft.addLeave,
      selectedStaff: null,
      showAddLeavePopup: false,
      request: false,
      edit: false,
      leaveData: null,
      loading: false,
      selectedStaffBalance: null,
      selectedLeaveCount: null,
      apiErrorMsg: null,
    }

    const leave = payload[0]
    const {CREATED, REQUESTED, APPROVED} = LEAVE_BASE_TYPE

    if (leave && leave.status) {
      removeLeaveFromDraft(draft, leave, {key: PENDING_LEAVES})
      removeLeaveFromDraft(draft, leave, {key: PAST_LEAVES})
      removeLeaveFromDraft(draft, leave, {key: UPCOMING_LEAVES})

      if (leave.status === REQUESTED)
        addLeaveToDraft(draft, leave, {
          key: PENDING_LEAVES,
          operation: OPERATION_TYPE.PREPEND,
        })

      const isFuture = isFutureDate(leave.leaveDates.from)

      if (!isFuture || leave.status === CREATED)
        addLeaveToDraft(draft, leave, {
          key: PAST_LEAVES,
          operation: OPERATION_TYPE.PREPEND,
        })

      // for upcoming leaves handling
      if (isFuture && [CREATED, REQUESTED, APPROVED].includes(leave.status)) {
        addUpcomingLeaves(draft, leave)
        sortUpcomingLeaves(draft)
      }
    }
  })
}

const editLeaveFailure = createLeaveFailure

const cancelLeaveSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    removeLeaveFromDraft(draft, payload[0], {key: PENDING_LEAVES})
    removeLeaveFromDraft(draft, payload[0], {key: UPCOMING_LEAVES})

    addOrUpdateLeaveToDraft(draft, payload[0], {
      key: PAST_LEAVES,
      operation: OPERATION_TYPE.PREPEND,
    })

    return draft
  })
}

const getTotalLeaveStatsSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.totalLeaveStats = payload
    return draft
  })
}

const getCurrentUserLeaveStats = (state) => {
  return produce(state, (draft) => {
    draft.currentUserLeaveInfo.loading = true
    return draft
  })
}

const getCurrentUserLeaveStatsSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.currentUserLeaveInfo.loading = false
    draft.currentUserLeaveInfo.data = payload
    return draft
  })
}

const cancelLeaveByStaffSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    removeLeaveFromDraft(draft, payload[0], {key: PENDING_LEAVES})
    removeLeaveFromDraft(draft, payload[0], {key: UPCOMING_LEAVES})

    addOrUpdateLeaveToDraft(draft, payload[0], {
      key: PAST_LEAVES,
      operation: OPERATION_TYPE.PREPEND,
    })

    return draft
  })
}

const downloadLeaveBalanceReport = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.report.loading = true
    draft.report.duration = payload.duration
    return draft
  })
}

const downloadLeaveBalanceReportSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.report.loading = false
    draft.report.data = payload
    draft.report.error = false
    return draft
  })
}

const resetLeaveBalanceReport = (state) => {
  return produce(state, (draft) => {
    draft.report.loading = false
    draft.report.data = null
    draft.report.error = false
    return draft
  })
}

const getStaffUpcomingLeaves = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.upcomingLeaves.loading = true
    draft.upcomingLeaves.duration = payload.duration
    return draft
  })
}

const getStaffUpcomingLeavesSuccess = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.upcomingLeaves.loading = false
    draft.upcomingLeaves.data = payload
    draft.upcomingLeaves.error = false
    return draft
  })
}

const removeLeaveFromStaffUpcomingList = (state, {payload}) => {
  return produce(state, (draft) => {
    removeLeaveFromDraft(draft, payload, {key: UPCOMING_LEAVES})
    return draft
  })
}

const searchStaff = (state, {payload}) => {
  return produce(state, (draft) => {
    if (payload.staffIds !== undefined)
      draft.search.searchedIds = payload.staffIds || []
    if (payload.active !== undefined)
      draft.search.active = payload.active || false
    return draft
  })
}

const resetData = (state) => {
  return produce(state, (draft) => {
    draft = INITIAL_STATE
    return draft
  })
}

const leaveManagementReducer = {
  [TESTDATA_MUTATE]: setTestData,
  [GET_LEAVE_BALANCE]: getleavebalance,
  [GET_LEAVE_BALANCE_SUCCESS]: getLeaveBalanceSuccess,
  [GET_LEAVE_BALANCE_FAILURE]: getLeaveBalanceFailure,
  [SUBMIT_SESSION_LEAVE_BALANCE]: submitSessionLeaves,
  [SUBMIT_SESSION_LEAVE_BALANCE_SUCCESS]: submitSessionLeavesSuccess,
  [SUBMIT_SESSION_LEAVE_BALANCE_FAILURE]: submitSessionLeavesFailure,
  [RESET_SESSION_LEAVE_BALANCE_RESPONSE]: resetSessionLeaveResponse,
  [GET_PENDING_LEAVES]: getPendingLeaves,
  [GET_PENDING_LEAVES_SUCCESS]: getPendingLeavesSuccess,
  [GET_PENDING_LEAVES_FAILURE]: getPendingLeavesFailure,
  [RESET_PENDING_LEAVES]: resetPendingLeaves,
  [GET_PAST_LEAVES]: getPastLeaves,
  [GET_PAST_LEAVES_SUCCESS]: getPastLeavesSuccess,
  [GET_PAST_LEAVES_FAILURE]: getPastLeavesFailure,
  [RESET_PAST_LEAVES]: resetPastLeaves,
  [SHOW_APPROVE_MODAL]: showApproveModal,
  [SHOW_REJECT_MODAL]: showRejectModal,
  [SHOW_CANCEL_MODAL]: showCancelModal,
  [HIDE_APPROVE_MODAL]: hideApproveModal,
  [HIDE_REJECT_MODAL]: hideRejectModal,
  [HIDE_CANCEL_MODAL]: hideCancelModal,
  [APPROVE_LEAVE]: approveLeave,
  [APPROVE_LEAVE_SUCCESS]: approveLeaveSuccess,
  [APPROVE_LEAVE_FAILURE]: approveLeaveFailure,
  [REJECT_LEAVE]: rejectLeave,
  [REJECT_LEAVE_SUCCESS]: rejectLeaveSuccess,
  [REJECT_LEAVE_FAILURE]: rejectLeaveFailure,
  [SHOW_STAFF_HISTORY_MODAL]: showStaffHistoryModal,
  [HIDE_STAFF_HISTORY_MODAL]: hideStaffHistoryModal,
  [GET_STAFF_HISTORY]: getStaffHistory,
  [GET_STAFF_HISTORY_SUCCESS]: getStaffHistorySuccess,
  [SHOW_LEAVE_DETAILS_MODAL]: showStaffDetailsModal,
  [HIDE_LEAVE_DETAILS_MODAL]: hideStaffDetailsModal,
  [SHOW_ADD_LEAVE_POPUP]: showAddLeavePopup,
  [HIDE_ADD_LEAVE_POPUP]: hideAddLeavePopup,
  [SHOW_REQUEST_LEAVE_POPUP]: showRequestLeavePopup,
  [HIDE_REQUEST_LEAVE_POPUP]: hideRequestLeavePopup,
  [SHOW_EDIT_LEAVE_POPUP]: showEditLeavePopup,
  [HIDE_EDIT_LEAVE_POPUP]: hideEditLeavePopup,
  [GET_STAFF_LIST]: getStaffList,
  [GET_STAFF_LIST_SUCCESS]: getStaffListSuccess,
  [GET_STAFF_LEAVE_BALANCE]: getStaffLeaveBalance,
  [GET_STAFF_LEAVE_BALANCE_SUCCESS]: getStaffLeaveBalanceSuccess,
  [GET_STAFF_SELECTED_LEAVE_COUNT]: getSelectedLeaveCount,
  [GET_STAFF_SELECTED_LEAVE_COUNT_SUCCESS]: getSelectedLeaveCountSuccess,
  [GET_STAFF_SELECTED_LEAVE_COUNT_FAILURE]: getSelectedLeaveCountFailure,
  [CREATE_LEAVE]: createLeave,
  [CREATE_LEAVE_FAILURE]: createLeaveFailure,
  [CREATE_LEAVE_SUCCESS]: createLeaveSuccess,
  [REQUEST_LEAVE]: requestLeave,
  [REQUEST_LEAVE_SUCCESS]: requestLeaveSuccess,
  [REQUEST_LEAVE_FAILURE]: requestLeaveFailure,
  [EDIT_LEAVE]: editLeave,
  [EDIT_LEAVE_SUCCESS]: editLeaveSuccess,
  [EDIT_LEAVE_FAILURE]: editLeaveFailure,
  [CANCEL_LEAVE_SUCCESS]: cancelLeaveSuccess,
  [CANCEL_LEAVE_BY_STAFF_SUCCESS]: cancelLeaveByStaffSuccess,
  [CANCEL_LEAVE_BY_STAFF_FAILURE]: hideCancelModal,
  [GET_TOTAL_LEAVE_STATS_SUCCESS]: getTotalLeaveStatsSuccess,
  [RESET_DATA]: resetData,
  [SHOW_LEAVE_BALANCE_UPDATE_FORM]: changeLeaveUpdateBalanceView,
  [HIDE_LEAVE_BALANCE_UPDATE_FORM]: changeLeaveUpdateBalanceView,
  [GET_CURRENT_USER_LEAVE_STATS]: getCurrentUserLeaveStats,
  [GET_CURRENT_USER_LEAVE_STATS_SUCCESS]: getCurrentUserLeaveStatsSuccess,
  [DOWNLOAD_LEAVE_BALANCE_REPORT]: downloadLeaveBalanceReport,
  [DOWNLOAD_LEAVE_BALANCE_REPORT_SUCCESS]: downloadLeaveBalanceReportSuccess,
  [RESET_LEAVE_BALANCE_REPORT]: resetLeaveBalanceReport,
  [GET_STAFF_UPCOMING_LEAVES]: getStaffUpcomingLeaves,
  [GET_STAFF_UPCOMING_LEAVES_SUCCESS]: getStaffUpcomingLeavesSuccess,
  [REMOVE_LEAVE_FROM_UPCOMING_LEAVE_LIST]: removeLeaveFromStaffUpcomingList,
  [SEARCH_STAFF]: searchStaff,
}

export default createTransducer(leaveManagementReducer, INITIAL_STATE)

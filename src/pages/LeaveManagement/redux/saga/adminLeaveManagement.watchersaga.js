import {all, call, put, select, takeEvery, takeLatest} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import {events} from '../../../../utils/EventsConstants'
import {
  updateLeaveStatusApi,
  getLeaveBalanceApi,
  getPastLeavesApi,
  getPendingLeavesApi,
  setLeaveBalanceApi,
  getStaffStatsApi,
  getStaffListApi,
  getStaffLeaveBalanceApi,
  getSelectedLeaveCountApi,
  createLeaveApi,
  getTotalLeaveStatsApi,
  requestLeaveApi,
  cancelLeaveStaffApi,
  downloadLeaveReportApi,
  getStaffUpcomingLeavesApi,
  editLeaveApi,
} from '../../apiService'
import {LEAVE_TYPE} from '../../LeaveManagement.constant'
import {normalizePendingLeaves} from '../../LeaveManagement.utils'
import {
  approveLeaveSuccess,
  cancelLeavefailure,
  cancelLeaveSuccess,
  gesStaffLeaveBalanceSuccess,
  getLeaveBalanceFailure,
  getLeaveBalanceSuccess,
  getPastLeavesFailure,
  getPastLeavesSuccess,
  getPendingLeavesFailure,
  getPendingLeavesSuccess,
  getSelectedLeaveCountFailure,
  getSelectedLeaveCountSuccess,
  getStaffHistorySuccess,
  getStaffListSuccess,
  getTotalLeaveStatsSuccess,
  hideLeaveBalanceUpdateForm,
  rejectLeaveSuccess,
  createLeaveFailure,
  createLeaveSuccess,
  submitSessionLeavesFailed,
  submitSessionLeavesSuccess,
  requestLeaveSuccess,
  requestLeaveFailure,
  getCurrentUserLeaveStatsSuccess,
  cancelLeaveByStaffSuccess,
  cancelLeaveByStafffailure,
  hideCancelModal,
  getStaffUpcomingLeavesSuccess,
  getCurrentUserLeaveStats,
  downloadLeaveBalanceReportSucces,
  resetLeaveBalanceReport,
  // removeLeaveFromStaffUpcomingLeaves,
  editLeaveSuccess,
  editLeaveFailure,
  getTotalLeaveStats,
} from '../actions/leaveManagement.actions'
import {
  APPROVE_LEAVE,
  CANCEL_LEAVE,
  GET_LEAVE_BALANCE,
  GET_PAST_LEAVES,
  GET_PENDING_LEAVES,
  GET_STAFF_HISTORY,
  GET_STAFF_LEAVE_BALANCE,
  GET_STAFF_LIST,
  GET_STAFF_SELECTED_LEAVE_COUNT,
  GET_TOTAL_LEAVE_STATS,
  REJECT_LEAVE,
  REQUEST_LEAVE,
  CREATE_LEAVE,
  SUBMIT_SESSION_LEAVE_BALANCE,
  GET_CURRENT_USER_LEAVE_STATS,
  CANCEL_LEAVE_BY_STAFF,
  DOWNLOAD_LEAVE_BALANCE_REPORT,
  GET_STAFF_UPCOMING_LEAVES,
  EDIT_LEAVE,
} from '../actiontypes'
const getRoleList = (state) => state.rolesList
const getEventManager = (state) => state.eventManager
const getCurrentUserIID = (state) => state.currentAdminInfo?.imember_id

function* getLeaveBalancesaga() {
  try {
    const res = yield call(getLeaveBalanceApi)
    if (res.status) {
      yield put(getLeaveBalanceSuccess(res.obj))
    } else {
      yield put(getLeaveBalanceFailure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* submitSessionLeaves(action) {
  try {
    const res = yield call(setLeaveBalanceApi, action.payload)
    if (res.status) {
      // yield put(getLeaveBalance())
      yield put(hideLeaveBalanceUpdateForm())
      yield put(submitSessionLeavesSuccess())
      // yield put(showSuccessToast('Leave balance added Successfully'))
    } else {
      yield put(submitSessionLeavesFailed(res))
      // yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(
      submitSessionLeavesFailed({
        msg: 'Something went wrong, please check your network',
      })
    )
    // yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getPendingLeaves(action) {
  try {
    const res = yield call(getPendingLeavesApi, action.payload)
    if (res.status) {
      let rolesList = yield select(getRoleList)
      res.obj = normalizePendingLeaves(res.obj, rolesList)
      yield put(getPendingLeavesSuccess(res.obj))
    } else {
      yield put(showErrorToast(res.msg || 'Something went wrong'))
      yield put(getPendingLeavesFailure())
    }
  } catch (error) {
    yield put(getPendingLeavesFailure())
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}
function* getPastLeaves(action) {
  try {
    const res = yield call(getPastLeavesApi, action.payload)
    if (res.status) {
      let rolesList = yield select(getRoleList)
      res.obj = normalizePendingLeaves(res.obj, rolesList)
      yield put(getPastLeavesSuccess(res.obj))
    } else {
      yield put(showErrorToast(res.msg || 'Something went wrong'))
      yield put(getPastLeavesFailure())
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
    yield put(getPastLeavesFailure())
  }
}
function* approveLeaveRequest() {
  try {
    const getSelectedItem = (state) => {
      return state.leaveManagement?.pendingLeaves?.selectedItem
    }
    const selectedItem = yield select(getSelectedItem)
    const res = yield call(updateLeaveStatusApi, {
      status: 'APPROVED',
      request_id: selectedItem?._id,
    })
    if (res.status) {
      let rolesList = yield select(getRoleList)
      res.obj = normalizePendingLeaves([res.obj], rolesList)
      yield put(approveLeaveSuccess(res.obj))
      yield put(showSuccessToast('Leave Approved Successfully'))
    } else {
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* rejectLeaveRequest() {
  try {
    const getSelectedItem = (state) => {
      return state.leaveManagement?.pendingLeaves?.selectedItem
    }
    const selectedItem = yield select(getSelectedItem)
    const res = yield call(updateLeaveStatusApi, {
      status: 'REJECTED',
      request_id: selectedItem?._id,
    })

    if (res.status) {
      let rolesList = yield select(getRoleList)
      res.obj = normalizePendingLeaves([res.obj], rolesList)
      yield put(rejectLeaveSuccess(res.obj))
      // yield put(removeLeaveFromStaffUpcomingLeaves(res.obj[0]))
      yield put(showSuccessToast('Leave rejected Successfully'))
    } else {
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getStaffHistory(action) {
  try {
    const {stats, history} = yield all({
      stats: call(getStaffStatsApi, action.payload?.iid),
      history: call(getPastLeavesApi, action.payload),
    })
    if (stats.status || history.status) {
      let rolesList = yield select(getRoleList)
      history.obj = normalizePendingLeaves(history.obj, rolesList)
      yield put(
        getStaffHistorySuccess({stats: stats.obj, leaveHistory: history.obj})
      )
    } else {
      yield put(showErrorToast('Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getStaffList() {
  try {
    const res = yield call(getStaffListApi)
    if (res.status) {
      yield put(getStaffListSuccess(res.obj))
    } else {
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getStaffLeaveBalance(action) {
  try {
    const res = yield call(getStaffLeaveBalanceApi, action.payload?.iid)
    if (res.status) {
      yield put(gesStaffLeaveBalanceSuccess(res.obj))
    } else {
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getStaffSelectedLeaveCount(action) {
  try {
    const res = yield call(getSelectedLeaveCountApi, action.payload)
    if (res.status) {
      yield put(getSelectedLeaveCountSuccess(res.obj))
    } else {
      yield put(showErrorToast(res.msg || 'Something went wrong'))
      yield put(getSelectedLeaveCountFailure())
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* createLeaveRequest({payload}) {
  try {
    const {screen, ...rest} = payload
    const res = yield call(createLeaveApi, rest)
    if (res.status) {
      let rolesList = yield select(getRoleList)
      res.obj = normalizePendingLeaves([res.obj], rolesList)
      yield put(createLeaveSuccess(res.obj))
      yield put(showSuccessToast(`Leave added successfully`))
      let eventManager = yield select(getEventManager)
      if (eventManager) {
        eventManager.send_event(events.LEAVE_ADDED_TFI, {
          employee_id: payload?.iid,
          leave_type: payload?.type,
          date_from: payload?.from,
          date_to: payload?.to,
          no_of_leaves: payload.no_of_days,
          employee_type: res.obj[0]?.rollName,
          start_date_duration_type: payload.from_slot,
          end_date_duration_type: payload.to_slot,
          screen,
        })
      }
    } else {
      yield put(createLeaveFailure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* requestLeaveRequest({payload}) {
  try {
    const res = yield call(requestLeaveApi, payload)
    if (res.status) {
      let rolesList = yield select(getRoleList)
      res.obj = normalizePendingLeaves([res.obj], rolesList)
      yield put(requestLeaveSuccess(res.obj))
      const iid = yield select(getCurrentUserIID)
      yield put(getTotalLeaveStats({iid}))
      yield put(getCurrentUserLeaveStats({iid}))
      yield put(
        showSuccessToast(
          `Leave ${
            res.obj[0]?.status == LEAVE_TYPE.CREATED ? 'added' : 'requested'
          } successfully`
        )
      )
      let eventManager = yield select(getEventManager)
      if (eventManager) {
        eventManager.send_event(events.LEAVE_REQUESTED_TFI, {
          employee_id: payload?.iid,
          leave_type: payload?.type,
          date_from: payload?.from,
          date_to: payload?.to,
          no_of_leaves: payload.no_of_days,
          employee_type: res.obj[0]?.rollName,
          start_date_duration_type: payload.from_slot,
          end_date_duration_type: payload.to_slot,
        })
      }
    } else {
      yield put(requestLeaveFailure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* editLeaveRequest({payload}) {
  try {
    const res = yield call(editLeaveApi, payload)
    if (res.status) {
      let rolesList = yield select(getRoleList)
      res.obj = normalizePendingLeaves([res.obj], rolesList)
      yield put(editLeaveSuccess(res.obj))
      if (payload.self) {
        const iid = yield select(getCurrentUserIID)
        yield put(getCurrentUserLeaveStats({iid}))
      }
      let eventManager = yield select(getEventManager)
      if (eventManager) {
        eventManager.send_event(events.LEAVE_EDITED_TFI, {
          employee_id: payload?.iid,
          leave_type: payload?.type,
          date_from: payload?.from,
          date_to: payload?.to,
          no_of_leaves: payload.no_of_days,
          employee_type: res.obj[0]?.rollName,
          start_date_duration_type: payload.from_slot,
          end_date_duration_type: payload.to_slot,
        })
      }
      yield put(showSuccessToast(`Leave updated successfully`))
    } else {
      yield put(editLeaveFailure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* cancelLeave({payload}) {
  try {
    const res = yield call(updateLeaveStatusApi, {
      status: 'CANCELED',
      request_id: payload?._id,
    })
    if (res.status) {
      res.obj = normalizePendingLeaves([res.obj])
      yield put(cancelLeaveSuccess(res.obj))
      // yield put(removeLeaveFromStaffUpcomingLeaves(res.obj[0]))
      yield put(showSuccessToast('Leave cancelled Successfully'))
      let eventManager = yield select(getEventManager)
      if (eventManager) {
        eventManager.send_event(events.LEAVE_CANCELED_TFI)
      }
    } else {
      yield put(cancelLeavefailure(payload))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
    yield put(cancelLeavefailure(payload))
  } finally {
    yield put(hideCancelModal())
  }
}

function* cancelLeaveByStaff({payload}) {
  try {
    const iid = yield select(getCurrentUserIID)
    const res = yield call(cancelLeaveStaffApi, {
      request_id: payload?._id,
      iid,
    })
    if (res.status) {
      res.obj = normalizePendingLeaves([res.obj])
      yield put(cancelLeaveByStaffSuccess(res.obj))
      yield put(getCurrentUserLeaveStats({iid}))
      // yield put(removeLeaveFromStaffUpcomingLeaves(res.obj[0]))
      yield put(showSuccessToast('Leave cancelled Successfully'))
      let eventManager = yield select(getEventManager)
      if (eventManager) {
        eventManager.send_event(events.LEAVE_REQUEST_CANCEL_TFI)
      }
    } else {
      yield put(cancelLeaveByStafffailure(payload))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
    yield put(cancelLeaveByStafffailure(payload))
  } finally {
    yield put(hideCancelModal())
  }
}

function* totalLeaveStats({payload}) {
  try {
    const res = yield call(getTotalLeaveStatsApi, payload?.iid)
    if (res.status) {
      yield put(getTotalLeaveStatsSuccess(res.obj))
    } else {
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getCurrentUserLeave({payload}) {
  try {
    const res = yield call(getStaffStatsApi, payload.iid)
    if (res.status) {
      yield put(getCurrentUserLeaveStatsSuccess(res.obj))
    } else {
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getStaffUpcomingLeave({payload}) {
  try {
    const res = yield call(getStaffUpcomingLeavesApi, payload)
    if (res.status) {
      let rolesList = yield select(getRoleList)
      const normalizedLeave = normalizePendingLeaves(res.obj, rolesList)
      yield put(getStaffUpcomingLeavesSuccess(normalizedLeave))
    } else {
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* downloadLeaveBalanceReport({payload}) {
  try {
    const res = yield call(downloadLeaveReportApi, payload)
    if (res.status) {
      yield put(downloadLeaveBalanceReportSucces(res.obj))
    } else {
      yield put(resetLeaveBalanceReport())
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(resetLeaveBalanceReport())
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchLeaveManagemetSaga() {
  yield takeEvery(GET_LEAVE_BALANCE, getLeaveBalancesaga)
  yield takeEvery(SUBMIT_SESSION_LEAVE_BALANCE, submitSessionLeaves)
  yield takeEvery(GET_PENDING_LEAVES, getPendingLeaves)
  yield takeEvery(GET_PAST_LEAVES, getPastLeaves)
  yield takeLatest(APPROVE_LEAVE, approveLeaveRequest)
  yield takeLatest(REJECT_LEAVE, rejectLeaveRequest)
  yield takeLatest(GET_STAFF_HISTORY, getStaffHistory)
  yield takeLatest(GET_STAFF_LIST, getStaffList)
  yield takeLatest(GET_STAFF_LEAVE_BALANCE, getStaffLeaveBalance)
  yield takeLatest(GET_STAFF_SELECTED_LEAVE_COUNT, getStaffSelectedLeaveCount)
  yield takeLatest(CREATE_LEAVE, createLeaveRequest)
  yield takeLatest(REQUEST_LEAVE, requestLeaveRequest)
  yield takeLatest(EDIT_LEAVE, editLeaveRequest)
  yield takeLatest(CANCEL_LEAVE, cancelLeave)
  yield takeLatest(CANCEL_LEAVE_BY_STAFF, cancelLeaveByStaff)
  yield takeLatest(GET_TOTAL_LEAVE_STATS, totalLeaveStats)
  yield takeLatest(GET_CURRENT_USER_LEAVE_STATS, getCurrentUserLeave)
  yield takeLatest(DOWNLOAD_LEAVE_BALANCE_REPORT, downloadLeaveBalanceReport)
  yield takeLatest(GET_STAFF_UPCOMING_LEAVES, getStaffUpcomingLeave)
}

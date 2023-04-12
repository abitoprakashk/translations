import {call, put, select, takeEvery, takeLatest} from 'redux-saga/effects'
import {Trans} from 'react-i18next'
import * as Api from '../../apiService'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../../redux/actions/commonAction'
import {
  FETCH_LEAVE_DETAILS,
  GET_STAFF_ATTENDANCE,
  StaffAttendanceActionType,
} from '../actionTypes'
import {events} from '../../../../../../utils/EventsConstants'
import {
  getPastLeavesApi,
  getPendingLeavesApi,
} from '../../../../../../pages/LeaveManagement/apiService'
import {
  fetchLeaveDetailsFailed,
  fetchLeaveDetailsSuccess,
  syncStaffAttendance,
} from '../actions/StaffAttendanceActions'
import {normalizePendingLeaves} from '../../../../../../pages/LeaveManagement/LeaveManagement.utils'
import {LEAVE_SHIFT_TYPE} from '../../../../../../pages/LeaveManagement/LeaveManagement.constant'
import globalActions from '../../../../../../redux/actions/global.actions'
import {t} from 'i18next'

// Get Event Manager
const getEventManager = (state) => state.eventManager

// Messages translation
const somethingWentWrongPleaseCheckYourNetwork = (
  <Trans i18nKey={'fetchPostsListErrorToast'}>
    Something went wrong, please check your network
  </Trans>
)
const attendanceSavedSuccessfullyMessage = (
  <Trans i18nKey={'attendanceSavedSuccessfully'}>
    Attendance saved successfully
  </Trans>
)
const attendanceSavedFailed = (
  <Trans i18nKey={'attendanceFailedMarked'}>Attendance saved failed</Trans>
)

// Fetch Staff List Data
function* fetchStaffList() {
  try {
    const res = yield call(Api.getStaffList)
    yield put({
      type: StaffAttendanceActionType.STAFF_LIST_GET_SUCCEEDED,
      payload: res.status ? res.obj : [],
    })
    if (!res.status) {
      yield put({
        type: StaffAttendanceActionType.STAFF_LIST_GET_FAILED,
        payload: res.msg,
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put({
      type: StaffAttendanceActionType.STAFF_LIST_GET_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

// Submit Staff Attendance Data
function* submitStaffAttendance(action) {
  const {date, info} = action.payload

  try {
    const res = yield call(Api.submitStaffAttendance, {date: date, info})
    if (res.status === true) {
      yield put({
        type: StaffAttendanceActionType.STAFF_ATTENDANCE_SUBMIT_SUCCEEDED,
        payload: attendanceSavedSuccessfullyMessage,
      })
      yield put({
        type: StaffAttendanceActionType.GET_STAFF_ATTENDANCE_LIST,
        payload: {from_date: date, to_date: date},
      })
      yield put(showSuccessToast(attendanceSavedSuccessfullyMessage))
      let eventManager = yield select(getEventManager)
      if (eventManager) {
        eventManager.send_event(events.STAFF_ATTENDANCE_SAVED_TFI, {
          attendance_date: date,
        })
      }
    } else {
      yield put({
        type: StaffAttendanceActionType.STAFF_ATTENDANCE_SUBMIT_FAILED,
        payload: attendanceSavedFailed,
      })
      yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
    }
  } catch (error) {
    yield put({
      type: StaffAttendanceActionType.STAFF_ATTENDANCE_SUBMIT_FAILED,
      payload: error.message,
    })
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

// Fetch Staff Attendance Users Data
function* fetchStaffAttendanceList(action) {
  try {
    const res = yield call(Api.getStaffAttendanceList, action.payload)
    yield put({
      type: StaffAttendanceActionType.STAFF_ATTENDANCE_LIST_GET_SUCCEEDED,
      payload: res.status ? res.obj : {},
    })
    if (!res.status) {
      yield put({
        type: StaffAttendanceActionType.STAFF_ATTENDANCE_LIST_GET_FAILED,
        payload: res.msg,
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put({
      type: StaffAttendanceActionType.STAFF_ATTENDANCE_LIST_GET_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

// Staff Attendance download report
function* fetchStaffAttendanceDownloadReport(action) {
  try {
    const res = yield call(Api.getStaffAttendanceDownloadReport, action.payload)
    if (res.status === true) {
      yield put({
        type: StaffAttendanceActionType.STAFF_ATTENDANCE_DOWNLOAD_REPORT_SUCCESSDED,
        payload: res.status ? res.obj : [],
      })
    } else {
      yield put({
        type: StaffAttendanceActionType.STAFF_ATTENDANCE_DOWNLOAD_REPORT_FAILED,
        payload: res.msg,
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put({
      type: StaffAttendanceActionType.STAFF_ATTENDANCE_DOWNLOAD_REPORT_FAILED,
      payload: error.message,
    })
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

function* fetchLeaveDetails(action) {
  try {
    const {pending, count, _ids} = action.payload
    const res = yield call(pending ? getPendingLeavesApi : getPastLeavesApi, {
      count,
      _ids,
    })
    if (res.status === true) {
      res.obj = normalizePendingLeaves(res.obj, [])
      if (pending && res.obj.length == 2) {
        // means there are two leaves pending, pick first pending leave on timeline
        const [firstLeave, secondLeave] = res.obj
        if (firstLeave.to < secondLeave.from)
          yield put(fetchLeaveDetailsSuccess(firstLeave))
        else if (firstLeave.to > secondLeave.from)
          yield put(fetchLeaveDetailsSuccess(secondLeave))
        else {
          // same day leave
          if (firstLeave.to_slot === LEAVE_SHIFT_TYPE.FIRST_HALF)
            yield put(fetchLeaveDetailsSuccess(firstLeave))
          else yield put(fetchLeaveDetailsSuccess(secondLeave))
        }
      } else yield put(fetchLeaveDetailsSuccess(res.obj[0]))
    } else {
      yield put(fetchLeaveDetailsFailed())
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put(fetchLeaveDetailsFailed())
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

function* getAndSyncStaffAttendance(action) {
  try {
    const res = yield call(Api.getStaffAttendance, action.payload)
    if (res.status === true) {
      yield put(syncStaffAttendance(res.obj || {}))
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

function* fetchAttendanceRequests({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchAttendanceRequests, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchAttendanceRequests.success(response?.data?.obj)
      )
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchAttendanceRequests.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* resolveAttendanceRequest({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.resolveAttendanceRequest, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.resolveAttendanceRequest.success(response?.data?.obj)
      )
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.resolveAttendanceRequest.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* fetchStaffAttendanceSummary({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchStaffAttendanceSummary)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchStaffAttendanceSummary.success(response?.data?.obj)
      )
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchStaffAttendanceSummary.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* fetchNonTeachingStaffAttendance({
  data,
  successAction,
  failureAction,
}) {
  try {
    const response = yield call(Api.fetchNonTeachingStaffAttendance, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchNonTeachingStaffAttendance.success(
          response?.data?.obj
        )
      )
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchNonTeachingStaffAttendance.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* updateStaffAttendanceForm(payload) {
  try {
    const {date} = payload?.data
    const res = yield call(Api.updateStaffAttendanceData, payload?.data)
    if (res.status === true) {
      yield put(globalActions.updateStaffAttendance.success(res?.obj))
      yield put({
        type: StaffAttendanceActionType.GET_STAFF_ATTENDANCE_LIST,
        payload: {from_date: date, to_date: date},
      })
      yield put(showSuccessToast(attendanceSavedSuccessfullyMessage))
      let eventManager = yield select(getEventManager)
      if (eventManager) {
        eventManager.send_event(events.STAFF_ATTENDANCE_SAVED_TFI, {
          attendance_date: date,
        })
      }
    } else {
      yield put(
        globalActions.updateStaffAttendance.failure(attendanceSavedFailed)
      )
      yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
    }
  } catch (error) {
    yield put(globalActions.updateStaffAttendance.failure(error.message))
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

function* getStaffMonthlyAttendanceSymmary(payload) {
  try {
    const res = yield call(Api.getStaffMonthlyAttendanceData, payload?.data)
    if (res.status === true) {
      yield put(globalActions.staffMonthlyAttendanceSummary.success(res?.obj))
    } else {
      yield put(globalActions.staffMonthlyAttendanceSummary.failure(res))
      yield put(
        showErrorToast(res?.msg || somethingWentWrongPleaseCheckYourNetwork)
      )
    }
  } catch (error) {
    yield put(globalActions.staffMonthlyAttendanceSummary.failure({}))
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

function* fetchTodayNonTeachingStaffAttendance({
  data,
  successAction,
  failureAction,
}) {
  try {
    const response = yield call(Api.fetchNonTeachingStaffAttendance, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchTodayNonTeachingStaffAttendance.success(
          response?.data?.obj
        )
      )
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchTodayNonTeachingStaffAttendance.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchStaffAttendanceSaga() {
  yield takeEvery(
    StaffAttendanceActionType.GET_STAFF_DETAILS_LIST,
    fetchStaffList
  )
  yield takeEvery(
    StaffAttendanceActionType.GET_STAFF_ATTENDANCE_LIST,
    fetchStaffAttendanceList
  )
  yield takeLatest(
    StaffAttendanceActionType.STAFF_ATTENDANCE_SUBMIT_REQUEST,
    submitStaffAttendance
  )
  yield takeEvery(
    StaffAttendanceActionType.STAFF_ATTENDANCE_DOWNLOAD_REPORT_REQUEST,
    fetchStaffAttendanceDownloadReport
  )
  yield takeLatest(FETCH_LEAVE_DETAILS, fetchLeaveDetails)
  yield takeLatest(GET_STAFF_ATTENDANCE, getAndSyncStaffAttendance)

  yield takeEvery(
    globalActions.updateStaffAttendance.REQUEST,
    updateStaffAttendanceForm
  )

  yield takeEvery(
    globalActions.staffMonthlyAttendanceSummary.REQUEST,
    getStaffMonthlyAttendanceSymmary
  )
}

export function* watchFetchAttendanceRequests() {
  yield takeEvery(
    globalActions.fetchAttendanceRequests.REQUEST,
    fetchAttendanceRequests
  )
}

export function* watchResolveAttendanceRequest() {
  yield takeEvery(
    globalActions.resolveAttendanceRequest.REQUEST,
    resolveAttendanceRequest
  )
}

export function* watchFetchStaffAttendanceSummary() {
  yield takeEvery(
    globalActions.fetchStaffAttendanceSummary.REQUEST,
    fetchStaffAttendanceSummary
  )
}

export function* watchFetchNonTeachingStaffAttendance() {
  yield takeEvery(
    globalActions.fetchNonTeachingStaffAttendance.REQUEST,
    fetchNonTeachingStaffAttendance
  )
}

export function* watchFetchTodayNonTeachingStaffAttendance() {
  yield takeEvery(
    globalActions.fetchTodayNonTeachingStaffAttendance.REQUEST,
    fetchTodayNonTeachingStaffAttendance
  )
}

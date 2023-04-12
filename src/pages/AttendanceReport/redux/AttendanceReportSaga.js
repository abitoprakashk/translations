import {call, delay, put, race, take, takeLatest} from 'redux-saga/effects'
import {showErrorToast} from '../../../redux/actions/commonAction'
import globalActions from '../../../redux/actions/global.actions'
import {
  getAttendanceInsightApi,
  getAttendanceRegisterApi,
  getAttendanceTrendDailyApi,
  getAttendanceTrendMonthlyApi,
  getDateWiseAttendanceApi,
  getDownloadReportApi,
  getTodayAttendanceApi,
} from '../api/apiService'
import {TREND_FILTER} from '../AttendanceReport.constant'
const CANCEL_STATUS_POLLING = 'CancelStatusPolling'

function* getTodayAttendance({data: dateRange}) {
  try {
    const res = yield call(getTodayAttendanceApi, dateRange)
    if (res.status) {
      yield put(globalActions.todayAttendance.success(res.obj))
    } else {
      yield put(globalActions.todayAttendance.failure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(globalActions.todayAttendance.failure({}))
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getAttendanceInsight({data: dateRange}) {
  try {
    const res = yield call(getAttendanceInsightApi, dateRange)
    if (res.status) {
      yield put(globalActions.attendanceInsights.success(res.obj))
    } else {
      yield put(globalActions.attendanceInsights.failure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(globalActions.attendanceInsights.failure({}))
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getAttendanceTrend({data: {selectedFilter, dateRange}}) {
  try {
    let res
    if (selectedFilter === TREND_FILTER.DAILY) {
      res = yield call(getAttendanceTrendDailyApi, dateRange)
    } else {
      res = yield call(getAttendanceTrendMonthlyApi, dateRange)
    }

    if (res.status) {
      yield put(globalActions.attendanceTrend.success(res.obj))
    } else {
      yield put(globalActions.attendanceTrend.failure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getDateWiseAttendance({data: dateRange}) {
  try {
    let res
    res = yield call(getDateWiseAttendanceApi, dateRange)
    if (res.status) {
      yield put(globalActions.dateWiseAttendance.success(res.obj))
    } else {
      yield put(globalActions.dateWiseAttendance.failure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getAttendanceRegister({data: dateRange}) {
  try {
    const res = yield call(getAttendanceRegisterApi, dateRange)
    if (res.status) {
      yield put(globalActions.attendanceRegister.success(res.obj))
    } else {
      yield put(globalActions.attendanceRegister.failure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(globalActions.attendanceRegister.failure({}))
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getDownloadReport({data: json}) {
  yield race({
    // Start the polling worker
    task: call(pollDownloadReport, json),
    // Start a take effect waiting for the cancel action.
    cancel: take(CANCEL_STATUS_POLLING),
  })
}

function* pollDownloadReport(json) {
  while (true) {
    try {
      const res = yield call(getDownloadReportApi, json)
      if (res.status && res?.data?.obj) {
        yield put(globalActions.downloadReport.success(res.data.obj))
        yield put({type: CANCEL_STATUS_POLLING})
      } else {
        //
      }
      yield delay(4000)
    } catch (error) {
      yield put({type: CANCEL_STATUS_POLLING})
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  }
}

export function* watchAttendanceReportSaga() {
  yield takeLatest(globalActions.todayAttendance.REQUEST, getTodayAttendance)
  yield takeLatest(
    globalActions.attendanceInsights.REQUEST,
    getAttendanceInsight
  )
  yield takeLatest(globalActions.attendanceTrend.REQUEST, getAttendanceTrend)
  yield takeLatest(
    globalActions.attendanceRegister.REQUEST,
    getAttendanceRegister
  )
  yield takeLatest(globalActions.downloadReport.REQUEST, getDownloadReport)
  yield takeLatest(
    globalActions.dateWiseAttendance.REQUEST,
    getDateWiseAttendance
  )
}

import {call, delay, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../actions/commonAction'
import {reportLogActionTypes} from '../../actionTypes'
import * as Api from './apiServices'
import {DateTime} from 'luxon'
import {API_RESPONCE_OBJ_KEYS} from '../../../components/Dashboard/Reports/constant'

function* saveReportLog(action) {
  try {
    yield call(Api.saveReportLog, action.payload)
  } catch (error) {
    // yield put(showErrorToast(error.msg))
  }
}

export function* watchSaveReportLog() {
  yield takeEvery(reportLogActionTypes.SAVE_REPORT_LOG, saveReportLog)
}

function* fetchDownloadReportLog(action) {
  try {
    const res = yield call(Api.fetchDownloadReportLog, action.payload)
    if (res.status) {
      yield put({
        type: reportLogActionTypes.DOWNLOAD_REPORT_LOG_SUCCESS,
        payload: res.obj,
      })
    }
  } catch (error) {
    yield put(showErrorToast(error.msg))
  }
}

export function* watchFetchDownloadReportLog() {
  yield takeEvery(
    reportLogActionTypes.DOWNLOAD_REPORT_LOG_REQUEST,
    fetchDownloadReportLog
  )
}

function* fetchPreformanceReport() {
  try {
    yield put({
      type: reportLogActionTypes.SET_PERFORMANCE_REPORT_STATES,
      payload: {isDownloading: true},
    })

    const res = yield call(Api.fetchPreformanceReport)

    if (res.status) {
      yield put({
        type: reportLogActionTypes.SAVE_REPORT_LOG,
        payload: {
          start_date: '',
          end_date: '',
          report_name: `performance-report-${+DateTime.now().toFormat(
            'dd-LL-yyyy'
          )}`,
          report_type: API_RESPONCE_OBJ_KEYS.PERFORMANCE,
          download_url: res.obj,
          meta_data: {},
        },
      })

      yield delay(1500)

      yield put({
        type: reportLogActionTypes.SET_PERFORMANCE_REPORT_STATES,
        payload: {
          isModalOpen: false,
          isDownloading: false,
          isDownloaded: false,
        },
      })
    } else {
      yield put({
        type: reportLogActionTypes.SET_PERFORMANCE_REPORT_STATES,
        payload: {
          isModalOpen: false,
          isDownloading: false,
          isDownloaded: false,
        },
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put(showErrorToast(error.message))
    yield put({
      type: reportLogActionTypes.SET_PERFORMANCE_REPORT_STATES,
      payload: {
        isModalOpen: false,
        isDownloading: false,
        isDownloaded: false,
      },
    })
  }
}

export function* watchFetchPreformanceReport() {
  yield takeEvery(
    reportLogActionTypes.PERFORMANCE_REPORT_REQUEST,
    fetchPreformanceReport
  )
}

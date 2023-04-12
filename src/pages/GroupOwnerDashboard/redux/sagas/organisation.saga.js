import {call, put, takeEvery} from 'redux-saga/effects'
import * as Api from '../../apiService'
import globalActions from '../../../../redux/actions/global.actions'
import {showErrorToast} from '../../../../redux/actions/commonAction'

function* getOrgOverviewDetailsSaga({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.getOrgOverviewDetails, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.getOrgOverviewDetails.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.getOrgOverviewDetails.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* getOrgFeeReportSaga({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.getOrgFeeReport, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.getOrgFeeReport.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.getOrgFeeReport.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* getOrgAdmissionReportSaga({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.getOrgAdmissionReport, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.getOrgAdmissionReport.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.getOrgAdmissionReport.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* getOrgStudentAttendanceReportSaga({
  data,
  successAction,
  failureAction,
}) {
  try {
    const response = yield call(Api.getOrgStudentAttendanceReport, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.getOrgStudentAttendanceReport.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.getOrgStudentAttendanceReport.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}
function* getOrgStaffAttendanceReportSaga({
  data,
  successAction,
  failureAction,
}) {
  try {
    const response = yield call(Api.getOrgStaffAttendanceReport, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.getOrgStaffAttendanceReport.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.getOrgStaffAttendanceReport.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

export function* watchGetOrgOverviewDetailsSaga() {
  yield takeEvery(
    globalActions.getOrgOverviewDetails.REQUEST,
    getOrgOverviewDetailsSaga
  )
}
export function* watchGetOrgFeeReportSaga() {
  yield takeEvery(globalActions.getOrgFeeReport.REQUEST, getOrgFeeReportSaga)
}
export function* watchGetOrgAdmissionReportSaga() {
  yield takeEvery(
    globalActions.getOrgAdmissionReport.REQUEST,
    getOrgAdmissionReportSaga
  )
}
export function* watchGetOrgStudentAttendanceReportSaga() {
  yield takeEvery(
    globalActions.getOrgStudentAttendanceReport.REQUEST,
    getOrgStudentAttendanceReportSaga
  )
}
export function* watchGetOrgStaffAttendanceReportSaga() {
  yield takeEvery(
    globalActions.getOrgStaffAttendanceReport.REQUEST,
    getOrgStaffAttendanceReportSaga
  )
}

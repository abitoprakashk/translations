import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../../redux/actions/commonAction'
import * as Api from '../../apis/shift.api'
import globalActions from '../../../../../redux/actions/global.actions'
import {t} from 'i18next'

function* fetchStaffShiftMapping({successAction, failureAction}) {
  try {
    const response = yield call(Api.getStaffShiftMapping)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchStaffShiftMapping.success(response?.data?.obj)
      )
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchStaffShiftMapping.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* fetchShiftList({successAction, failureAction}) {
  try {
    const response = yield call(Api.getShiftList)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.fetchShiftList.success(response?.data?.obj))
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchShiftList.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* updateShift({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.updateShift, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.updateShift.success(response?.data?.obj))
      yield put(globalActions.fetchShiftList.request())
      yield put(globalActions.fetchStaffShiftMapping.request())
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.updateShift.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* deleteShift({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.deleteShift, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.deleteShift.success(response?.data?.obj))
      yield put(globalActions.fetchShiftList.request())
      yield put(globalActions.fetchStaffShiftMapping.request())
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.deleteShift.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* getShiftInfo({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.getShiftInfo, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.fetchShiftInfo.success(response?.data?.obj))
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchShiftInfo.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* getShiftQRCode({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.getShiftQRCode, data)
    if (response?.status === 200) {
      successAction?.(response?.data)
      yield put(globalActions.fetchShiftQRCode.success(response?.data))
    } else {
      throw t('somethingWentWrongPleaseCheckYourNetwork')
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchShiftQRCode.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* downloadQRCode({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.downloadQRCode, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.downloadQRCode.success(response?.data?.obj))
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.downloadQRCode.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchGetStaffShiftSaga() {
  yield takeEvery(
    globalActions.fetchStaffShiftMapping.REQUEST,
    fetchStaffShiftMapping
  )
}

export function* watchGetShiftListSaga() {
  yield takeEvery(globalActions.fetchShiftList.REQUEST, fetchShiftList)
}

export function* watchUpdateShiftSaga() {
  yield takeEvery(globalActions.updateShift.REQUEST, updateShift)
}

export function* watchDeleteShiftSaga() {
  yield takeEvery(globalActions.deleteShift.REQUEST, deleteShift)
}

export function* watchFetchShiftInfoSaga() {
  yield takeEvery(globalActions.fetchShiftInfo.REQUEST, getShiftInfo)
}

export function* watchFetchShiftQRCode() {
  yield takeEvery(globalActions.fetchShiftQRCode.REQUEST, getShiftQRCode)
}

export function* watchDownloadQRCode() {
  yield takeEvery(globalActions.downloadQRCode.REQUEST, downloadQRCode)
}

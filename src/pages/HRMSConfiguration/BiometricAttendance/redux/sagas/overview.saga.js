import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../../redux/actions/commonAction'
import * as Api from '../../apis/overview.api'
import globalActions from '../../../../../redux/actions/global.actions'
import {t} from 'i18next'

function* fetchBiometricAggregates({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchBiometricAggregates)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchBiometricAggregates.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchBiometricAggregates.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* fetchBiometricAttendance({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchBiometricAttendance, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchBiometricAttendance.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchBiometricAttendance.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchBiometricOverviewSaga() {
  yield takeEvery(
    globalActions.fetchBiometricAggregates.REQUEST,
    fetchBiometricAggregates
  )
  yield takeEvery(
    globalActions.fetchBiometricAttendance.REQUEST,
    fetchBiometricAttendance
  )
}

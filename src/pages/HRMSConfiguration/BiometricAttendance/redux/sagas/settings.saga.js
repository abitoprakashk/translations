import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../redux/actions/commonAction'
import * as Api from '../../apis/settings.api'
import globalActions from '../../../../../redux/actions/global.actions'
import {t} from 'i18next'

function* fetchBiometricSettings({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchBiometricSettings)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchBiometricSettings.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchBiometricSettings.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* requestBiometricMachines({data, successAction, failureAction} = {}) {
  try {
    const response = yield call(Api.requestBiometricMachines, data)

    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.requestBiometricMachines.success(response?.data?.obj)
      )
      yield put(globalActions.fetchBiometricMachinesList.request())
      yield put(globalActions.fetchBiometricUsersList?.request())
      yield put(globalActions.fetchBiometricAggregates.request())
      yield put(globalActions.fetchBiometricSettings?.request())
      yield put(showSuccessToast(t('biometricRequestGPSToastMessage')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.requestBiometricMachines.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchBiometricSettingsSaga() {
  yield takeEvery(
    globalActions.fetchBiometricSettings.REQUEST,
    fetchBiometricSettings
  )
  yield takeEvery(
    globalActions.requestBiometricMachines.REQUEST,
    requestBiometricMachines
  )
}

import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../redux/actions/commonAction'
import * as Api from '../../apis/machine.api'
import globalActions from '../../../../../redux/actions/global.actions'
import {t} from 'i18next'

function* fetchBiometricMachinesList({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchBiometricMachinesList)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchBiometricMachinesList.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchBiometricMachinesList.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* updateBiometricMachines({data, successAction, failureAction} = {}) {
  try {
    const response = yield call(Api.updateBiometricMachines, data)

    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.updateBiometricMachines.success(response?.data?.obj)
      )
      yield put(globalActions.fetchBiometricMachinesList.request())
      yield put(
        showSuccessToast(
          data?.machine_data?.[0]?._id
            ? t('biometricMachineUpdatedSuccessfully')
            : t('biometricMachineCreatedSuccessfully')
        )
      )
    } else if (response?.data?.error_code === 7080) {
      throw t('biometricMachineDuplicateSerialNumber')
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.updateBiometricMachines.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* deleteBiometricMachines({data, successAction, failureAction} = {}) {
  try {
    const response = yield call(Api.deleteBiometricMachines, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.deleteBiometricMachines.success(response?.data?.obj)
      )
      yield put(globalActions.fetchBiometricMachinesList.request())
      yield put(showSuccessToast(t('biometricMachineDeletedSuccessfully')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.deleteBiometricMachines.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchBiometricMachineSaga() {
  yield takeEvery(
    globalActions.fetchBiometricMachinesList.REQUEST,
    fetchBiometricMachinesList
  )
  yield takeEvery(
    globalActions.updateBiometricMachines.REQUEST,
    updateBiometricMachines
  )
  yield takeEvery(
    globalActions.deleteBiometricMachines.REQUEST,
    deleteBiometricMachines
  )
}

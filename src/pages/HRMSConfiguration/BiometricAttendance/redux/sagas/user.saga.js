import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../redux/actions/commonAction'
import * as Api from '../../apis/user.api'
import globalActions from '../../../../../redux/actions/global.actions'
import {t} from 'i18next'

function* fetchBiometricUsersList({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchBiometricUsersList)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchBiometricUsersList.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchBiometricUsersList.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* updateBiometricUsers({data, successAction, failureAction} = {}) {
  try {
    const response = yield call(Api.updateBiometricUsers, data)

    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.updateBiometricUsers.success(response?.data?.obj))
      yield put(globalActions.fetchBiometricUsersList.request())

      // If length > 1 , it will be bulk upload. Hence show success toast for bulk upload
      // Else, show success toast for user id edited successfully
      yield put(
        showSuccessToast(
          data?.user_data?.length > 1
            ? t('biometricUsersBulkUploadSuccessfully')
            : t('biometricUsersUpdatedSuccessfully')
        )
      )
    } else throw response?.data
  } catch (error) {
    failureAction?.()
    yield put(globalActions.updateBiometricUsers.failure(error))
    if (error?.error_code === 7080) {
      yield put(showErrorToast(t('biometricUserIDDuplicateExists')))
    } else {
      yield put(
        showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
      )
    }
  }
}

function* deleteBiometricUsers({data, successAction, failureAction} = {}) {
  try {
    const response = yield call(Api.deleteBiometricUsers, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.deleteBiometricUsers.success(response?.data?.obj))
      yield put(globalActions.fetchBiometricUsersList.request())
      yield put(showSuccessToast(t('biometricUsersUpdatedSuccessfully')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.deleteBiometricUsers.failure(error))
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchBiometricUsersSaga() {
  yield takeEvery(
    globalActions.fetchBiometricUsersList.REQUEST,
    fetchBiometricUsersList
  )
  yield takeEvery(
    globalActions.updateBiometricUsers.REQUEST,
    updateBiometricUsers
  )
  yield takeEvery(
    globalActions.deleteBiometricUsers.REQUEST,
    deleteBiometricUsers
  )
}

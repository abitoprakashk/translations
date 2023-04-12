import {call, put, takeEvery} from 'redux-saga/effects'
import {Trans} from 'react-i18next'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../redux/actions/commonAction'
import * as Api from '../apis/fees.apis'
import feeSettingsActionTypes from './feeSettingsActionTypes'
import feeStructureActionTypes from '../redux/feeStructure/feeStructureActionTypes'

const signatureDetailsUpdatedErrorMessage = (
  <Trans i18nKey={'signatureDetailsUpdatedErrorMessage'}>
    Error updating signature details
  </Trans>
)
const signatureDetailsUpdatedSuccessMessage = (
  <Trans i18nKey={'signatureDetailsUpdatedSuccessMessage'}>
    Signature details updated
  </Trans>
)

const signatureRemoveErrorMessage = (
  <Trans i18nKey={'signatureRemoveErrorMessage'}>
    Error removing signature
  </Trans>
)
const signatureRemoveSuccessMessage = (
  <Trans i18nKey={'signatureRemoveSuccessMessage'}>
    Signature removed successfully
  </Trans>
)

function* updateDigitalSignatureData(data) {
  try {
    const res = yield call(Api.updateFeeSetting, data)
    if (res) {
      yield put(showSuccessToast(signatureDetailsUpdatedSuccessMessage))
      yield put({
        type: feeStructureActionTypes.FETCH_FEE_SETTING_REQUEST,
      })
      yield put({
        type: feeSettingsActionTypes.UPDATE_DIGITAL_SIGNATURE_SUCCEEDED,
        digitalSignatureLoading: false,
      })
    } else {
      yield put(showErrorToast(signatureDetailsUpdatedErrorMessage))
      yield put({
        type: feeSettingsActionTypes.UPDATE_DIGITAL_SIGNATURE_FAIL,
        digitalSignatureLoading: false,
      })
    }
  } catch (e) {
    yield put({
      type: feeSettingsActionTypes.UPDATE_DIGITAL_SIGNATURE_FAIL,
      digitalSignatureLoading: false,
    })
    yield put(showErrorToast(e.message || signatureDetailsUpdatedErrorMessage))
  }
}

export function* watchUpdateDigitalSignatureData() {
  yield takeEvery(
    feeSettingsActionTypes.UPDATE_DIGITAL_SIGNATURE,
    updateDigitalSignatureData
  )
}

function* removeSignatureImage(data) {
  try {
    const res = yield call(Api.updateFeeSetting, data)
    if (res) {
      yield put(showSuccessToast(signatureRemoveSuccessMessage))
      yield put({
        type: feeStructureActionTypes.FETCH_FEE_SETTING_REQUEST,
      })
      yield put({
        type: feeSettingsActionTypes.UPDATE_DIGITAL_SIGNATURE_SUCCEEDED,
        digitalSignatureLoading: false,
      })
    } else {
      yield put(showErrorToast(signatureRemoveErrorMessage))
      yield put({
        type: feeSettingsActionTypes.UPDATE_DIGITAL_SIGNATURE_FAIL,
        digitalSignatureLoading: false,
      })
    }
  } catch (e) {
    yield put({
      type: feeSettingsActionTypes.UPDATE_DIGITAL_SIGNATURE_FAIL,
      digitalSignatureLoading: false,
    })
    yield put(showErrorToast(e.message || signatureRemoveErrorMessage))
  }
}

export function* watchRemoveSignatureImage() {
  yield takeEvery(
    feeSettingsActionTypes.REMOVE_DIGITAL_SIGNATURE_IMAGE,
    removeSignatureImage
  )
}

import {t} from 'i18next'
import produce from 'immer'
import {call, put, takeEvery} from 'redux-saga/effects'
import globalActions from '../../../redux/actions/global.actions'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../redux/actions/commonAction'
import * as Api from '../apis/apiService'
import {onboardingFlowStepsId, sessionData} from '../utils/constants'
import {formatCrmSettingsObj, setCrmSettingsProgress} from '../utils/helpers'
import {setCrmHeaders} from '../utils/apis.constants'

function* fetchAdmissionSettings() {
  try {
    const response = yield call(Api.fetchAdmissionSettings)
    if (response?.data?.status) {
      const sessionKey = sessionData.settingsKey
      if (response.data.obj?.[sessionKey]?.session_id) {
        setCrmHeaders(response.data.obj?.[sessionKey].session_id)
      }
      yield put(
        globalActions.getAdmissionCrmSettings.success(
          formatCrmSettingsObj(response?.data?.obj)
        )
      )
      yield put(
        globalActions.admissionCrmSettingsProgress.success(
          setCrmSettingsProgress(response?.data?.obj)
        )
      )
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getAdmissionCrmSettings.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchFetchAdmissionSettingsSaga() {
  yield takeEvery(
    globalActions.getAdmissionCrmSettings.REQUEST,
    fetchAdmissionSettings
  )
}

function* initializeAdmissionSettings() {
  try {
    const response = yield call(Api.initiateAdmissionSettings)
    if (response?.data?.status) {
      yield put(
        globalActions.initiateAdmissionCrmSettings.success(response?.data?.obj)
      )
      yield put(globalActions.getAdmissionCrmSettings.request())
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.initiateAdmissionCrmSettings.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchInitializeAdmissionSettingsSaga() {
  yield takeEvery(
    globalActions.initiateAdmissionCrmSettings.REQUEST,
    initializeAdmissionSettings
  )
}

function formatPayloadData(data) {
  if (data.type === onboardingFlowStepsId.LEAD_STAGES) {
    return {...data.payload, meta: Object.values(data.payload.meta)}
  } else if (data.type === onboardingFlowStepsId.FEES) {
    const formData = produce(data.payload.meta, (draft) => {
      draft.form_fees = draft.form_fees_required ? draft.form_fees : {}
      draft.admission_fees = draft.admission_fees_required
        ? draft.admission_fees
        : {}
      if (Object.keys(draft.form_fees).length) {
        Object.values(draft.form_fees.class_fees).forEach(({class_id, tax}) => {
          draft.form_fees.class_fees[class_id].tax = parseFloat(tax)
        })
      }
      if (Object.keys(draft.admission_fees).length) {
        Object.values(draft.admission_fees.class_fees).forEach(
          ({class_id, tax}) => {
            draft.admission_fees.class_fees[class_id].tax = parseFloat(tax)
          }
        )
      }
    })
    return {
      ...data.payload,
      meta: formData,
    }
  }
  return data.payload
}

function* updateAdmissionSettings({data, successAction, failureAction}) {
  try {
    const response = yield call(
      Api.updateAdmissionSettings,
      formatPayloadData(data)
    )
    if (response?.data?.status) {
      successAction?.()
      yield put(showSuccessToast(response?.data?.obj))
      yield put(globalActions.getAdmissionCrmSettings.request())
      yield put(globalActions.admissionCrmSettingsProgress.request())
      yield put(globalActions.updateAdmissionCrmSettings.success())
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    yield put(globalActions.updateAdmissionCrmSettings.failure())
  }
}

export function* watchUpdateAdmissionSettingsSaga() {
  yield takeEvery(
    globalActions.updateAdmissionCrmSettings.REQUEST,
    updateAdmissionSettings
  )
}

function* deleteLeadStage({data, successAction}) {
  try {
    const response = yield call(Api.deleteLeadStage, data)
    if (response?.data?.status) {
      successAction?.()
      yield put(showSuccessToast(t('deleteLeadStageMessage')))
      yield put(globalActions.deleteLeadStage.success())
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.deleteLeadStage.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchDeleteLeadStageSaga() {
  yield takeEvery(globalActions.deleteLeadStage.REQUEST, deleteLeadStage)
}

function* checkCrmReceiptPrefix({data, successAction}) {
  try {
    const response = yield call(Api.checkCrmReceiptPrefix, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.checkCrmReceiptPrefix.success())
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.checkCrmReceiptPrefix.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchCheckCrmReceiptPrefixSaga() {
  yield takeEvery(
    globalActions.checkCrmReceiptPrefix.REQUEST,
    checkCrmReceiptPrefix
  )
}

function* checkCrmPgKycStatus() {
  try {
    const response = yield call(Api.checkCrmPgKycStatus)
    if (response?.data?.status) {
      yield put(globalActions.checkCrmPgKycStatus.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.checkCrmPgKycStatus.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchCheckCrmPgKycStatusSaga() {
  yield takeEvery(
    globalActions.checkCrmPgKycStatus.REQUEST,
    checkCrmPgKycStatus
  )
}

function* admissionCrmPrintAdmissionForm() {
  try {
    const response = yield call(Api.admissionCrmPrintAdmissionForm)
    if (response?.data?.status) {
      yield put(globalActions.printAdmissionForm.success(response?.data?.obj))
      yield put(showSuccessToast(t('admissionFormUrlGenerationMsg')))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.printAdmissionForm.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchAdmissionCrmPrintAdmissionForm() {
  yield takeEvery(
    globalActions.printAdmissionForm.REQUEST,
    admissionCrmPrintAdmissionForm
  )
}

function* admissionCrmGetQrCode() {
  try {
    const response = yield call(Api.crmGetQRCodeUrl)
    if (response?.data?.status) {
      yield put(globalActions.getQrCode.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getQrCode.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchAdmissionCrmGetQrCode() {
  yield takeEvery(globalActions.getQrCode.REQUEST, admissionCrmGetQrCode)
}

function* admissionCrmGetQrCodeImage() {
  try {
    const response = yield call(Api.crmGetQRCodeImageUrl)
    if (response?.data?.status) {
      yield put(globalActions.getQrCodeImage.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getQrCodeImage.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchAdmissionCrmGetQrCodeImage() {
  yield takeEvery(
    globalActions.getQrCodeImage.REQUEST,
    admissionCrmGetQrCodeImage
  )
}

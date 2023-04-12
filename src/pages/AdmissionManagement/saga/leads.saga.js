import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import globalActions from '../../../redux/actions/global.actions'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../redux/actions/commonAction'
import * as Api from '../apis/apiService'
import {sortLeadsByUpdatedTimestamp} from '../utils/helpers'

function* getLeadList() {
  try {
    const response = yield call(Api.getLeadList)
    if (response?.data?.status) {
      yield put(
        globalActions.getLeadList.success(
          sortLeadsByUpdatedTimestamp(response?.data?.obj)
        )
      )
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getLeadList.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchFetchLeadListSaga() {
  yield takeEvery(globalActions.getLeadList.REQUEST, getLeadList)
}

function* updateLeadStage({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.updateLeadStage, data)
    if (response?.data?.status) {
      successAction?.(response.data.obj.lead)
      yield put(globalActions.updateLeadStage.success())
      yield put(showSuccessToast(t('leadStageUpdatedSuccessfully')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.updateLeadStage.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchUpdateLeadStageSaga() {
  yield takeEvery(globalActions.updateLeadStage.REQUEST, updateLeadStage)
}

function* getApplicableFeeStructures({data, successAction}) {
  try {
    const response = yield call(Api.getApplicableFeeStructures, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.getApplicableFeeStructures.success())
    } else throw response?.data?.msg
  } catch (error) {
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
    yield put(globalActions.getApplicableFeeStructures.failure())
  }
}

export function* watchGetApplicableFeeStructuresSaga() {
  yield takeEvery(
    globalActions.getApplicableFeeStructures.REQUEST,
    getApplicableFeeStructures
  )
}

function* confirmLeadAdmission({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.updateLeadStage, data)
    if (response?.data?.status) {
      successAction?.()
      yield put(showSuccessToast(t('admissionConfirmedSuccessfully')))
      if (data.fee_structure_id) {
        yield put(
          response?.data?.obj?.fee_settlement_status
            ? showSuccessToast(response?.data?.obj?.fee_settlement_msg)
            : showErrorToast(response?.data?.obj?.fee_settlement_msg)
        )
      }
      yield put(globalActions.confirmLeadAdmission.success())
      yield put(globalActions.getLeadList.request())
    } else throw response?.data
  } catch (error) {
    failureAction?.(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    yield put(globalActions.confirmLeadAdmission.failure())
  }
}

export function* watchConfirmLeadAdmissionSaga() {
  yield takeEvery(
    globalActions.confirmLeadAdmission.REQUEST,
    confirmLeadAdmission
  )
}

// Get lead details
function* getLeadDetails({data}) {
  try {
    const response = yield call(Api.getLeadDetails, data)
    if (response?.data?.status) {
      yield put(globalActions.getLeadData.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getLeadData.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchGetLeadDetailsSaga() {
  yield takeEvery(globalActions.getLeadData.REQUEST, getLeadDetails)
}

// Get recent lead activities
function* getLeadRecentActivity({data}) {
  try {
    const response = yield call(Api.getLeadRecentActivity, data)
    if (response?.data?.status) {
      yield put(
        globalActions.getLeadRecentActivity.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getLeadRecentActivity.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchGetLeadRecentActivitySaga() {
  yield takeEvery(
    globalActions.getLeadRecentActivity.REQUEST,
    getLeadRecentActivity
  )
}

function* admissionUpdateLeadStage({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.updateLeadStageFromLeadProfile, data)
    if (response?.data?.status) {
      successAction?.()
      yield put(globalActions.updateLeadStageFromLeadProfile.success())
      yield put(globalActions.getLeadRecentActivity.request(data.lead_id))
      yield put(showSuccessToast(t('leadStageUpdatedSuccessfully')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    yield put(globalActions.updateLeadStageFromLeadProfile.failure())
  }
}

export function* watchUpdateLeadStage() {
  yield takeEvery(
    globalActions.updateLeadStageFromLeadProfile.REQUEST,
    admissionUpdateLeadStage
  )
}

// Get Receipt URL
function* getReciept({data, successAction}) {
  try {
    const response = yield call(Api.crmFeeReciept, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj[0])
      yield put(globalActions.getReciept.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getReciept.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchGetRecieptSaga() {
  yield takeEvery(globalActions.getReciept.REQUEST, getReciept)
}

// Get transactions with SUCCESS status
function* getTransactionListSuccess({data, successAction}) {
  try {
    const response = yield call(Api.admissionTransactionListWithSuccess, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj[0])
      yield put(
        globalActions.getTransactionListWithStatusSuccess.success(
          response?.data?.obj
        )
      )
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getTransactionListWithStatusSuccess.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchGetTransactionListWithStatusSuccessSaga() {
  yield takeEvery(
    globalActions.getTransactionListWithStatusSuccess.REQUEST,
    getTransactionListSuccess
  )
}

// Send SMS
function* admissionCrmSendSms({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.admissionCrmSendSMS, data)
    if (response?.data?.status) {
      successAction?.()
      yield put(globalActions.sendSMS.success())
      yield put(showSuccessToast(t('leadProfileSendSmsSuccessMessage')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    yield put(globalActions.sendSMS.failure())
  }
}

export function* watchSendSms() {
  yield takeEvery(globalActions.sendSMS.REQUEST, admissionCrmSendSms)
}

// Delete Lead

function* admissionCrmDeleteLead({data, successAction}) {
  try {
    const response = yield call(Api.admissionCrmDeleteLead, data)
    if (response?.data?.status) {
      successAction?.()
      yield put(globalActions.deleteLead.success())
      yield put(showSuccessToast(t('kanbanPageDeleteLeadSuccessMessage')))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.deleteLead.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchDeleteLead() {
  yield takeEvery(globalActions.deleteLead.REQUEST, admissionCrmDeleteLead)
}

// Sync Admission Fee of lead
function* admissionCrmSyncAdmissionFee({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.admissionCrmSyncAdmissionFee, data)
    if (response?.data?.status) {
      successAction?.()
      yield put(globalActions.syncAdmissionFee.success())
      yield put(showSuccessToast(t('syncAdmFeeSuccessToastMsg')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    yield put(globalActions.syncAdmissionFee.failure())
  }
}

export function* watchSyncAdmissionFee() {
  yield takeEvery(
    globalActions.syncAdmissionFee.REQUEST,
    admissionCrmSyncAdmissionFee
  )
}

function* printAdmissionFormForLead({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.crmPrintAdmissionFormForLead, data)
    if (response?.data?.status) {
      successAction?.()
      yield put(
        globalActions.printAdmissionFormForLead.success(response?.data?.obj)
      )
      yield put(showSuccessToast(t('admissionFormUrlGenerationMsg')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    yield put(globalActions.printAdmissionFormForLead.failure())
  }
}

export function* watchPrintAdmissionFormForLead() {
  yield takeEvery(
    globalActions.printAdmissionFormForLead.REQUEST,
    printAdmissionFormForLead
  )
}

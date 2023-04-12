import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import globalActions from '../../../redux/actions/global.actions'
import {showSuccessToast} from '../../../redux/actions/commonAction'
import * as Api from '../apis/apiService'

function* admissionCrmAddLead({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.admissionCrmAddLead, {leads: data.leads})
    if (response?.data?.status) {
      yield put(globalActions.addLead.success())
      if (Object.keys(response?.data?.obj).length !== 0) {
        successAction?.(response?.data?.obj[0])
        yield put(showSuccessToast(t('successMsg')))
      } else {
        failureAction?.(t('numberAlreadyExists'))
      }
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    yield put(globalActions.addLead.failure())
  }
}

export function* watchAdmissionAddLead() {
  yield takeEvery(globalActions.addLead.REQUEST, admissionCrmAddLead)
}

function* admissionCrmUpdateLead({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.crmLeadUpdate, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj?.lead)
      yield put(globalActions.updateLead.success())
      yield put(showSuccessToast(t('updateMsg')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    yield put(globalActions.updateLead.failure())
  }
}

export function* watchAdmissionUpdateLead() {
  yield takeEvery(globalActions.updateLead.REQUEST, admissionCrmUpdateLead)
}

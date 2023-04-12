import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import globalActions from '../../../redux/actions/global.actions'
import {showSuccessToast} from '../../../redux/actions/commonAction'
import * as Api from '../apis/apiService'

function* paymentCreate({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.recordOfflineFees, data)
    if (response?.data?.status) {
      successAction?.()
      yield put(globalActions.createAdmissionCrmOfflinePayment.success())
      yield put(showSuccessToast(t('paymentMsg')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    yield put(globalActions.createAdmissionCrmOfflinePayment.failure())
  }
}

export function* watchAdmissionCrmOfflinePayment() {
  yield takeEvery(
    globalActions.createAdmissionCrmOfflinePayment.REQUEST,
    paymentCreate
  )
}

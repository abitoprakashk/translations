import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import globalActions from '../../../../redux/actions/global.actions'
import * as Api from '../../apis/fees.apis'

function* enableTeachPay({successAction}) {
  try {
    const response = yield call(Api.enableTechPay)
    if (response?.data?.obj?.data) {
      successAction?.()
      yield put(globalActions.enableTeachpay.success())
    } else throw response?.data?.msg
  } catch (error) {
    yield put(showErrorToast(error ?? t('TeachPayInstituteNotCreated')))
    yield put(globalActions.enableTeachpay.failure())
  }
}

export function* watchEnableTeachPay() {
  yield takeEvery(globalActions.enableTeachpay.REQUEST, enableTeachPay)
}

function* adminToTeachPay({successAction, failureAction}) {
  try {
    const response = yield call(Api.adminToTechPay)
    if (response?.data?.obj?.data) {
      successAction?.()
      yield put(globalActions.adminToTeachPay.success())
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(showErrorToast(error ?? t('TeachPayAdminNotCreated')))
    yield put(globalActions.adminToTeachPay.failure())
  }
}

export function* watchAdminToTeachPay() {
  yield takeEvery(globalActions.adminToTeachPay.REQUEST, adminToTeachPay)
}

function* studentDataSendToTeachPay() {
  try {
    const response = yield call(Api.studentDataSendToTechPay)
    if (response?.data?.obj?.data) {
      yield put(globalActions.studentDataSendToTeachPay.success())
    } else throw response?.data?.obj?.msg
  } catch (error) {
    yield put(showErrorToast(error ?? t('TeachPayStudentNotSynced')))
    yield put(globalActions.studentDataSendToTeachPay.failure())
  }
}

export function* watchStudentDataSendToTeachPay() {
  yield takeEvery(
    globalActions.studentDataSendToTeachPay.REQUEST,
    studentDataSendToTeachPay
  )
}

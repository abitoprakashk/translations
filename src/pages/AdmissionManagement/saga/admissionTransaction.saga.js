import {t} from 'i18next'
import {Trans} from 'react-i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import globalActions from '../../../redux/actions/global.actions'
import {
  showErrorToast,
  showSuccessToast,
  showToast,
} from '../../../redux/actions/commonAction'
import * as Api from '../apis/apiService'
import {paymentStatus} from '../utils/constants'

function* getTransactions() {
  try {
    const response = yield call(Api.getTransactionList)
    if (response?.data?.status) {
      yield put(globalActions.transactionList.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.transactionList.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchAdmissionTransactionList() {
  yield takeEvery(globalActions.transactionList.REQUEST, getTransactions)
}

function* getReceiptUrl({data, successAction}) {
  try {
    const response = yield call(Api.getFeeReceiptUrl, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.getFeeReceiptUrl.success())
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getFeeReceiptUrl.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchGetReceiptUrl() {
  yield takeEvery(globalActions.getFeeReceiptUrl.REQUEST, getReceiptUrl)
}

function* getRefreshStatus({data, successAction}) {
  try {
    const response = yield call(Api.refreshTransactionStatus, data._id)
    const oldStatus = paymentStatus[data.status]
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      const transactionStatus = response?.data?.obj?.status
      yield put(globalActions.refreshTransactionStatus.success())
      if (data.status !== transactionStatus) {
        yield put(
          showSuccessToast(
            <Trans i18nKey="transactionSuccessStatus">
              Transcation status has been changed from {{oldStatus}} to
              {{msgTransactionStatus: paymentStatus[transactionStatus]}}
            </Trans>
          )
        )
      } else {
        yield put(
          showToast({type: 'warning', message: t('transactionFailedStatus')})
        )
      }
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.refreshTransactionStatus.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchFeeRefreshTransactionStatus() {
  yield takeEvery(
    globalActions.refreshTransactionStatus.REQUEST,
    getRefreshStatus
  )
}

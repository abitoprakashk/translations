import {call, put, takeEvery} from 'redux-saga/effects'
import {requestDispatchFrom} from '../../../components/SchoolSystem/StudentDirectory/FeeTab/FeeTabConstant'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../redux/actions/commonAction'
import * as Api from '../apis/fees.apis'
import {
  fetchChequeTranscationListAction,
  fetchFeeTransactionListRequestAction,
} from './feeTransactionActions'
import feeTransactionActionTypes from './feeTransactionActionTypes'

function* fetchFeeTransacationListStatsRequest(action) {
  try {
    const {sessionStartDate, sessionEndDate, paymentStatus, paymentModes} =
      action.payload
    const res = yield call(
      Api.fetchFeeTransacationListData,
      sessionStartDate,
      sessionEndDate,
      paymentStatus,
      paymentModes
    )
    yield put({
      type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_LIST_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_LIST_STATS_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchFetchFeeTransactionList() {
  yield takeEvery(
    feeTransactionActionTypes.FETCH_FEE_TRANSACTION_LIST_STATS_REQUESTED,
    fetchFeeTransacationListStatsRequest
  )
}

function* fetchChequeTransacationListStatsRequest(action) {
  try {
    const {sessionStartDate, sessionEndDate, paymentStatus, paymentModes} =
      action.payload
    const res = yield call(
      Api.fetchFeeTransacationListData,
      sessionStartDate,
      sessionEndDate,
      paymentStatus,
      paymentModes
    )
    yield put({
      type: feeTransactionActionTypes.FETCH_CHEQUE_TRANSACTION_LIST_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: feeTransactionActionTypes.FETCH_CHEQUE_TRANSACTION_LIST_STATS_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(e.message))
  }
}
export function* watchFetchChequeTransactionList() {
  yield takeEvery(
    feeTransactionActionTypes.FETCH_CHEQUE_TRANSACTION_LIST_STATS_REQUESTED,
    fetchChequeTransacationListStatsRequest
  )
}

function* fetchFeeTransactionTimelineStatusRequest(action) {
  try {
    const {transactionId, transPaymentMode} = action.payload
    const res = yield call(
      Api.fetchFeeTransacationTimelineData,
      transactionId,
      transPaymentMode
    )
    yield put({
      type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_TIMELINE_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_TIMELINE_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchFeeTransactionTimelineStatusData() {
  yield takeEvery(
    feeTransactionActionTypes.FETCH_FEE_TRANSACTION_TIMELINE_REQUESTED,
    fetchFeeTransactionTimelineStatusRequest
  )
}

function* updateFeeTransactionTimelineUpdateStatusRequest(action) {
  try {
    const {
      transactionId,
      transStatus,
      sessionStartDate,
      sessionEndDate,
      transPaymentMode,
    } = action.payload
    const res = yield call(
      Api.fetchFeeTransacationTimelineStatusUpdate,
      transactionId,
      transStatus
    )

    const feeTransactionListObj = {
      sessionStartDate,
      sessionEndDate,
      paymentStatus: 'ALL',
      paymentModes: [],
    }

    const feeTransaUpdateTimelineStatus = {
      transactionId,
      transPaymentMode,
    }

    yield put({
      type: feeTransactionActionTypes.UPDATE_FEE_TRANSACTION_TIMELINE_STATUS_SUCCEEDED,
      payload: res,
    })

    yield put({
      type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_LIST_STATS_REQUESTED,
      payload: feeTransactionListObj,
    })
    yield put({
      type: feeTransactionActionTypes.FETCH_CHEQUE_TRANSACTION_LIST_STATS_REQUESTED,
      payload: feeTransactionListObj,
    })

    yield put({
      type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_TIMELINE_REQUESTED,
      payload: feeTransaUpdateTimelineStatus,
    })

    yield put(showSuccessToast(res.msg))
  } catch (e) {
    yield put({
      type: feeTransactionActionTypes.UPDATE_FEE_TRANSACTION_TIMELINE_STATUS_FAILED,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchFeeTransactionTimelineUpdateStatus() {
  yield takeEvery(
    feeTransactionActionTypes.UPDATE_FEE_TRANSACTION_TIMELINE_STATUS_REQUESTED,
    updateFeeTransactionTimelineUpdateStatusRequest
  )
}

function* downloadFeeTransactionReceipt(action) {
  try {
    const {studentId, receiptNo, isCancelled} = action.payload
    const res = yield call(
      Api.downloadFeeTransactionReceipt,
      studentId,
      receiptNo,
      isCancelled
    )
    yield put({
      type: feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_SUCCEEDED,
      payload: res,
    })
    if (action?.payload?.metaData?.sendClickEvents) {
      action?.payload?.metaData?.sendClickEvents()
    }
    const win = window.open(res.receipt_url, '_blank')
    if (win != null) {
      win.focus()
    }
  } catch (e) {
    yield put({
      type: feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchDownloadFeeTransactionReceipt() {
  yield takeEvery(
    feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_REQUESTED,
    downloadFeeTransactionReceipt
  )
}

function* revokeTransaction(action) {
  try {
    const {receiptNo, isCancelled} = action.payload
    const res = yield call(Api.revokeTransaction, receiptNo, isCancelled)
    yield put({
      type: feeTransactionActionTypes.REVOKE_FEE_TRANSACTION_SUCCEEDED,
      payload: res,
    })

    if (
      action.payload?.metaData &&
      action.payload?.metaData?.isDispatchFrom ===
        requestDispatchFrom.FEE_TAB_PAYMENT_HISTORY
    ) {
      action.payload?.metaData.onSuccess()
    } else {
      yield put(
        fetchFeeTransactionListRequestAction(
          action.payload.sessionStartDate,
          action.payload.sessionEndDate
        )
      )
      yield put(
        showSuccessToast(
          'Transaction ' +
            (isCancelled ? 'cancelled' : 'deleted') +
            ' successfully'
        )
      )
    }
  } catch (e) {
    yield put({
      type: feeTransactionActionTypes.REVOKE_FEE_TRANSACTION_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchRevokeTransaction() {
  yield takeEvery(
    feeTransactionActionTypes.REVOKE_FEE_TRANSACTION_REQUESTED,
    revokeTransaction
  )
}

function* revokeBankTransaction(action) {
  try {
    const {receiptNo, isCancelled} = action.payload
    const res = yield call(Api.revokeTransaction, receiptNo, isCancelled)
    yield put({
      type: feeTransactionActionTypes.REVOKE_CHEQUE_TRANSACTION_SUCCEEDED,
      payload: res,
    })
    yield put(
      fetchChequeTranscationListAction(
        action.payload.sessionStartDate,
        action.payload.sessionEndDate
      )
    )
    yield put(
      showSuccessToast(
        'Transaction ' +
          (isCancelled ? 'cancelled' : 'deleted') +
          ' successfully'
      )
    )
  } catch (e) {
    yield put({
      type: feeTransactionActionTypes.REVOKE_CHEQUE_TRANSACTION_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}
export function* watchRevokeBankTransaction() {
  yield takeEvery(
    feeTransactionActionTypes.REVOKE_CHEQUE_TRANSACTION_REQUESTED,
    revokeBankTransaction
  )
}

function* refreshOnlineTransaction(action) {
  try {
    const {
      sessionStartDate,
      sessionEndDate,
      paymentStatus,
      paymentModes,
      transId,
    } = action.payload

    const transStatus = {
      sessionStartDate,
      sessionEndDate,
      paymentStatus,
      paymentModes,
    }
    const res = yield call(Api.refreshOnlineStatus, {
      transaction_id: transId,
    })
    yield put({
      type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_LIST_STATS_REQUESTED,
      payload: transStatus,
    })
    yield put({
      type: feeTransactionActionTypes.REFRESH_ONLINE_FEE_TRANSACTION_SUCCEEDED,
      action: res,
    })
  } catch (e) {
    yield put({
      type: feeTransactionActionTypes.REFRESH_ONLINE_FEE_TRANSACTION_FAILED,
    })
    yield put(showErrorToast('Something went wrong'))
  }
}

export function* watchRefreshOnlineTransaction() {
  yield takeEvery(
    feeTransactionActionTypes.REFRESH_ONLINE_FEE_TRANSACTION_REQUESTED,
    refreshOnlineTransaction
  )
}

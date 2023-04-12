import {call, put, takeEvery} from 'redux-saga/effects'
import {
  bankTransactionModes,
  FAILED,
  REVOKED,
} from '../../../pages/fee/fees.constants'
import {quickActionsActionTypes} from '../../actionTypes'
import * as Api from './apiServices'

function* fetchTodayCollectedFeeData(action) {
  try {
    const res = yield call(Api.fetchTodayCollectedFee, action.payload)

    if (res.status) {
      let todayTotalFeeCollection = 0
      if (res.obj?.data?.length > 0) {
        let filteroutChequeDdData = res.obj?.data.filter(
          (item) =>
            ![bankTransactionModes.CANCELLED, REVOKED, FAILED].includes(
              item.status
            )
        )
        todayTotalFeeCollection = filteroutChequeDdData.reduce(
          (sum, a) =>
            sum +
            (typeof a.collected === 'number'
              ? a.collected
              : parseFloat(a.collected)),
          0
        )
      }

      yield put({
        type: quickActionsActionTypes.TODAY_COLLECTED_FEE_SUCCESS,
        payload: {todayTotalFeeCollection},
      })
    }
  } catch (error) {
    // yield put(showErrorToast(error.msg))
  }
}

export function* watchFetchTodayCollectedFeeData() {
  yield takeEvery(
    quickActionsActionTypes.TODAY_COLLECTED_FEE_REQUEST,
    fetchTodayCollectedFeeData
  )
}

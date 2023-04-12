import axios from 'axios'
import {t} from 'i18next'
import {call, put, takeLatest} from 'redux-saga/effects'
import {REACT_APP_API_URL} from '../../../../constants'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import globalActions from '../../../../redux/actions/global.actions'

function* getFeeWidgetData() {
  try {
    const res = yield call(async () => {
      const res = await axios.get(`${REACT_APP_API_URL}fee-module/widget`)
      return res.data
    })
    if (res.status) {
      yield put(globalActions.feeWidget.success(res.obj))
    } else {
      yield put(globalActions.feeWidget.failure(res))
      yield put(showErrorToast(res.msg || t('somethingWentWrong')))
    }
  } catch (error) {
    yield put(globalActions.feeWidget.failure({}))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchFeeWidgetSaga() {
  yield takeLatest(globalActions.feeWidget.REQUEST, getFeeWidgetData)
}

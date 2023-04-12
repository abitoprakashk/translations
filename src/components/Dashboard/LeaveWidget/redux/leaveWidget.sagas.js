import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import * as Api from './leaveWidget.api'
import globalActions from '../../../../redux/actions/global.actions'
import {t} from 'i18next'

function* getLeaveWidget() {
  try {
    const res = yield call(Api.getLeaveWidget)
    const {status} = res?.data
    if (status == true) {
      yield put(globalActions.leaveWidgetData.success(res?.data.obj))
    } else {
      yield put(globalActions.leaveWidgetData.failure({}))
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.leaveWidgetData.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchLeaveWidget() {
  yield takeEvery(globalActions.leaveWidgetData.REQUEST, getLeaveWidget)
}

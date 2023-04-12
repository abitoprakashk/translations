import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import globalActions from '../../../../redux/actions/global.actions'
import * as Api from './apiService'

function* getAttendanceWidgetData(action) {
  try {
    const res = yield call(Api.getAttendanceWidgetData, action.data)
    if (res.status) {
      yield put(globalActions.getAttendanceWidgetData.success(res.obj))
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
    }
  } catch {
    yield put(showErrorToast(t('somethingWentWrongPleaseCheckYourNetwork')))
  }
}

export function* watchGetAttendanceWidgetData() {
  yield takeEvery(
    globalActions?.getAttendanceWidgetData?.REQUEST,
    getAttendanceWidgetData
  )
}

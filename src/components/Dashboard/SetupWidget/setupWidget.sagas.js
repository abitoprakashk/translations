import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../redux/actions/commonAction'
import globalActions from '../../../redux/actions/global.actions'
import * as Api from './apiService'

function* getSetupProgressWidget(action) {
  try {
    const res = yield call(Api.getSetupProgressWidget, action.data)

    if (res.status) {
      yield put(globalActions.getSetupProgressWidget.success(res.obj))
    } else {
      let error = 'Something went wrong'
      yield put(globalActions?.getSetupProgressWidget?.failure(error))
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('somethingWentWrongPleaseCheckYourNetwork')))
  }
}

export function* watchGetSetupProgressWidget() {
  yield takeEvery(
    globalActions.getSetupProgressWidget.REQUEST,
    getSetupProgressWidget
  )
}

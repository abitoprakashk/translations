import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../redux/actions/commonAction'
import * as Api from '../apis/apis'
import GLOBAL_SETTINGS_ACTIONS from './GlobalSettingsActionTypes'

function* fetchGlobalSettings(action) {
  try {
    const {instituteId} = action.payload
    const res = yield call(Api.fetchGlobalSettings, instituteId)
    yield put({
      type: GLOBAL_SETTINGS_ACTIONS.SET_SETTINGS,
      payload: res,
    })
  } catch (e) {
    yield put(showErrorToast(e.message))
  }
}

export function* watchFetchGlobalSettings() {
  yield takeEvery(GLOBAL_SETTINGS_ACTIONS.GET_SETTINGS, fetchGlobalSettings)
}

function* updateGlobalSettings(action) {
  try {
    const {instituteId, updatedSetting} = action.payload

    const res = yield call(
      Api.updateGlobalSettings,
      instituteId,
      updatedSetting
    )
    yield put({
      type: GLOBAL_SETTINGS_ACTIONS.SET_SETTINGS,
      payload: res,
    })
    yield put({
      type: GLOBAL_SETTINGS_ACTIONS.POST_SETTING_SUCCESS,
    })
  } catch (e) {
    yield put(showErrorToast(e.message))
  }
}

export function* watchUpdateGlobalSettings() {
  yield takeEvery(GLOBAL_SETTINGS_ACTIONS.POST_SETTINGS, updateGlobalSettings)
}

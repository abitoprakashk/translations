import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import {COMMON_ACTIONS} from './../actionTypes'

function* getSignedUrl(action) {
  try {
    const res = yield call(Api.getSignedUrl, action.payload.params)
    if (res.status) {
      yield put({
        type: COMMON_ACTIONS.DISPLAY_PIC_UPLOAD_SIGNED_URL_SUCCESS,
        payload: {urls: res.obj, file: action.payload.file},
      })
    } else {
      // yield put(showErrorToast('Member display picture update failed'))
      yield put(showErrorToast(res.msg))
      yield put({
        type: COMMON_ACTIONS.DISPLAY_PIC_UPLOAD_SIGNED_URL_FAILED,
        payload: {error: res.msg, file: action.payload.file},
      })
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchGetSignedUrl() {
  yield takeEvery(
    COMMON_ACTIONS.DISPLAY_PIC_UPLOAD_SIGNED_URL_REQUEST,
    getSignedUrl
  )
}

function* uploadDP(action) {
  try {
    const res = yield call(Api.updateMemberDP, action.payload.params)
    if (res.status) {
      yield put({type: COMMON_ACTIONS.DISPLAY_PIC_ATTACH_SUCCESS})
      yield put({type: action.payload.callbackAction})
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchAttachDPToMember() {
  yield takeEvery(COMMON_ACTIONS.DISPLAY_PIC_ATTACH_REQUEST, uploadDP)
}

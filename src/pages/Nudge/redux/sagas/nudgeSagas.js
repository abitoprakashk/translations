import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import {PopupActions} from '../actionTypes'

function* fetchPopup() {
  try {
    const res = yield call(Api.getNudgePopup)
    if (res.status == true) {
      yield put({
        type: PopupActions.SHOW_POPUP_DATA,
        payload: res.obj,
      })
    } else {
      yield put({
        type: PopupActions.GET_POPUP_DATA_FAILURE,
      })
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    yield put({
      type: PopupActions.GET_POPUP_DATA_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* setPopup({payload}) {
  try {
    const res = yield call(Api.setNudgePopup, {
      pop_up: payload.pop_up,
      popup_type: payload.popup_type,
      api_type: payload.api_type,
    })
    if (res.status == true) {
      yield put({
        type: PopupActions.CLOSE_POPUP,
      })
      if (
        (payload.popup_type === 'NPS' || payload.popup_type === 'Fees') &
        ('link' in payload)
      ) {
        window.open(payload.link, '_blank')
      }
    } else {
      yield put({
        type: PopupActions.SET_POPUP_DATA_FAILURE,
      })
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    yield put({
      type: PopupActions.SET_POPUP_DATA_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* setPopupTime() {
  try {
    const res = yield call(Api.setNudgePopupTime)
    if (res.status == true) {
      yield put({
        type: PopupActions.CLOSE_POPUP,
      })
    } else {
      yield put({
        type: PopupActions.SET_POPUP_DATA_FAILURE,
      })
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    yield put({
      type: PopupActions.SET_POPUP_DATA_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchFetchPopup() {
  yield takeEvery(PopupActions.GET_POPUP_DATA, fetchPopup)
}

export function* watchSetPopup() {
  yield takeEvery(PopupActions.SET_POPUP_DATA, setPopup)
}

export function* watchSetPopupTime() {
  yield takeEvery(PopupActions.SET_POPUP_TIME, setPopupTime)
}

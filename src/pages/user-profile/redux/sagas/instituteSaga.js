import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import {INSTITUTE_ACTIONS} from './../actionTypes'
import {instituteInfoActionTypes} from './../../../../redux/actionTypes'

function* updateProfile(action) {
  try {
    const res = yield call(Api.updateInstituteProfile, action.payload)
    if (res.status) {
      yield put(showSuccessToast('Institute updated successfully'))
      yield put({
        type: instituteInfoActionTypes.INSTITUTE_INFO,
        payload: res.obj,
      })
    } else {
      let error = 'Institute update failed'
      if (res.error_code === 7012) {
        error = 'Invalid Data'
      }
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchUpdateInstituteProfile() {
  yield takeEvery(
    INSTITUTE_ACTIONS.INSTITUTE_PROFILE_UPDATE_REQUEST,
    updateProfile
  )
}

function* uploadLogo(action) {
  try {
    const res = yield call(Api.updateInstituteLogo, action.payload)
    if (!res.status) {
      yield put(showErrorToast('Institute logo update failed'))
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchUploadLogo() {
  yield takeEvery(INSTITUTE_ACTIONS.LOGO_UPLOAD_REQUEST, uploadLogo)
}

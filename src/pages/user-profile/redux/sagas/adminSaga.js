import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import {ADMIN_ACTIONS} from './../actionTypes'
import {instituteInfoActionTypes} from './../../../../redux/actionTypes'
import {utilsGetAdminsList} from './../../../../routes/dashboard'
import {generateErrorCSV} from '../../../InstituteSettings/utils'
import {t} from 'i18next'

function* updateProfile(action) {
  try {
    const res = yield call(Api.updateAdminProfile, action.payload)
    if (res.status) {
      yield put(showSuccessToast('User updated successfully'))
      yield put({
        type: ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_SUCCESSFUL,
        payload: action.payload.users[0]._id,
      })
      yield put({type: ADMIN_ACTIONS.ADMIN_LIST_REQUEST})
    } else {
      let error = 'Something went wrong'
      if (res.error_code) {
        error = res.msg
      }
      if (res.error_code === 2515) {
        error = res?.error_obj[0]?.error_message
        if (!error) {
          error = 'Something went wrong'
        }
      }
      yield put({
        type: ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_FAILED,
        payload: true,
      })
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put({type: ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_FAILED, payload: true})
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchUpdateAdminProfile() {
  yield takeEvery(ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_REQUEST, updateProfile)
}

function* addAdminProfile(action) {
  try {
    yield put({
      type: ADMIN_ACTIONS.ADMIN_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(Api.addAdminProfile, action.payload)
    if (res.status) {
      yield put(showSuccessToast('User added successfully'))
      yield put({
        type: ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_SUCCESSFUL,
        payload: res.obj?.new_users[0],
      })
      yield put({type: ADMIN_ACTIONS.ADMIN_LIST_REQUEST})
    } else {
      let error = 'Something went wrong'
      if (res.error_code) {
        error = res.msg
      }
      if (res.error_code === 2514) {
        error = t('errorsWhileAdding')
        generateErrorCSV(res.error_obj)
      } else error = res.msg
      yield put(showErrorToast(error))
      yield put({type: ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_FAILED})
    }
  } catch (e) {
    yield put({type: ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_FAILED})
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchAddAdminProfile() {
  yield takeEvery(ADMIN_ACTIONS.ADMIN_PROFILE_ADD_REQUEST, addAdminProfile)
}

function* getAdminDetails(action) {
  try {
    yield put({
      type: ADMIN_ACTIONS.ADMIN_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(Api.getAdminProfiles, action.payload)
    if (res.status) {
      yield put({
        type: ADMIN_ACTIONS.ADMIN_PROFILE_DATA,
        payload: res.obj?.admin,
      })
    } else {
      yield put(showErrorToast('Something went wrong'))
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: ADMIN_ACTIONS.ADMIN_PROFILE_LOADER,
    payload: false,
  })
}

export function* watchGetAdminProfile() {
  yield takeEvery(ADMIN_ACTIONS.ADMIN_PROFILE_DATA_REQUEST, getAdminDetails)
}

function* deleteAdminDetails(action) {
  try {
    yield put({
      type: ADMIN_ACTIONS.ADMIN_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(Api.deleteAdminProfile, action.payload)
    if (res.status) {
      yield put(showSuccessToast('User has been deleted successfully'))
      yield put({
        type: ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_SUCCESSFUL,
        payload: res.obj,
      })
      yield put({type: ADMIN_ACTIONS.ADMIN_LIST_REQUEST})
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: ADMIN_ACTIONS.ADMIN_PROFILE_LOADER,
    payload: false,
  })
}

export function* watchDeleteAdminProfile() {
  yield takeEvery(ADMIN_ACTIONS.ADMIN_PROFILE_DELETE, deleteAdminDetails)
}

function* getAdmins() {
  try {
    yield put({
      type: ADMIN_ACTIONS.ADMIN_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(utilsGetAdminsList)
    if (res.status) {
      yield put({
        type: instituteInfoActionTypes.INSTITUTE_ADMINS_LIST,
        payload: res.obj?.admin,
      })
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: ADMIN_ACTIONS.ADMIN_PROFILE_LOADER,
    payload: false,
  })
}

export function* watchGetAdminList() {
  yield takeEvery(ADMIN_ACTIONS.ADMIN_LIST_REQUEST, getAdmins)
}

import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import {TEACHER_ACTIONS} from './../actionTypes'
import {instituteInfoActionTypes} from './../../../../redux/actionTypes'
import {utilsGetUsersList} from './../../../../routes/dashboard'
import {INSTITUTE_MEMBER_TYPE} from '../../../../constants/institute.constants'
import {generateErrorCSV} from '../../../InstituteSettings/utils'
import {t} from 'i18next'

function* updateProfile(action) {
  try {
    const res = yield call(Api.updateUserProfile, action.payload)
    if (res.status) {
      yield put(showSuccessToast('Teacher updated successfully'))
      yield put({
        type: TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_SUCCESSFUL,
        payload: action.payload.users[0]._id,
      })
      yield put({type: TEACHER_ACTIONS.TEACHER_LIST_REQUEST})
    } else {
      let error = 'Something went wrong'
      if (res.error_code) {
        error = res.msg
      }
      if (res.error_code === 2515) {
        error = res?.error_obj[0]?.error_message
      }
      yield put({
        type: TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_FAILED,
        payload: true,
      })
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put({
      type: TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_FAILED,
      payload: true,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchUpdateTeacherProfile() {
  yield takeEvery(TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_REQUEST, updateProfile)
}

function* addProfile(action) {
  try {
    yield put({
      type: TEACHER_ACTIONS.TEACHER_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(Api.addUserProfile, action.payload)
    if (res.status) {
      yield put(showSuccessToast('Teacher added successfully'))
      yield put({
        type: TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_SUCCESSFUL,
        payload: res.obj.new_users[0],
      })
      yield put({type: TEACHER_ACTIONS.TEACHER_LIST_REQUEST})
    } else {
      let error = 'Something went wrong'
      if (res.error_code === 7012) {
        error = 'Invalid Data'
      }
      if (res.error_code === 2514) {
        error = t('errorsWhileAdding')
        generateErrorCSV(res.error_obj)
      } else error = res.msg
      yield put({
        type: TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_FAILED,
        payload: true,
      })
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put({
      type: TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_FAILED,
      payload: true,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchAddTeacherProfile() {
  yield takeEvery(TEACHER_ACTIONS.TEACHER_PROFILE_ADD_REQUEST, addProfile)
}

function* deleteTeacherDetails(action) {
  try {
    yield put({
      type: TEACHER_ACTIONS.TEACHER_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(Api.deleteUserDetails, action.payload)
    if (res.status) {
      yield put(showSuccessToast('Teacher has been deleted successfully'))
      yield put({
        type: TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_SUCCESSFUL,
        payload: res.obj,
      })
      yield put({type: TEACHER_ACTIONS.TEACHER_LIST_REQUEST})
    } else {
      yield put({
        type: TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_FAILED,
        payload: true,
      })
      yield put(showErrorToast('Something went wrong'))
    }
  } catch (e) {
    yield put({
      type: TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_FAILED,
      payload: true,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: TEACHER_ACTIONS.TEACHER_PROFILE_LOADER,
    payload: false,
  })
}

export function* watchDeleteTeacherProfile() {
  yield takeEvery(TEACHER_ACTIONS.TEACHER_PROFILE_DELETE, deleteTeacherDetails)
}

function* getTeachers() {
  try {
    yield put({
      type: TEACHER_ACTIONS.TEACHER_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(utilsGetUsersList, {
      type: [INSTITUTE_MEMBER_TYPE.TEACHER],
    })
    if (res.status) {
      yield put({
        type: instituteInfoActionTypes.INSTITUTE_TEACHERS_LIST,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast('Something went wrong'))
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: TEACHER_ACTIONS.TEACHER_PROFILE_LOADER,
    payload: false,
  })
}

export function* watchGetTeacherList() {
  yield takeEvery(TEACHER_ACTIONS.TEACHER_LIST_REQUEST, getTeachers)
}

function* uploadDP(action) {
  try {
    yield put({
      type: TEACHER_ACTIONS.TEACHER_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(Api.updateMemberDP, action.payload)
    if (res.status) {
      yield put({type: TEACHER_ACTIONS.TEACHER_DISPLAY_PIC_UPLOAD_SUCCESS})
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: TEACHER_ACTIONS.TEACHER_PROFILE_LOADER,
    payload: false,
  })
}

export function* watchUploadTeacherDP() {
  yield takeEvery(TEACHER_ACTIONS.TEACHER_DISPLAY_PIC_UPLOAD_REQUEST, uploadDP)
}

import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import {STUDENT_ACTIONS} from '../actionTypes'
import {instituteInfoActionTypes} from '../../../../redux/actionTypes'
import {utilsGetUsersList} from '../../../../routes/dashboard'
import {commonActionTypes} from '../../../../redux/actionTypes'
import {INSTITUTE_MEMBER_TYPE} from '../../../../constants/institute.constants'
import {generateErrorCSV} from '../../../InstituteSettings/utils'
import {t} from 'i18next'

function* addProfile(action) {
  try {
    yield put({
      type: commonActionTypes.SHOW_LOADING,
      payload: true,
    })
    const res = yield call(Api.addUserProfile, action.payload)
    if (res.status) {
      yield put(showSuccessToast('Student added successfully'))
      yield put({
        type: STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_SUCCESSFUL,
        payload: res.obj.new_users[0],
      })
      yield put({type: STUDENT_ACTIONS.STUDENT_LIST_REQUEST})
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
        type: STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_FAILED,
        payload: true,
      })
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put({
      type: STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_FAILED,
      payload: true,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: commonActionTypes.SHOW_LOADING,
    payload: false,
  })
}

function* getStudentDetails(action) {
  try {
    yield put({
      type: STUDENT_ACTIONS.STUDENT_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(Api.getUserProfileDetails, action.payload)
    if (res.status) {
      yield put({
        type: STUDENT_ACTIONS.STUDENT_PROFILE_DETAILS,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast('Something went wrong'))
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: STUDENT_ACTIONS.STUDENT_PROFILE_LOADER,
    payload: false,
  })
}

function* updateProfile(action) {
  try {
    yield put({
      type: commonActionTypes.SHOW_LOADING,
      payload: true,
    })
    const res = yield call(Api.updateUserProfile, action.payload)
    if (res.status) {
      yield put(showSuccessToast('Student updated successfully'))
      yield put({
        type: STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_SUCCESSFUL,
        payload: action.payload.users[0]._id,
      })
      yield put({type: STUDENT_ACTIONS.STUDENT_LIST_REQUEST})
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
        type: STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_FAILED,
        payload: true,
      })
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put({
      type: STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_FAILED,
      payload: true,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: commonActionTypes.SHOW_LOADING,
    payload: false,
  })
}

function* deleteStudentDetails(action) {
  try {
    yield put({
      type: STUDENT_ACTIONS.STUDENT_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(Api.deleteUserDetails, action.payload)
    if (res.status) {
      yield put(showSuccessToast('Student has been deleted'))
      yield put({
        type: STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_SUCCESSFUL,
        payload: res.obj,
      })
      yield put({type: STUDENT_ACTIONS.STUDENT_LIST_REQUEST})
    } else {
      yield put(
        showErrorToast(
          'We found payments for this student in fee module. This student cannot be deleted'
        )
      )
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: STUDENT_ACTIONS.STUDENT_PROFILE_LOADER,
    payload: false,
  })
}

function* getStudents() {
  try {
    yield put({
      type: STUDENT_ACTIONS.STUDENT_PROFILE_LOADER,
      payload: true,
    })
    const res = yield call(utilsGetUsersList, {
      type: [INSTITUTE_MEMBER_TYPE.STUDENT],
    })
    if (res.status) {
      yield put({
        type: instituteInfoActionTypes.INSTITUTE_STUDENTS_LIST,
        payload: res.obj,
      })
      yield put({
        type: STUDENT_ACTIONS.STUDENT_LIST_GET_SUCCEEDED,
        payload: 'User list get successfully ',
      })
    } else {
      yield put(showErrorToast('Something went wrong'))
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
  yield put({
    type: STUDENT_ACTIONS.STUDENT_PROFILE_LOADER,
    payload: false,
  })
}

function* uploadDP(action) {
  try {
    const res = yield call(Api.updateMemberDP, action.payload)
    if (res.status) {
      yield put({type: STUDENT_ACTIONS.STUDENT_LIST_REQUEST})
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchStudentProfileSaga() {
  yield takeEvery(STUDENT_ACTIONS.STUDENT_PROFILE_ADD_REQUEST, addProfile)
  yield takeEvery(
    STUDENT_ACTIONS.STUDENT_PROFILE_DATA_REQUEST,
    getStudentDetails
  )
  yield takeEvery(STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_REQUEST, updateProfile)
  yield takeEvery(STUDENT_ACTIONS.STUDENT_PROFILE_DELETE, deleteStudentDetails)
  yield takeEvery(STUDENT_ACTIONS.STUDENT_LIST_REQUEST, getStudents)
  yield takeEvery(STUDENT_ACTIONS.STUDENT_DISPLAY_PIC_UPLOAD_REQUEST, uploadDP)
}

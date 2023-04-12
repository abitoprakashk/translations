import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import {showLoadingAction, showToast} from '../../redux/actions/commonAction'
import globalActions from '../../redux/actions/global.actions'
import {
  STUDENT_ACTIONS,
  TEACHER_ACTIONS,
} from '../user-profile/redux/actionTypes'
import {
  duplicateStudentListAction,
  duplicateTeacherListAction,
} from '../../redux/actions/instituteInfoActions'
import {
  addPersonaMembers,
  getPersonaMembers,
  getPersonaSettings,
  updatePersonaMembers,
} from './InstituteSettings.api'
import {generateErrorCSV} from './utils'

function* getSettings({payload}) {
  const res = yield call(getPersonaSettings, payload)
  if (res.status === 200 && res.data.status === true) {
    const settings = res.data.obj
    if (settings.length === 0) {
      yield put(showToast({type: 'error', message: 'No settings found'}))
      yield put(showLoadingAction(false))
    } else {
      yield put(globalActions.institutePersonaSettings.success(settings))
    }
  } else {
    yield put(showToast({type: 'error', message: 'Something went wrong'}))
    yield put(showLoadingAction(false))
  }
}

function* getMembers({payload}) {
  const res = yield call(getPersonaMembers, payload)
  if (res.status === 200 && res.data.status === true) {
    const members = res.data.obj
    if (members.length === 0) {
      yield put(showToast({type: 'error', message: 'No member in institute'}))
    } else {
      yield put(globalActions.institutePersonaMembers.success(members))
    }
  } else {
    yield put(showToast({type: 'error', message: 'Something went wrong'}))
  }
}

function* addMembers({payload}) {
  const data = payload?.personaData
  const persona = payload?.persona
  const res = yield call(addPersonaMembers, data)
  const successMessage =
    persona === 'STUDENT'
      ? t('studentsAddedSuccessfully')
      : t('teachersAddedSuccessfully')

  if (res.status === 200 && res.data.status === true) {
    if (
      'existing_users' in res.data.obj &&
      res.data.obj.existing_users.length > 0
    ) {
      const duplicateList = {
        users: {
          existing_users: res.data.obj.existing_users,
          new_users: res.data.obj.new_users,
        },
      }
      if ('nodeId' in payload.personaData) {
        duplicateList['nodeId'] = payload.personaData.nodeId
      }
      if (persona === 'STUDENT') {
        yield put(duplicateStudentListAction(duplicateList))
      } else if (persona === 'TEACHER') {
        yield put(duplicateTeacherListAction(duplicateList.users))
      }
    } else {
      yield put(showToast({type: 'success', message: successMessage}))
      yield put({type: STUDENT_ACTIONS.STUDENT_LIST_REQUEST})
      yield put({type: TEACHER_ACTIONS.TEACHER_LIST_REQUEST})
    }
  } else {
    if (res.data.error_code === 2514) {
      generateErrorCSV(res.data.error_obj)
    }
    if (res.data.error_code === 2516) {
      generateErrorCSV(res.data.error_obj, true)
    }
    let message = res.data.msg || 'Something went wrong'
    yield put(showToast({type: 'error', message: message}))
  }
}

function* updateMembers({payload}) {
  const res = yield call(updatePersonaMembers, payload)
  if (res.status === 200 && res.data.status === true) {
    yield put(
      showToast({type: 'success', message: t('studentsUpdatedSuccessfully')})
    )
    yield put({type: STUDENT_ACTIONS.STUDENT_LIST_REQUEST})
  } else {
    if (res.data.error_code === 2515) {
      generateErrorCSV(res.data.error_obj)
    }
    let message = res.data.msg || 'Something went wrong'
    yield put(showToast({type: 'error', message: message}))
  }
}

export function* watchInstituteSettingsAndMembers() {
  yield takeEvery(globalActions.institutePersonaSettings.REQUEST, getSettings)
  yield takeEvery(globalActions.institutePersonaMembers.REQUEST, getMembers)
  yield takeEvery(globalActions.addPersonaMembers.REQUEST, addMembers)
  yield takeEvery(globalActions.updatePersonaMembers.REQUEST, updateMembers)
}

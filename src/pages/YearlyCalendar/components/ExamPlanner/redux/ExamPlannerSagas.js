import {call, put, takeEvery} from '@redux-saga/core/effects'
import {ExamPlannerActions} from './ExamPlannerActionTypes'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../redux/actions/commonAction'
import * as Api from './../Api'

function* setExistingExams() {
  try {
    const res = yield call(Api.fetchExistingExams)

    if (res.status) {
      yield put({
        type: ExamPlannerActions.SET_EXISTING_EXAMS,
        payload: res.obj,
      })
      yield showSuccessToast('success')
    }
  } catch {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}
export function* watchSetExistingExams() {
  yield takeEvery(ExamPlannerActions.FETCH_EXISTING_EXAMS, setExistingExams)
}

function* postExistingExamSchedule({payload}) {
  try {
    const res = yield call(Api.postExistingExamSchedule, payload)
    if (res.status) {
      yield put(showSuccessToast('Succesfully scheduled exam'))
    } else yield put(showErrorToast('Something went wrong'))
  } catch {
    // yield put(showErrorToast("t('error2')"))
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}
export function* watchPostExistingExamSchedule() {
  yield takeEvery(
    ExamPlannerActions.POST_EXSITING_EXAM_SCHEDULE,
    postExistingExamSchedule
  )
}

function* getSubjectList({payload}) {
  try {
    const res = yield call(Api.getSubjects, payload)
    if (res.status) {
      yield put({
        type: ExamPlannerActions.FETCH_SUBJECT_LIST_REQUEST_SUCCESS,
        payload: res.obj,
      })
    } else yield put(showErrorToast('Something went wrong'))
  } catch {
    // yield put(showErrorToast("t('error2')"))
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}
export function* watchGetSubjectListFromSchedule() {
  yield takeEvery(ExamPlannerActions.FETCH_SUBJECT_LIST_REQUEST, getSubjectList)
}

function* getSubjectListWithoutStructure({payload}) {
  try {
    const res = yield call(Api.getSubjectsWithoutStructure, payload)
    if (res.status) {
      yield put({
        type: ExamPlannerActions.FETCH_SUBJECT_LIST_REQUEST_SUCCESS,
        payload: res.obj,
      })
    } else yield put(showErrorToast('Something went wrong'))
  } catch {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}
export function* watchGetSubjectWithoutStructureList() {
  yield takeEvery(
    ExamPlannerActions.FETCH_SUBJECT_WITHOUT_STRUCTURE_LIST_REQUEST,
    getSubjectListWithoutStructure
  )
}

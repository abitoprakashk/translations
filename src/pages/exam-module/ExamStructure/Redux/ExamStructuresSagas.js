import {call, put, takeEvery} from '@redux-saga/core/effects'
import {t} from 'i18next'
import * as Api from '../Apis/apis'
import {ExamStructuresActionTypes} from './ExamStructureActionTypes'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import {toCamelCasedKeys} from '../../../../utils/Helpers'

const structureUpdated = 'Structure updated for '

function* setClassesExamStructuresList() {
  try {
    const res = yield call(Api.fetchClassesExamStructures)

    if (res.status)
      yield put({
        type: ExamStructuresActionTypes.SET_CLASSES_EXAM_STRUCTURES,
        payload: res.obj,
      })
    else yield put(showErrorToast(t('genericErrorMessage')))
  } catch {
    yield put(showErrorToast(t('genericErrorMessage')))
  }
}
export function* watchSetClassesExamStructuresList() {
  yield takeEvery(
    ExamStructuresActionTypes.FETCH_CLASSES_EXAM_STRUCTURES,
    setClassesExamStructuresList
  )
}
function* setExamStructureForClass({payload}) {
  try {
    const res = yield call(Api.fetchExamStructureForClass, payload)
    if (res.status)
      yield put({
        type: ExamStructuresActionTypes.SET_EXAM_STRUCTURE_FOR_CLASS,
        payload: res.obj,
      })
    else yield put(showErrorToast(t('genericErrorMessage')))
  } catch {
    yield put(showErrorToast(t('genericErrorMessage')))
  }
}
export function* watchSetExamStructureForClass() {
  yield takeEvery(
    ExamStructuresActionTypes.FETCH_EXAM_STRUCTURES_FOR_CLASS,
    setExamStructureForClass
  )
}

function* postExamStructureForClass({payload}) {
  //   const {t} = useTranslation()
  try {
    const res = yield call(Api.editOrCreateExamStructureForClass, payload)
    if (res.status) {
      yield put({
        type: ExamStructuresActionTypes.POST_EXAM_STRUCTURE_DATA_SAVED,
        payload: res.obj,
      })
      yield put(
        showSuccessToast(
          `${structureUpdated}${payload.standardName || 'class'}`
        )
      )
    } else yield put(showErrorToast(t('genericErrorMessage')))
  } catch {
    yield put(showErrorToast(t('genericErrorMessage')))
  }
}
export function* watchPostExamStructureForClass() {
  yield takeEvery(
    ExamStructuresActionTypes.POST_EXAM_STRUCTURE_DATA,
    postExamStructureForClass
  )
}

function* importExamStructureForClass({payload}) {
  //   const {t} = useTranslation()
  try {
    const res = yield call(Api.importExamStructureForClass, payload)
    if (res.status) {
      yield put({
        type: ExamStructuresActionTypes.FETCH_CLASSES_EXAM_STRUCTURES,
        payload: toCamelCasedKeys(res.obj),
      })
      yield put(showSuccessToast('Structure imported'))
    } else yield put(showErrorToast(t('genericErrorMessage')))
  } catch {
    yield put(showErrorToast(t('genericErrorMessage')))
  }
}
export function* watchImportExamStructureForClass() {
  yield takeEvery(
    ExamStructuresActionTypes.POST_EXAM_STRUCTURE_IMPORT,
    importExamStructureForClass
  )
}

function* postAddToTerm({payload}) {
  //   const {t} = useTranslation()
  try {
    const res = yield call(Api.postAddToTerm, payload)
    if (res.status) {
      yield put({
        type: ExamStructuresActionTypes.SET_EXAM_STRUCTURE_FOR_CLASS,
        payload: toCamelCasedKeys(res.obj),
      })
      yield put(
        showSuccessToast(
          `${structureUpdated}${payload.standardName || 'class'}`
        )
      )
    } else yield put(showErrorToast(t('genericErrorMessage')))
  } catch {
    yield put(showErrorToast(t('genericErrorMessage')))
  }
}
export function* watchAddToTerm() {
  yield takeEvery(
    ExamStructuresActionTypes.POST_ADD_TO_TERM_EXAM,
    postAddToTerm
  )
}

function* fetchExamResult({payload}) {
  //   const {t} = useTranslation()
  try {
    const res = yield call(Api.postAddToTerm, payload)
    if (res.status) {
      yield put({
        type: ExamStructuresActionTypes.SET_EXAM_RESULT,
        payload: toCamelCasedKeys(res.obj),
      })
      yield put(
        showSuccessToast(
          `${structureUpdated}${payload.standardName || 'class'}`
        )
      )
    } else yield put(showErrorToast(t('genericErrorMessage')))
  } catch {
    yield put(showErrorToast(t('genericErrorMessage')))
  }
}
export function* watchFetchExamResult() {
  yield takeEvery(ExamStructuresActionTypes.FETCH_EXAM_RESULT, fetchExamResult)
}

function* fetchGradesCriteria({payload}) {
  try {
    const res = yield call(Api.fetchGradeCriteria, payload)
    if (res.status) {
      yield put({
        type: ExamStructuresActionTypes.SET_GRADES_CRITERIA,
        payload: toCamelCasedKeys(res.obj),
      })
    } else yield put(showErrorToast(t('genericErrorMessage')))
  } catch {
    yield put(showErrorToast(t('genericErrorMessage')))
  }
}
export function* watchFetchGradesCriteria() {
  yield takeEvery(
    ExamStructuresActionTypes.FETCH_GRADES_CRITERIA,
    fetchGradesCriteria
  )
}

function* updateGradesCriteria({payload}) {
  try {
    const res = yield call(Api.updatedGradeCriteria, payload)
    if (res.status) {
      yield put({
        type: ExamStructuresActionTypes.SET_GRADES_CRITERIA,
        payload: toCamelCasedKeys(res.obj),
      })
      yield put(showSuccessToast(t('gradesUpdatedSuccessfully')))
    } else yield put(showErrorToast(t('genericErrorMessage')))
  } catch {
    yield put(showErrorToast(t('genericErrorMessage')))
  }
}
export function* watchUpdateGradesCriteria() {
  yield takeEvery(
    ExamStructuresActionTypes.UPDATE_GRADES_CRITERIA,
    updateGradesCriteria
  )
}

function* getImportStatusInfo({payload}) {
  try {
    const res = yield call(Api.getImportStatusInfo, payload)
    if (res.status) {
      yield put({
        type: ExamStructuresActionTypes.IMPORT_STATUS_INFO_SUCCESSFUL,
        payload: toCamelCasedKeys(res.obj),
      })
    } else yield put(showErrorToast(t('genericErrorMessage')))
  } catch {
    yield put(showErrorToast(t('genericErrorMessage')))
  }
}
export function* watchImportStatusInfo() {
  yield takeEvery(
    ExamStructuresActionTypes.GET_IMPORT_STATUS_INFO,
    getImportStatusInfo
  )
}

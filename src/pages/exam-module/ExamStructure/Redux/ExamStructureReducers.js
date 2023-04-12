import {createTransducer} from '../../../../redux/helpers'
import {ExamStructuresActionTypes} from './ExamStructureActionTypes'
import {deleteExtraFieldsFromAPIResponse} from '../utils/Utils'

const INITIAL_STATE = {
  classesExamStructureList: null,
  classExamStructure: null,
  addToTermExam: null,
  examResult: null,
}

const classesExamStructureListReducer = (state, {payload}) => {
  state.classesExamStructureList = payload
  state.isSaved = false
  return state
}

const classExamStructureReducer = (state, {payload}) => {
  state.classExamStructure = payload
  return state
}
const setAddToTermExamReducer = (state, {payload}) => {
  state.addToTermExam = payload
  return state
}
const setExamResultReducer = (state, {payload}) => {
  state.examResult = payload
  return state
}

const examStructureSavedReducer = (state, {payload}) => {
  state.isSaved = payload
  return state
}

const gradesCriteriaReducer = (state, {payload}) => {
  return {
    ...state,
    gradesCriteria: {...deleteExtraFieldsFromAPIResponse(payload)},
  }
}

const importStatusInfoReducer = (state, {payload}) => {
  return {
    ...state,
    importStatus: payload,
  }
}

const examStructureReducer = {
  [ExamStructuresActionTypes.SET_CLASSES_EXAM_STRUCTURES]:
    classesExamStructureListReducer,
  [ExamStructuresActionTypes.SET_EXAM_STRUCTURE_FOR_CLASS]:
    classExamStructureReducer,
  [ExamStructuresActionTypes.SET_ADD_TO_TERM_EXAM]: setAddToTermExamReducer,
  [ExamStructuresActionTypes.SET_EXAM_RESULT]: setExamResultReducer,
  [ExamStructuresActionTypes.POST_EXAM_STRUCTURE_DATA_SAVED]:
    examStructureSavedReducer,
  [ExamStructuresActionTypes.SET_GRADES_CRITERIA]: gradesCriteriaReducer,
  [ExamStructuresActionTypes.IMPORT_STATUS_INFO_SUCCESSFUL]:
    importStatusInfoReducer,
}
export default createTransducer(examStructureReducer, INITIAL_STATE)

import {ExamStructuresActionTypes} from './ExamStructureActionTypes'

export const fetchClassesExamStructuresAction = () => {
  return {
    type: ExamStructuresActionTypes.FETCH_CLASSES_EXAM_STRUCTURES,
  }
}

export const fetchExamStructuresForClassAction = (classId) => {
  return {
    type: ExamStructuresActionTypes.FETCH_EXAM_STRUCTURES_FOR_CLASS,
    payload: classId,
  }
}

export const postExamStructureData = (payload) => {
  return {
    type: ExamStructuresActionTypes.POST_EXAM_STRUCTURE_DATA,
    payload: payload,
  }
}

export const postExamStructureImport = (payload) => {
  return {
    type: ExamStructuresActionTypes.POST_EXAM_STRUCTURE_IMPORT,
    payload: payload,
  }
}

export const setAddToTermExamAction = (payload) => {
  return {
    type: ExamStructuresActionTypes.SET_ADD_TO_TERM_EXAM,
    payload: payload,
  }
}

export const postAddToTermExam = (payload) => {
  return {
    type: ExamStructuresActionTypes.POST_ADD_TO_TERM_EXAM,
    payload: payload,
  }
}

export const fetchExamResultsAction = (examId) => {
  return {
    type: ExamStructuresActionTypes.FETCH_EXAM_RESULT,
    payload: examId,
  }
}

export const fetchGradesCriteriaAction = (classId) => {
  return {
    type: ExamStructuresActionTypes.FETCH_GRADES_CRITERIA,
    payload: classId,
  }
}

export const updateGradesCriteriaAction = (data) => {
  return {
    type: ExamStructuresActionTypes.UPDATE_GRADES_CRITERIA,
    payload: data,
  }
}

export const getImportStatusInfo = (payload) => {
  return {
    type: ExamStructuresActionTypes.GET_IMPORT_STATUS_INFO,
    payload,
  }
}

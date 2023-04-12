import {ExamPlannerActions} from './ExamPlannerActionTypes'

export const fetchExistingExamsAction = () => {
  return {
    type: ExamPlannerActions.FETCH_EXISTING_EXAMS,
  }
}
export const postExistingExamSchedule = (payload) => {
  return {
    type: ExamPlannerActions.POST_EXSITING_EXAM_SCHEDULE,
    payload: payload,
  }
}

export const getSubjectListAction = (payload) => {
  return {
    type: ExamPlannerActions.FETCH_SUBJECT_LIST_REQUEST,
    payload,
  }
}

export const getSubjectsWithoutStructureListAction = (payload) => {
  return {
    type: ExamPlannerActions.FETCH_SUBJECT_WITHOUT_STRUCTURE_LIST_REQUEST,
    payload,
  }
}

export const subjectListClearAction = () => {
  return {
    type: ExamPlannerActions.FETCH_SUBJECT_LIST_REQUEST_SUCCESS,
    payload: null,
  }
}

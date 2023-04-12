import {createTransducer} from '../../../../../redux/helpers'
import {ExamPlannerActions} from './ExamPlannerActionTypes'

const INITIAL_STATE = {
  existingExams: null,
}

const existingExamsReducer = (state, {payload}) => {
  state.existingExams = payload
  return state
}

const subjectListReducer = (state, {payload}) => {
  state.subjectList = payload
  return state
}

const examPlannerReducer = {
  [ExamPlannerActions.SET_EXISTING_EXAMS]: existingExamsReducer,
  [ExamPlannerActions.FETCH_SUBJECT_LIST_REQUEST_SUCCESS]: subjectListReducer,
}

export default createTransducer(examPlannerReducer, INITIAL_STATE)

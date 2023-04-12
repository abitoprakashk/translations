import ACTIONS from './actionTypes'
import {createTransducer} from '../../../../redux/helpers'
import {toCamelCasedKeys, capitalizeValue} from '../../../../utils/Helpers'
import produce from 'immer'

const INITIAL_STATE = {
  is_report_card_template_available: 1,
  standard_list: {},
  students: [],
  studentsLoading: false,
  selectedTemplateFields: null,
  templateApiInProgress: false,
  sectionEvaluationStructure: {
    loading: false,
    data: [null],
  },
  /* {
    evaluationDetails: {[termId]: {loading, data}}
  } */
  evaluationDetails: {},
  evaluationDrawer: {
    open: false,
    loading: false,
    data: null,
  },
  activeStandard: null,
  activeSection: null,
}

const classTemplateListReducer = (state = INITIAL_STATE, {payload}) => {
  if (payload) return {...toCamelCasedKeys(state), ...toCamelCasedKeys(payload)}
  return toCamelCasedKeys(state)
}

const templateFieldsReducer = (state = INITIAL_STATE, {payload}) => {
  let tmp = {...state}
  if (payload) {
    tmp.selectedTemplateFields = payload
    tmp.isUpdated = false
  }
  return tmp
}

const studentListReducer = (state = INITIAL_STATE, {payload}) => {
  let tmp = {...state}
  tmp.studentsLoading = false
  tmp.students = toCamelCasedKeys(payload) || []
  return tmp
}

const getStudentListReducer = (state = INITIAL_STATE) => {
  let tmp = {...state}
  tmp.studentsLoading = true
  return tmp
}

const templateSaveReducer = (state = INITIAL_STATE) => {
  let temp = {...state}
  temp.templateApiInProgress = true
  return temp
}

const templateSaveFailedReducer = (state = INITIAL_STATE) => {
  let temp = {...state}
  temp.templateApiInProgress = false
  return temp
}

const templateSaveDoneReducer = (state = INITIAL_STATE, {payload}) => {
  let tmp = {...state}
  if (payload) {
    tmp.isUpdated = true
  } else {
    tmp.isUpdated = false
  }
  tmp.templateApiInProgress = false
  return tmp
}

const getSectionEvaluationStructure = (state = INITIAL_STATE) => {
  return produce(state, (draft) => {
    draft.sectionEvaluationStructure.loading = true
    return draft
  })
}

const getSectionEvaluationStructureSuccess = (
  state = INITIAL_STATE,
  {payload}
) => {
  return produce(state, (draft) => {
    draft.sectionEvaluationStructure.loading = false
    draft.sectionEvaluationStructure.data = payload
    return draft
  })
}

const getTermEvaluationDetails = (state = INITIAL_STATE, {payload}) => {
  return produce(state, (draft) => {
    const key = `${payload.term_id}/${payload.section_id}`
    if (!draft.evaluationDetails[key])
      draft.evaluationDetails[key] = {loading: false, data: []}
    draft.evaluationDetails[key].loading = true
    return draft
  })
}

const getTermEvaluationDetailsSuccess = (state = INITIAL_STATE, {payload}) => {
  return produce(state, (draft) => {
    const key = `${payload.term_id}/${payload.section_id}`
    draft.evaluationDetails[key].loading = false
    draft.evaluationDetails[key].data = payload.testData
    draft.evaluationDetails[key].section_name = payload.section_name
    draft.evaluationDetails[key].class_name = payload.class_name
    return draft
  })
}

const getTermEvaluationDetailsError = (state = INITIAL_STATE, {payload}) => {
  return produce(state, (draft) => {
    const key = `${payload.term_id}/${payload.section_id}`
    draft.evaluationDetails[key].loading = false
    draft.evaluationDetails[key].data = []
    return draft
  })
}

const removeTermEvaluationDetails = (state = INITIAL_STATE, {payload}) => {
  return produce(state, (draft) => {
    const key = `${payload.term_id}/${payload.section_id}`
    delete draft.evaluationDetails[key]
    return draft
  })
}

const openEvaluationDrawer = (state = INITIAL_STATE, {payload}) => {
  return produce(state, (draft) => {
    draft.evaluationDrawer.loading = false
    draft.evaluationDrawer.open = true
    draft.evaluationDrawer.data = payload
    return draft
  })
}

const closeEvaluationDrawer = (state = INITIAL_STATE) => {
  return produce(state, (draft) => {
    draft.evaluationDrawer.loading = false
    draft.evaluationDrawer.open = false
    draft.evaluationDrawer.data = null
    return draft
  })
}

const getValidateResponseReducer = (state = INITIAL_STATE, {payload}) => {
  return {
    ...state,
    csvValidationResult: payload,
    csvValidationResultFailed: false,
  }
}

const getValidateResponseFailedReducer = (state = INITIAL_STATE) => {
  return {...state, csvValidationResultFailed: true}
}

const getCurrentMarksheetCSV = (state = INITIAL_STATE, {payload}) => {
  return {...state, currentMarksheetCSV: payload}
}

const getErrorMarksheetCSV = (state = INITIAL_STATE, {payload}) => {
  return {...state, errorMarksheetCSV: payload}
}

const studentExamStructureReducer = (state = INITIAL_STATE, {payload}) => {
  let structure = {}
  if (payload) {
    structure = payload
  }
  let exams = {}
  structure.scholistic.forEach((item) => {
    if (!exams[item.term_id]) {
      exams[item.term_id] = []
    }
    exams[item.term_id].push(item)
  })
  exams['additional'] = []
  let keys = Object.keys(structure.additional)
  for (let i = 0; i < keys.length; i++) {
    if (structure.additional[keys[i]]) {
      exams['additional'].push({
        _id: keys[i],
        name: capitalizeValue(keys[i]),
        order: i + 1,
      })
    }
  }

  let terms = structure.terms.map((item) => ({
    id: item._id,
    label: item.name,
  }))
  terms.push({id: 'additional', label: 'Others'})

  structure = {
    ...structure,
    terms,
    scholistic: exams,
  }
  return {...state, structure}
}

const studentExamMarksReducer = (state = INITIAL_STATE, {payload}) => {
  if (payload) {
    let studentMarks = {...state.studentMarks} || {}
    let keys = Object.keys(payload.scholastic)
    studentMarks[payload._id] = payload.scholastic[keys[0]]
    return {...state, studentMarks}
  } else {
    return {...state, studentMarks: null}
  }
}

const studentExamMarksUpdateReducer = (state = INITIAL_STATE, {payload}) => {
  return {...state, studentMarks: payload}
}

const updateActiveStandardAndSection = (state = INITIAL_STATE, {payload}) => {
  return produce(state, (draft) => {
    draft.activeStandard = payload.standard
    draft.activeSection = payload.section
    return draft
  })
}

const marksUpdatedFromCSVReducer = (state = INITIAL_STATE, {payload}) => {
  return produce(state, (draft) => {
    draft.updatedFromCSV = payload
    return draft
  })
}

const getStudentFieldsReducer = (state = INITIAL_STATE, {payload}) => {
  return produce(state, (draft) => {
    draft.studentFields = payload
    return draft
  })
}

const reportCardReducer = {
  [ACTIONS.REPORT_CARD_TEMPLATE_SUCCESS]: classTemplateListReducer,
  [ACTIONS.TEMPLATE_FILEDS_REQUEST_SUCCESSFUL]: templateFieldsReducer,
  [ACTIONS.TEMPLATE_FILEDS_UPDATE_SUCCESSFUL]: templateSaveDoneReducer,
  [ACTIONS.GET_STUDENT_LIST_REQUEST]: getStudentListReducer,
  [ACTIONS.STUDENT_LIST_SUCCESSFUL]: studentListReducer,
  [ACTIONS.GET_SECTION_EVALUATION_STRUCTURE]: getSectionEvaluationStructure,
  [ACTIONS.GET_SECTION_EVALUATION_STRUCTURE_SUCCESS]:
    getSectionEvaluationStructureSuccess,
  [ACTIONS.REMOVE_TERM_EVALUATION_DETAILS]: removeTermEvaluationDetails,
  [ACTIONS.GET_TERM_EVALUATION_DETAILS]: getTermEvaluationDetails,
  [ACTIONS.GET_TERM_EVALUATION_DETAILS_SUCCESS]:
    getTermEvaluationDetailsSuccess,
  [ACTIONS.GET_TERM_EVALUATION_DETAILS_ERROR]: getTermEvaluationDetailsError,
  [ACTIONS.OPEN_EVALUATION]: openEvaluationDrawer,
  [ACTIONS.CLOSE_EVALUATION]: closeEvaluationDrawer,
  [ACTIONS.UPDATE_ACTIVE_STANDARD_AND_SECTION]: updateActiveStandardAndSection,
  [ACTIONS.GET_VALIDATE_RESPONSE]: getValidateResponseReducer,
  [ACTIONS.VALIDATE_RESPONSE_FAILED]: getValidateResponseFailedReducer,
  [ACTIONS.CURRENT_MARKSHEET_CSV_SUCCESSFUL]: getCurrentMarksheetCSV,
  [ACTIONS.ERROR_MARKSHEET_CSV_SUCCESSFUL]: getErrorMarksheetCSV,
  [ACTIONS.STUDENT_EXAM_STRUCTURE_SUCCESS]: studentExamStructureReducer,
  [ACTIONS.UPDATE_EXAM_MARKS_DETAILS]: studentExamMarksReducer,
  [ACTIONS.UPDATE_LOCAL_EXAM_MARKS_DETAILS]: studentExamMarksUpdateReducer,
  [ACTIONS.UPDATE_MARKS_FROM_CSV_SUCCESSFUL]: marksUpdatedFromCSVReducer,
  [ACTIONS.SAVE_AS_DRAFT_REQUEST]: templateSaveReducer,
  [ACTIONS.SAVE_AS_DRAFT_SUCCESSFUL]: templateSaveDoneReducer,
  [ACTIONS.SAVE_AS_DRAFT_FAILED]: templateSaveFailedReducer,
  [ACTIONS.GET_STUDENT_FIELDS_SUCCESSFUL]: getStudentFieldsReducer,
}

export default createTransducer(
  reportCardReducer,
  toCamelCasedKeys(INITIAL_STATE)
)

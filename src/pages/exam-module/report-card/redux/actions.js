import ACTIONS from './actionTypes'

export const getClassTemplateListAction = () => {
  return {
    type: ACTIONS.REPORT_CARD_TEMPLATE_REQUEST,
  }
}

export const getTemplateFields = (payload) => {
  return {
    type: ACTIONS.TEMPLATE_FILEDS_REQUEST,
    payload,
  }
}

export const generateTemplate = (payload) => {
  return {
    type: ACTIONS.GENERATE_TEMPLATE_REQUEST,
    payload,
  }
}

export const generateReportCard = (payload) => {
  return {
    type: ACTIONS.GENERATE_REPORT_CARDS_REQUEST,
    payload,
  }
}

export const getStudentList = (payload) => {
  return {
    type: ACTIONS.GET_STUDENT_LIST_REQUEST,
    payload,
  }
}

export const stopPolling = () => {
  return {
    type: ACTIONS.STOP_POLLING,
    payload: true,
  }
}

export const getSectionEvaluationStructure = (payload) => ({
  type: ACTIONS.GET_SECTION_EVALUATION_STRUCTURE,
  payload,
})

export const getTermEvaluationDetails = (payload) => ({
  type: ACTIONS.GET_TERM_EVALUATION_DETAILS,
  payload,
})

export const removeTermEvaluationDetails = (payload) => ({
  type: ACTIONS.REMOVE_TERM_EVALUATION_DETAILS,
  payload,
})

export const openEvaluationDrawer = (payload) => ({
  type: ACTIONS.OPEN_EVALUATION,
  payload,
})

export const closeEvaluationDrawer = (payload) => ({
  type: ACTIONS.CLOSE_EVALUATION,
  payload,
})

export const updateActiveStandardAndSection = (payload) => ({
  type: ACTIONS.UPDATE_ACTIVE_STANDARD_AND_SECTION,
  payload,
})

export const getStudentExamStructure = (payload) => {
  return {
    type: ACTIONS.GET_STUDENT_EXAM_STRUCTURE,
    payload,
  }
}

export const validateCSVdata = (payload) => {
  return {
    type: ACTIONS.VALIDATE_CSV_DATA,
    payload,
  }
}

export const getExamMarksDetails = (payload) => {
  return {
    type: ACTIONS.GET_EXAM_MARKS_DETAILS,
    payload,
  }
}

export const updateExamMarksDetails = (payload) => {
  return {
    type: ACTIONS.UPDATE_EXAM_MARKS_DETAILS,
    payload,
  }
}

export const updateLocalExamMarksDetails = (payload) => {
  return {
    type: ACTIONS.UPDATE_LOCAL_EXAM_MARKS_DETAILS,
    payload,
  }
}

export const resetExamMarksDetails = () => {
  return {
    type: ACTIONS.UPDATE_EXAM_MARKS_DETAILS,
    payload: null,
  }
}

export const saveStudentMarksChange = (payload) => {
  return {
    type: ACTIONS.SAVE_STUDENT_MARKS_CHANGES,
    payload,
  }
}

export const validateDataReset = () => {
  return {
    type: ACTIONS.GET_VALIDATE_RESPONSE,
    payload: null,
  }
}

export const resetCurrentMarksheetCSVdata = () => {
  return {
    type: ACTIONS.CURRENT_MARKSHEET_CSV_SUCCESSFUL,
    payload: null,
  }
}

export const downloadCSVcurrent = (param) => {
  return {
    type: ACTIONS.DOWNLOAD_CSV_CURRENT_MARKSHEET,
    payload: param,
  }
}

export const downloadErrorCSV = (payload) => {
  return {
    type: ACTIONS.DOWNLOAD_CSV_WITH_ERROR_MARKSHEET,
    payload,
  }
}

export const resetErrorCSVData = () => {
  return {
    type: ACTIONS.ERROR_MARKSHEET_CSV_SUCCESSFUL,
    payload: null,
  }
}

export const updateMarksFromCSV = (payload) => {
  return {
    type: ACTIONS.UPDATE_MARKS_FROM_CSV,
    payload,
  }
}

export const resetUpdatedFromCSVAction = () => {
  return {
    type: ACTIONS.UPDATE_MARKS_FROM_CSV_SUCCESSFUL,
    payload: false,
  }
}

export const saveAsDraftAction = (payload) => {
  return {
    type: ACTIONS.SAVE_AS_DRAFT_REQUEST,
    payload,
  }
}

export const publishTemplateAction = (payload) => {
  return {
    type: ACTIONS.PUBLISH_TEMPLATE_REQUEST,
    payload,
  }
}

export const resetSavedFlag = () => {
  return {
    type: ACTIONS.TEMPLATE_FILEDS_UPDATE_SUCCESSFUL,
  }
}

export const getStudentDetailFieldsAction = () => {
  return {
    type: ACTIONS.GET_STUDENT_FIELDS_REQUEST,
  }
}

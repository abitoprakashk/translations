import {CONTENT_ACTION_TYPES} from '../actionTypes'

export const setPageAction = (selectedPage) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_PAGE,
    payload: selectedPage,
  }
}

export const setClassAction = (selectedClass) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_CLASS,
    payload: selectedClass,
  }
}

export const setSubjectAction = (selectedSubject) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_SUBJECT,
    payload: selectedSubject,
  }
}

export const setTopicAction = (selectedTopic) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_TOPIC,
    payload: selectedTopic,
  }
}

export const clearTopicAction = () => ({
  type: CONTENT_ACTION_TYPES.CLEAR_TOPICS,
})

export const setContentAction = (selectedContent) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_CONTENT,
    payload: selectedContent,
  }
}
export const setLanguageAction = (selectedLanguage) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_LANGUAGE,
    payload: selectedLanguage,
  }
}

export const setCourseAction = (selectedCourse) => ({
  type: CONTENT_ACTION_TYPES.SET_COURSE,
  payload: selectedCourse,
})

export const fetchTaxonomyAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_REQUESTED,
    payload,
  }
}

export const fetchClassTaxonomyAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_REQUESTED,
    payload,
  }
}

export const clearContentAction = () => ({
  type: CONTENT_ACTION_TYPES.CLEAR_CONTENT,
})

export const fetchSubjectTaxonomyAction = ({field, language, classId}) => {
  return {
    type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_REQUESTED,
    payload: {
      field,
      language,
      parent_id: classId,
    },
  }
}

export const fetchTopicTaxonomyAction = ({field, language, subjectId}) => {
  return {
    type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_REQUESTED,
    payload: {
      field,
      language,
      parent_id: subjectId,
    },
  }
}

export const setSubjectListAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_SUBJECT_LIST_SUCCESS,
    payload,
  }
}

export const fetchContentListRequestAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.FETCH_CONTENT_LIST_REQUEST,
    payload,
  }
}

export const setContentForReportAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_CONTENT_FOR_REPORT,
    payload,
  }
}

export const setIsContentReportedAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_IS_CONTENT_REPORTED,
    payload,
  }
}

export const resetStateAction = () => {
  return {
    type: CONTENT_ACTION_TYPES.RESET_STATE,
  }
}

export const setContentListLoader = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_CONTENT_LIST_LOADER,
    payload,
  }
}

export const setlanguageListAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_LANGUAGE_LIST,
    payload,
  }
}
export const contentAccessCheckRequestedAction = (instituteId) => {
  return {
    type: CONTENT_ACTION_TYPES.CONTENT_ACCESS_CHECK_REQUESTED,
    payload: {instituteId},
  }
}

export const accessAccessCheckLoaderAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.CONTENT_ACCESS_CHECK_LOADER,
    payload,
  }
}

export const setLanguageLoaderAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_LANGUAGE_LOADER,
    payload,
  }
}

export const setContentAccessCheckPopupAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.CONTENT_ACCESS_CHECK_POPUP,
    payload,
  }
}

export const fetchContentAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.FETCH_CONTENT,
    payload,
  }
}

export const setIsVideoModalOpenAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.SET_IS_VIDEO_MODAL_OPEN,
    payload,
  }
}

export const isStudyMaterialContentSetAction = (payload) => {
  return {
    type: CONTENT_ACTION_TYPES.IS_STUDY_MATERIAL_CONTENT_SET,
    payload,
  }
}

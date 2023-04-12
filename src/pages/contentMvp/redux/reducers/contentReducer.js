import {CONTENT_ACTION_TYPES} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'
import {PAGES} from '../../constants'
import {getContentStats} from '../../commonFunctions'

const INITIAL_STATE = {
  page: PAGES.classPage,
  languageLoader: false,
  language: null,
  languageList: {},
  currentLanguage: null,
  taxonomyLoader: false,
  class: null,
  classList: {},
  courses: [],
  subject: null,
  subjectList: {},
  topic: null,
  topicList: {},
  contentListLoader: false,
  contentList: [],
  currentContent: null,
  contentForReport: null,
  isContentReported: false,
  accessAccessCheckLoader: false,
  contentAccessCheckRequested: true,
  contentAccessCheckPopup: false,
  isVideoModalOpen: false,
  isStudyMaterialContentSet: false,
}

const pageReducer = (state, {payload}) => {
  return {
    ...state,
    page: payload,
  }
}

const classReducer = (state, {payload}) => {
  return {
    ...state,
    class: payload,
  }
}

const subjectReducer = (state, {payload}) => {
  return {
    ...state,
    subject: payload,
  }
}

const topicReducer = (state, {payload}) => {
  return {
    ...state,
    topic: payload,
  }
}

const setTopicListReducer = (state, {payload}) => {
  return {
    ...state,
    taxonomyLoader: false,
    topicList: getContentStats(payload),
  }
}

const currentContentReducer = (state, {payload}) => {
  return {
    ...state,
    currentContent: payload,
  }
}

const languageReducer = (state, {payload}) => {
  return {
    ...state,
    currentLanguage: payload,
  }
}

const courseReducer = (state, {payload}) => {
  return {
    ...state,
    selectedCourse: payload,
  }
}

const languageLoaderReducer = (state, {payload}) => {
  return {
    ...state,
    languageLoader: payload,
  }
}
const languageListReducer = (state, {payload}) => {
  const {list, course} = payload
  return {
    ...state,
    languageLoader: false,
    languageList: {
      ...state.languageList,
      [course]: list,
    },
  }
}

const classListRequestedReducer = (state) => {
  return {
    ...state,
    taxonomyLoader: true,
  }
}

const classListSuccessReducer = (state, {payload}) => {
  return {
    ...state,
    taxonomyLoader: false,
    classList: getContentStats(payload),
  }
}

const courseListSuccessReducer = (state, {payload: courses}) => {
  return {
    ...state,
    taxonomyLoader: false,
    courses: courses,
  }
}

const clearContentReducer = (state) => ({
  ...state,
  currentLanguage: null,
  class: null,
  classList: {},
  subject: null,
  subjectList: {},
  topic: null,
  topicList: {},
})

const clearTopicReducer = (state) => ({
  ...state,
  topic: null,
  topicList: {},
})

const classListFailedReducer = (state) => {
  return {
    ...state,
    taxonomyLoader: false,
  }
}

const setTaxonomyLoaderReducer = (state) => {
  return {
    ...state,
    taxonomyLoader: false,
  }
}

const setSubjectListSuccessReducer = (state, {payload}) => {
  return {
    ...state,
    taxonomyLoader: false,
    subjectList: getContentStats(payload),
  }
}

const setContentListLoaderReducer = (state, {payload}) => {
  return {
    ...state,
    contentListLoader: payload,
  }
}

const setContentListReducer = (state, {payload}) => {
  return {
    ...state,
    contentList: payload,
  }
}

const setContentListLoadMoreDataReducer = (state, {payload}) => {
  return {
    ...state,
    contentList: [...state.contentList, ...payload],
  }
}

const setContentForReportReducer = (state, {payload}) => {
  return {
    ...state,
    contentForReport: payload,
  }
}

const setContentReportedReducer = (state, {payload}) => {
  return {
    ...state,
    isContentReported: payload,
  }
}
// const contentAccessCheckRequestedReducer = (state) => {
//   return {
//     ...state,
//     contentAccessCheckRequested: false,
//   }
// }

const contentAccessCheckSuccessReducer = (state, {payload}) => {
  return {
    ...state,
    contentAccessCheckRequested: payload,
    accessAccessCheckLoader: false,
  }
}

const contentAccessCheckPopupReducer = (state, {payload}) => {
  return {
    ...state,
    contentAccessCheckPopup: payload,
  }
}

const accessAccessCheckLoaderReducer = (state, {payload}) => {
  return {
    ...state,
    accessAccessCheckLoader: payload,
  }
}

const isVideoModalOpenReducer = (state, {payload}) => {
  return {
    ...state,
    isVideoModalOpen: payload,
  }
}

const isStudyMaterialContentSetReducer = (state, {payload}) => {
  return {
    ...state,
    isStudyMaterialContentSet: payload,
  }
}

const resetStateReducer = (state) => {
  return {
    ...state,
    page: PAGES.classPage,
    languageLoader: false,
    language: '',
    languageList: {},
    currentLanguage: null,
    taxonomyLoader: false,
    class: null,
    classList: {},
    subject: null,
    subjectList: {},
    topic: null,
    topicList: {},
    contentListLoader: false,
    contentList: [],
    currentContent: null,
    contentForReport: null,
    isContentReported: false,
    accessAccessCheckLoader: false,
    // contentAccessCheckRequested: false,
    // contentAccessCheckPopup: false,
    isVideoModalOpen: false,
    isStudyMaterialContentSet: false,
  }
}

const announcementReducer = {
  [CONTENT_ACTION_TYPES.SET_PAGE]: pageReducer,
  [CONTENT_ACTION_TYPES.SET_CLASS]: classReducer,
  [CONTENT_ACTION_TYPES.SET_SUBJECT]: subjectReducer,
  [CONTENT_ACTION_TYPES.SET_TOPIC]: topicReducer,
  [CONTENT_ACTION_TYPES.SET_TOPIC_LIST]: setTopicListReducer,
  [CONTENT_ACTION_TYPES.SET_CONTENT]: currentContentReducer,
  [CONTENT_ACTION_TYPES.SET_LANGUAGE_LOADER]: languageLoaderReducer,
  [CONTENT_ACTION_TYPES.SET_LANGUAGE]: languageReducer,
  [CONTENT_ACTION_TYPES.CLEAR_CONTENT]: clearContentReducer,
  [CONTENT_ACTION_TYPES.CLEAR_TOPICS]: clearTopicReducer,
  [CONTENT_ACTION_TYPES.SET_COURSE]: courseReducer,
  [CONTENT_ACTION_TYPES.SET_LANGUAGE_LIST]: languageListReducer,
  [CONTENT_ACTION_TYPES.FETCH_TAXONOY_REQUESTED]: classListRequestedReducer,
  [CONTENT_ACTION_TYPES.FETCH_TAXONOY_CLASS_LIST_SUCCESS]:
    classListSuccessReducer,
  [CONTENT_ACTION_TYPES.FETCH_TAXONOY_SUCCESS]: setTaxonomyLoaderReducer,
  [CONTENT_ACTION_TYPES.FETCH_TAXONOY_FAILED]: classListFailedReducer,

  [CONTENT_ACTION_TYPES.FETCH_TAXONOY_SUBJECT_LIST_SUCCESS]:
    setSubjectListSuccessReducer,
  [CONTENT_ACTION_TYPES.SET_CONTENT_LIST_LOADER]: setContentListLoaderReducer,
  [CONTENT_ACTION_TYPES.FETCH_CONTENT_LIST_SUCCESS]: setContentListReducer,
  [CONTENT_ACTION_TYPES.FETCH_CONTENTLIST_LOAD_MORE_DATA]:
    setContentListLoadMoreDataReducer,
  [CONTENT_ACTION_TYPES.SET_CONTENT_FOR_REPORT]: setContentForReportReducer,
  [CONTENT_ACTION_TYPES.SET_IS_CONTENT_REPORTED]: setContentReportedReducer,
  [CONTENT_ACTION_TYPES.RESET_STATE]: resetStateReducer,
  [CONTENT_ACTION_TYPES.CONTENT_ACCESS_CHECK_POPUP]:
    contentAccessCheckPopupReducer,
  [CONTENT_ACTION_TYPES.CONTENT_ACCESS_CHECK_SUCCESS]:
    contentAccessCheckSuccessReducer,
  [CONTENT_ACTION_TYPES.CONTENT_ACCESS_CHECK_LOADER]:
    accessAccessCheckLoaderReducer,
  [CONTENT_ACTION_TYPES.SET_IS_VIDEO_MODAL_OPEN]: isVideoModalOpenReducer,
  [CONTENT_ACTION_TYPES.IS_STUDY_MATERIAL_CONTENT_SET]:
    isStudyMaterialContentSetReducer,
  [CONTENT_ACTION_TYPES.FETCH_COURSE_LIST_SUCCESS]: courseListSuccessReducer,
}

export default createTransducer(announcementReducer, INITIAL_STATE)

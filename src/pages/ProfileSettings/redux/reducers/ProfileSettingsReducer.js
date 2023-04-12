import {createTransducer} from '../../../../redux/helpers'
import produce from 'immer'
import {ProfileSettingsActionTypes} from '../../actionTypes'
import {getCurrentDate, getUTCTimeStamp} from '../../commonFunctions'

const INITIAL_STATE = {
  staffAttendanceSelectedDate: getCurrentDate(),
  selectedDateUTCTimestamp: getUTCTimeStamp(getCurrentDate()),

  isPersonaProfileSettingsLoading: true,
  personaProfileSettingsRequestParams: null,
  personaProfileSettingsData: null,
  personaProfileSettingsFailedMessage: null,

  personaCategoryListData: null,

  addCategoryFormRequestParams: null,
  addCategoryFormSuccessMsg: null,
  addCategoryFormFailedMsg: null,

  isCategoryFieldsSettingsLoading: true,
  categoryAndFieldsSettingsData: null,

  personaWiseDocumentCategoryListData: null,
  isDocumentCategoryFieldsSettingsLoading: true,
  documentCategoryAndFieldsSettingsData: null,
}

// Get persona profile settings
const personaProfileSettingsRequestReducer = (state, {payload}) => {
  return {
    ...state,
    isPersonaProfileSettingsLoading: true,
    personaProfileSettingsRequestParams: payload,
  }
}
const personaProfileSettingsSucceededReducer = (state, {payload}) => {
  return {
    ...state,
    isPersonaProfileSettingsLoading: false,
    personaProfileSettingsData: payload,
  }
}
const personaProfileSettingsFailedReducer = (state, {payload}) => {
  return {
    ...state,
    isPersonaProfileSettingsLoading: false,
    personaProfileSettingsFailedMessage: payload,
  }
}

// Get persona wise categories data
const getPersonaWiseCategoriesReducer = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.isPersonaProfileSettingsLoading = false
    draft.personaCategoryListData = payload
    draft.categoryAndFieldsSettingsData = null
    draft.isCategoryFieldsSettingsLoading = false
    return draft
  })
}

// Add category Form
const addCategoryFormSubmitRequestReducer = (state, {payload}) => {
  return {
    ...state,
    isPersonaProfileSettingsLoading: true,
    addCategoryFormRequestParams: payload,
  }
}
const addCategoryFormSubmitSucceededReducer = (state, {payload}) => {
  return {
    ...state,
    isPersonaProfileSettingsLoading: false,
    addCategoryFormSuccessMsg: payload,
  }
}
const addCategoryFormSubmitFailedReducer = (state, {payload}) => {
  return {
    ...state,
    isPersonaProfileSettingsLoading: false,
    addCategoryFormFailedMsg: payload,
  }
}

// Get category and their fields settings data
const getCategoryAndFieldsSettingsDataReducer = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.categoryAndFieldsSettingsData = payload
    draft.isCategoryFieldsSettingsLoading = false
    return draft
  })
}

// Get persona wise document categories
const getPersonaWiseDocumentCategoriesReducer = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.isPersonaProfileSettingsLoading = false
    draft.personaWiseDocumentCategoryListData = payload
    draft.documentCategoryAndFieldsSettingsData = null
    draft.isDocumentCategoryFieldsSettingsLoading = false
    return draft
  })
}

const profileSettingsReducer = {
  // Profile Settings Get Reducer
  [ProfileSettingsActionTypes.GET_PERSONA_PROFILE_SETTINGS]:
    personaProfileSettingsRequestReducer,
  [ProfileSettingsActionTypes.PERSONA_PROFILE_SETTINGS_GET_SUCCEEDED]:
    personaProfileSettingsSucceededReducer,
  [ProfileSettingsActionTypes.PERSONA_PROFILE_SETTINGS_GET_FAILED]:
    personaProfileSettingsFailedReducer,

  // Get Persona wise profile information categories
  [ProfileSettingsActionTypes.GET_PERSONA_WISE_CATEGORIES]:
    getPersonaWiseCategoriesReducer,

  // Add Category Form Sumbit Reducer
  [ProfileSettingsActionTypes.ADD_CATEGORY_FORM_SUBMIT_REQUEST]:
    addCategoryFormSubmitRequestReducer,
  [ProfileSettingsActionTypes.ADD_CATEGORY_FORM_SUBMIT_SUCCEEDED]:
    addCategoryFormSubmitSucceededReducer,
  [ProfileSettingsActionTypes.ADD_CATEGORY_FORM_SUBMIT_FAILED]:
    addCategoryFormSubmitFailedReducer,

  // Get Category and Their Fields Settings Data Reducer
  [ProfileSettingsActionTypes.GET_CATEGORY_AND_FIELDS_SETTINGS_DATA]:
    getCategoryAndFieldsSettingsDataReducer,

  // Get Persona wise profile information categories
  [ProfileSettingsActionTypes.GET_DOCUMENT_CATEGORIES_REQUEST]:
    getPersonaWiseDocumentCategoriesReducer,
}

export default createTransducer(profileSettingsReducer, INITIAL_STATE)

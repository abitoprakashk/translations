import {ProfileSettingsActionTypes} from '../../actionTypes'

// Fetch Persona Profile Settings Request
export const fetchPersonaProfileSettingsRequestAction = (request) => {
  return {
    type: ProfileSettingsActionTypes.GET_PERSONA_PROFILE_SETTINGS,
    payload: request,
  }
}

// Prepare persona wise profile information categories
export const fetchCategoriesRequestAction = (request) => {
  return {
    type: ProfileSettingsActionTypes.GET_PERSONA_WISE_CATEGORIES,
    payload: request,
  }
}

// Prepare persona wise profile document categories
export const fetchDocumentCategoriesRequestAction = (request) => {
  return {
    type: ProfileSettingsActionTypes.GET_DOCUMENT_CATEGORIES_REQUEST,
    payload: request,
  }
}

// Add Category Form Submit Request
export const addCategoryFormSubmitRequestAction = (request) => {
  return {
    type: ProfileSettingsActionTypes.ADD_CATEGORY_FORM_SUBMIT_REQUEST,
    payload: request,
  }
}

// Get Category and Their Fields Settings Data
export const getCategoryAndFieldsSettingsAction = (request) => {
  return {
    type: ProfileSettingsActionTypes.GET_CATEGORY_AND_FIELDS_SETTINGS_DATA,
    payload: request,
  }
}

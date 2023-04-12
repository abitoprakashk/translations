import feeStructureActionTypes from './feeStructureActionTypes'

// Fetch fee structure requested
export const fetchFeeStructuresRequestedAction = () => {
  return {
    type: feeStructureActionTypes.FETCH_FEE_STRUCTURES_REQUESTED,
  }
}

export const fetchPreviousSessionDuesAction = () => {
  return {
    type: feeStructureActionTypes.FETCH_PREVIOUS_SESSION_DUES,
  }
}

// Fetch fee structure succeeded
export const fetchFeeStructuresSucceededAction = (payload) => {
  return {
    type: feeStructureActionTypes.FETCH_FEE_STRUCTURES_SUCCEEDED,
    payload,
  }
}

// Fetch fee structure failed
export const fetchFeeStructuresFailedAction = () => {
  return {
    type: feeStructureActionTypes.FETCH_FEE_STRUCTURES_FAILED,
  }
}

// Fetch fee categories requested
export const fetchFeeCategoriesRequestedAction = () => {
  return {
    type: feeStructureActionTypes.FETCH_FEE_CATEGORIES_REQUESTED,
  }
}

// Fetch fee categories succeeded
export const fetchFeeCategoriesSucceededAction = (payload) => {
  return {
    type: feeStructureActionTypes.FETCH_FEE_CATEGORIES_SUCCEEDED,
    payload,
  }
}

// Fetch fee categories failed
export const fetchFeeCategoriesFailedAction = () => {
  return {
    type: feeStructureActionTypes.FETCH_FEE_CATEGORIES_FAILED,
  }
}

// Fetch used fee categories requested
export const fetchUsedFeeCategoriesRequestedAction = (payload) => {
  return {
    type: feeStructureActionTypes.FETCH_USED_FEE_CATEGORIES_REQUESTED,
    payload,
  }
}

// Fetch used fee categories succeeded
export const fetchUsedFeeCategoriesSucceededAction = (payload) => {
  return {
    type: feeStructureActionTypes.FETCH_USED_FEE_CATEGORIES_SUCCEEDED,
    payload,
  }
}

export const fetchFeeTypesRequestedAction = () => {
  return {
    type: feeStructureActionTypes.FETCH_FEE_CATEGORIES_REQUESTED,
    payload: null,
  }
}

export const setCustomCategoryStateAction = (payload) => {
  return {
    type: feeStructureActionTypes.SET_CUSTOM_CATEGORY_STATE,
    payload,
  }
}

export const fetchFeeSettingRequestAction = () => {
  return {
    type: feeStructureActionTypes.FETCH_FEE_SETTING_REQUEST,
    payload: null,
  }
}

export const setTransportStructureTypeAction = (payload) => {
  return {
    type: feeStructureActionTypes.SET_TRANSPORT_STRUCTURE_TYPE,
    payload,
  }
}

// Fetch fee webinar status
export const fetchFeeWebinarStatusAction = () => {
  return {
    type: feeStructureActionTypes.FETCH_FEE_WEBINAR_STATUS,
  }
}

export const setFeeWebinarStatusAction = (payload) => {
  return {
    type: feeStructureActionTypes.FETCH_FEE_WEBINAR_STATUS_SUCCESS,
    payload,
  }
}

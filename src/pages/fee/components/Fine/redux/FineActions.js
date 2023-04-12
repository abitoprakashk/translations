import {feeFineActionTypes} from './ActionTypes'

export const setFeeFineStatesAction = (payload) => {
  return {
    type: feeFineActionTypes.SET_FEE_FINE_STATES,
    payload,
  }
}

export const fetchFeeFineRulesAction = () => {
  return {
    type: feeFineActionTypes.FETCH_FEE_FINE_RULES,
  }
}

export const saveRuleConfigurationAction = (payload, metaData = {}) => {
  return {
    type: feeFineActionTypes.SAVE_RULE_CONFIGURATION_REQUEST,
    payload: {payload, metaData},
  }
}

export const fetchFeeFinedStudentListAction = () => {
  return {
    type: feeFineActionTypes.FETCH_FEE_FINE_STUDENT_LISTING_REQUEST,
  }
}

export const deleteFeeFineRuleAction = (payload, metaData = {}) => {
  return {
    type: feeFineActionTypes.DELETE_FEE_FINE_RULE,
    payload: {payload, metaData},
  }
}

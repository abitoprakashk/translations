import {createTransducer} from '../../../../../redux/helpers'
import {feeFineActionTypes} from './ActionTypes'

const defaultStates = {
  loader: false,
  fineRuleLoader: false,
  saveFineRuleLoader: false,
  fineRules: [],
  finedUserResponseloader: false,
  finedUserResponse: {},
  isConfigureRuleSliderOpen: false,
  isDeleteRuleModalOpen: false,
}

const INITIAL_STATE = {...defaultStates}

const setStatesReducer = (states, {payload}) => {
  return {...states, ...payload}
}

const resetStatesReducer = (states) => {
  return {...states, ...defaultStates}
}

const feeFineReducer = {
  [feeFineActionTypes.SET_FEE_FINE_STATES]: setStatesReducer,
  [feeFineActionTypes.RESET_FEE_FINE_STATES]: resetStatesReducer,
}

export default createTransducer(feeFineReducer, INITIAL_STATE)

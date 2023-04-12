import {schedulerActionType} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'

const INITIAL_STATE = {
  rulesList: [],
  templateList: [],
  sendMessages: {},
  ruleInstances: [],
  loadingInfo: {
    rules: false,
    templates: false,
    messages: false,
    ruleInstances: false,
  },
}

const rulesListReducer = (state, {payload}) => {
  return {
    ...state,
    rulesList: payload,
  }
}
const templatesListReducer = (state, {payload}) => {
  return {
    ...state,
    templateList: payload,
  }
}

const sendMessagesReducer = (state, {payload}) => {
  const {rule_id, data} = payload

  return {
    ...state,
    sendMessages: {
      ...state.sendMessages,
      [rule_id]: data,
    },
  }
}

const ruleInstancesReducer = (state, {payload}) => ({
  ...state,
  ruleInstances: payload,
})

const loadingInfoReducer = (state, {payload}) => ({
  ...state,
  loadingInfo: {...state.loadingInfo, ...payload},
})

const schedulerReducer = {
  [schedulerActionType.SET_RULES_LIST]: rulesListReducer,
  [schedulerActionType.SET_TEMPLATES]: templatesListReducer,
  [schedulerActionType.SET_AUTOMATED_MESSAGES]: sendMessagesReducer,
  [schedulerActionType.SET_RULE_INSTANCES]: ruleInstancesReducer,
  [schedulerActionType.TOGGLE_SCHEDULER_LOADER]: loadingInfoReducer,
}

export default createTransducer(schedulerReducer, INITIAL_STATE)

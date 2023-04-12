import {schedulerActionType} from '../actionTypes'

export const addOrUpdateRule = (payload) => {
  return {type: schedulerActionType.UPDATE_RULE, payload}
}
export const getRulesList = (params) => {
  return {type: schedulerActionType.FETCH_RULES_LIST, payload: params}
}
export const setRulesList = (payload) => {
  return {type: schedulerActionType.SET_RULES_LIST, payload}
}
export const getTemplatesList = () => {
  return {type: schedulerActionType.FETCH_TEMPLATES}
}
export const setTemplatesList = (payload) => {
  return {type: schedulerActionType.SET_TEMPLATES, payload}
}
export const toggleActiveStatus = (payload) => {
  return {type: schedulerActionType.TOGGLE_RULE_STATUS, payload}
}

export const postDeleteRule = (payload) => {
  return {type: schedulerActionType.DELETE_RULE, payload}
}

export const getAutomatedMessages = (payload) => ({
  type: schedulerActionType.FETCH_AUTOMATED_MESSAGES,
  payload,
})

export const getRuleInstances = () => ({
  type: schedulerActionType.FETCH_RULE_INSTANCES,
})

export const toggleRuleInstances = (payload) => {
  return {
    type: schedulerActionType.TOGGLE_RULE_INSTANCES,
    payload,
  }
}

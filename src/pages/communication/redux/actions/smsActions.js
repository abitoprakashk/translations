import {SmsActionType} from '../actionTypes'

export const getSmsTemplates = () => {
  return {type: SmsActionType.GET_SMS_TEMPLATES}
}
export const setSmsTemplates = (payload) => {
  return {type: SmsActionType.SET_SMS_TEMPLATES, payload}
}

export const setSmsBody = (text) => {
  return {type: SmsActionType.SET_SMS_BODY, payload: text}
}

export const getSmsUnusedQuotaRequest = () => {
  return {type: SmsActionType.GET_SMS_UNUSED_QUOTA}
}

export const setSmsUnusedQuota = (payload) => {
  return {type: SmsActionType.SET_SMS_UNUSED_QUOTA, payload}
}

export const setSmsUsedQuota = (quota) => {
  return {type: SmsActionType.SET_SMS_USED_QUOTA, payload: quota}
}
export const addUserInputData = (data) => {
  return {type: SmsActionType.ADD_USER_VARIABLES, payload: data}
}
export const sendSms = (payload) => {
  return {type: SmsActionType.SEND_SMS, payload}
}
export const setDisplayUiData = (payload) => {
  return {type: SmsActionType.SET_DISPLAY_UI_DATA, payload}
}

export const setTemplateId = (payload) => {
  return {type: SmsActionType.SET_SELECTED_TEMPLATE_ID, payload}
}

export const setAllVarsFilled = (payload) => {
  return {type: SmsActionType.SET_ALL_VARS_FILLED, payload}
}

export const getSmsPreview = (payload) => {
  return {type: SmsActionType.GET_SMS_PREVIEW, payload}
}
export const getSmsOrder = (payload) => {
  return {type: SmsActionType.GET_SMS_ORDER, payload}
}
export const createSmsOrder = (payload) => {
  return {type: SmsActionType.CREATE_SMS_ORDER, payload}
}
export const verifySmsOrder = (payload) => {
  return {type: SmsActionType.VERIFY_SMS_ORDER, payload}
}
export const setRechargeOpen = (payload) => {
  return {type: SmsActionType.SET_RECHARGE_OPEN, payload}
}

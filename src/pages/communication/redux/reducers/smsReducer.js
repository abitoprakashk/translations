import {SmsActionType} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'
const INITIAL_STATE = {
  smsBody: '',
  templates: {},
  templateVariables: {},
  unusedQuota: null,
  blockPrice: 0,
  creditsRequired: 0,
  userInputData: {},
  displayUiData: [],
  selectedTemplateId: null,
  allVarsFilled: false,
  smsPreview: '',
  smsOrder: {},
  isRechargeOpen: false,
}

const smsBodyReducer = (state, {payload}) => {
  state.smsBody = payload
  return state
}

const smsTemplateReducer = (state, {payload}) => {
  state.templates = payload
  return state
}

const smsTemplateVariableREducer = (state, {payload}) => {
  state.templateVariables = payload
  return state
}
const smsUnusedQuotaReducer = (state, {payload}) => {
  state.unusedQuota = payload
  return state
}
const smsUsedQuotaReducer = (state, {payload}) => {
  state.blockPrice = payload
  return state
}
const userInputReducer = (state, {payload}) => {
  state.userInputData = payload
  return state
}
const displayUiDataReducer = (state, {payload}) => {
  state.displayUiData = payload
  return state
}
const templateIdReducer = (state, {payload}) => {
  state.selectedTemplateId = payload
  return state
}
const allVarsFilledReducer = (state, {payload}) => {
  state.allVarsFilled = payload
  return state
}
const smsPreviewReducer = (state, {payload}) => {
  state.smsPreview = payload
  return state
}
const smsCreditReducer = (state, {payload}) => {
  state.creditsRequired = payload
  return state
}
const smsOrderReducer = (state, {payload}) => {
  state.smsOrder = payload
  return state
}
const rechargeOpenReducer = (state, {payload}) => {
  state.isRechargeOpen = payload
  return state
}
const smsReducer = {
  [SmsActionType.SET_SMS_BODY]: smsBodyReducer,
  [SmsActionType.SET_SMS_TEMPLATES]: smsTemplateReducer,
  [SmsActionType.SET_SMS_UNUSED_QUOTA]: smsUnusedQuotaReducer,
  [SmsActionType.SET_SMS_USED_QUOTA]: smsUsedQuotaReducer,
  [SmsActionType.SET_SMS_TEMPLATE_VARIABLES]: smsTemplateVariableREducer,
  [SmsActionType.ADD_USER_VARIABLES]: userInputReducer,
  [SmsActionType.SET_DISPLAY_UI_DATA]: displayUiDataReducer,
  [SmsActionType.SET_SELECTED_TEMPLATE_ID]: templateIdReducer,
  [SmsActionType.SET_ALL_VARS_FILLED]: allVarsFilledReducer,
  [SmsActionType.SET_SMS_PREVIEW]: smsPreviewReducer,
  [SmsActionType.SET_SMS_CREDIT_REQUIRED]: smsCreditReducer,
  [SmsActionType.CREATE_SMS_ORDER]: smsOrderReducer,
  [SmsActionType.SET_RECHARGE_OPEN]: rechargeOpenReducer,
}

export default createTransducer(smsReducer, INITIAL_STATE)

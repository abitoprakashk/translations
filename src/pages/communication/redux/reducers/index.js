import {combineReducers} from 'redux'
import commonReducer from './commonReducer'
import announcementReducer from './announcementReducer'
import feedbackReducer from './feedbackReducer'
import postsReducer from './postsReducer'
import pollReducer from './pollReducer'
import smsReducer from './smsReducer'
import tabsReducer from './tabReducer'
import {createTransducer} from '../../../../redux/helpers'
import {SliderActionTypes} from '../actionTypes'
import {
  TemplateActionTypes,
  SaveDraftType,
  DefaultSegmentType,
  AnnouncementActionType,
} from '../actionTypes'
import schedulerReducer from './schedulerReducer'

const setIsSliderOpen = (state, {payload}) => {
  state.isSliderOpen = payload
  return state
}
const setButtonEnable = (state, {payload}) => {
  state.isEnabled = payload
  return state
}

const setTemplateData = (state, {payload}) => {
  state.comm_templates = payload
  return state
}

const setCurrentTemplate = (state, {payload}) => {
  state.currentTemplate = payload
  return state
}

const setSaveDraft = (state, {payload}) => {
  state.saveDraft = payload
  return state
}

const setDefaultSegment = (state, {payload}) => {
  state.defaultSegment = payload
  return state
}

const communicationReducer = combineReducers({
  posts: postsReducer,
  common: commonReducer,
  announcement: announcementReducer,
  feedback: feedbackReducer,
  poll: pollReducer,
  sms: smsReducer,
  scheduler: schedulerReducer,
  tab: tabsReducer,
  isSliderOpen: createTransducer(
    {[SliderActionTypes.SET_SLIDER]: setIsSliderOpen},
    {isSliderOpen: false}
  ),
  isButtonEnabled: createTransducer(
    {[AnnouncementActionType.VOICE_RECORDING]: setButtonEnable},
    {isEnabled: true}
  ),
  comm_templates: createTransducer(
    {
      [TemplateActionTypes.SET_TEMPLATE_DATA]: setTemplateData,
      [TemplateActionTypes.SET_CURRENT_TEMPLATE]: setCurrentTemplate,
    },
    {comm_templates: [], currentTemplate: null}
  ),
  saveDraft: createTransducer(
    {[SaveDraftType.SET_SAVE_DRAFT]: setSaveDraft},
    {saveDraft: false}
  ),
  defaultSegment: createTransducer(
    {[DefaultSegmentType.SET_DEFAULT_SEGMENT]: setDefaultSegment},
    {defaultSegment: []}
  ),
})

export default communicationReducer

import {createTransducer} from '../../../../redux/helpers'
import {FeedbackActionType} from '../actionTypes'

const INITIAL_STATE = {
  feedbackInfo: null,
  message: '',
  feddbackResponses: [],
  feddbackResponseLoader: false,
  isFeedbackSliderOpen: false,
}

const setFeedbackLoader = (state, {payload}) => {
  state.feddbackResponseLoader = payload
  return state
}

const setFeedbackResponses = (state, {payload}) => {
  state.feddbackResponses = [...payload]
  return state
}

const setFeedbackInfo = (state, {payload}) => {
  state.feedbackInfo = payload
  return state
}

const setQuestionReducer = (state, {payload}) => {
  state.message = payload
  return state
}

const setFeedbackDraftDataReducer = (state, {payload}) => {
  if (payload) return payload
  return INITIAL_STATE
}

const feedbackReducer = {
  [FeedbackActionType.FETCH_FEEDBACK_RESPONSE_DATA_SUCCEEDED]:
    setFeedbackResponses,
  [FeedbackActionType.SET_FEESBACK_RESPONSE_LOADER]: setFeedbackLoader,
  [FeedbackActionType.SET_FEEDBACK_INFO]: setFeedbackInfo,
  [FeedbackActionType.SET_QUESTION]: setQuestionReducer,
  [FeedbackActionType.SET_FEEDBACK_DRAFT_DATA]: setFeedbackDraftDataReducer,
}

export default createTransducer(feedbackReducer, INITIAL_STATE)

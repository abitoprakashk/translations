import {FeedbackActionType} from '../actionTypes'

export const setQuestionAction = (text) => {
  return {
    type: FeedbackActionType.SET_QUESTION,
    payload: text,
  }
}

export const setDraftDataAction = (data) => {
  return {
    type: FeedbackActionType.SET_FEEDBACK_DRAFT_DATA,
    payload: data,
  }
}

export const setFeedbackResponseAction = (payload) => {
  return {
    type: FeedbackActionType.FETCH_FEEDBACK_RESPONSE_DATA_SUCCEEDED,
    payload,
  }
}

export const setFeedbackInfoAction = (feedbackInfo) => {
  return {
    type: FeedbackActionType.SET_FEEDBACK_INFO,
    payload: feedbackInfo,
  }
}

export const fetchFeedbackResponseDataRequestAction = (announcement_id) => {
  return {
    type: FeedbackActionType.FETCH_FEEDBACK_RESPONSE_DATA_REQUEST,
    payload: announcement_id,
  }
}

export const setFeesbackResponseLoader = (payload) => {
  return {
    type: FeedbackActionType.SET_FEESBACK_RESPONSE_LOADER,
    payload,
  }
}

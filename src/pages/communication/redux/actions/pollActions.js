import {PollActionType} from '../actionTypes'

export const setQuestionOptionsAction = (question_options) => {
  return {
    type: PollActionType.QUESTION_OPTIONS,
    payload: question_options,
  }
}

export const setIsPollPublicAction = (is_poll_public) => {
  return {
    type: PollActionType.IS_POLL_PUBLIC,
    payload: is_poll_public,
  }
}

export const setQuestionAction = (text) => {
  return {
    type: PollActionType.SET_POLL_QUESTION,
    payload: text,
  }
}

export const setDraftDataAction = (data) => {
  return {
    type: PollActionType.SET_POLL_DRAFT_DATA,
    payload: data,
  }
}

export const setOptionValueAction = (data) => {
  return {
    type: PollActionType.SET_OPTION_VALUE,
    payload: data,
  }
}

import {PollActionType} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'

const INITIAL_STATE = {
  message: '',
  question_options: {option1: '', option2: ''},
  is_poll_public: true,
}

const questionOptions = (state, {payload}) => {
  state.question_options = payload
  return state
}

const isPollPublic = (state, {payload}) => {
  state.is_poll_public = payload
  return state
}

const setQuestionReducer = (state, {payload}) => {
  state.message = payload
  return state
}

const setPollDraftDataReducer = (state, {payload}) => {
  if (payload) return payload
  return INITIAL_STATE
}

const setOptionValue = (state, {payload}) => {
  const {value, index, key} = payload
  state.question_options[index][key] = value
  return state
}

const pollReducer = {
  [PollActionType.QUESTION_OPTIONS]: questionOptions,
  [PollActionType.IS_POLL_PUBLIC]: isPollPublic,
  [PollActionType.SET_POLL_QUESTION]: setQuestionReducer,
  [PollActionType.SET_POLL_DRAFT_DATA]: setPollDraftDataReducer,
  [PollActionType.SET_OPTION_VALUE]: setOptionValue,
}

export default createTransducer(pollReducer, INITIAL_STATE)

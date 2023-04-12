import {eventManagerActionTypes} from '../actionTypes'

export const eventManagerReducer = (state = null, {type, payload}) => {
  switch (type) {
    case eventManagerActionTypes.EVENT_MANAGER:
      return payload
    default:
      return state
  }
}

export const eventReducer = (state = null, {type, payload}) => {
  switch (type) {
    case eventManagerActionTypes.LAST_EVENT:
      return payload
    default:
      return state
  }
}

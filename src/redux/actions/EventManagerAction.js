import {eventManagerActionTypes} from '../actionTypes'

export const eventManagerAction = (eventManager) => {
  return {
    type: eventManagerActionTypes.EVENT_MANAGER,
    payload: eventManager,
  }
}

export const lastEventAction = (eventId) => {
  return {
    type: eventManagerActionTypes.LAST_EVENT,
    payload: eventId,
  }
}

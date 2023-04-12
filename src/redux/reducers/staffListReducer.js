import {staffActionTypes} from '../actionTypes'

export const staffListReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case staffActionTypes.GET_STAFF_LIST:
      return payload
    default:
      return state
  }
}

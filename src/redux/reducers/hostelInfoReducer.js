import {hostelInfoActionTypes} from '../actionTypes'

export const hostelListReducer = (state = [], {type, payload}) => {
  switch (type) {
    case hostelInfoActionTypes.HOSTEL_LIST:
      return payload
    default:
      return state
  }
}

export const hostelInfoReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case hostelInfoActionTypes.HOSTEL_INFO:
      return payload
    default:
      return state
  }
}

export const hostelRoomsListReducer = (state = [], {type, payload}) => {
  switch (type) {
    case hostelInfoActionTypes.HOSTEL_ROOMS_LIST:
      return payload
    default:
      return state
  }
}

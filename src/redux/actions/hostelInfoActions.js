import {hostelInfoActionTypes} from '../actionTypes'

export const hostelListAction = (requests) => {
  return {
    type: hostelInfoActionTypes.HOSTEL_LIST,
    payload: requests,
  }
}

export const hostelInfoAction = (requests) => {
  return {
    type: hostelInfoActionTypes.HOSTEL_LIST,
    payload: requests,
  }
}

export const hostelRoomsListAction = (requests) => {
  return {
    type: hostelInfoActionTypes.HOSTEL_ROOMS_LIST,
    payload: requests,
  }
}

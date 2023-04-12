import {organisationInfoActionTypes} from '../actionTypes'

export const organisationInfoReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case organisationInfoActionTypes.ORGANISATION_INFO:
      return payload
    default:
      return state
  }
}

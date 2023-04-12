import {schoolSystemActionTypes} from '../actionTypes'

export const schoolSystemSectionSelectedReducer = (
  state = null,
  {type, payload}
) => {
  switch (type) {
    case schoolSystemActionTypes.SCHOOL_SYSTEM_SECTION_SELECTED:
      return payload
    default:
      return state
  }
}

export const schoolSystemScreenSelectedReducer = (
  state = null,
  {type, payload}
) => {
  switch (type) {
    case schoolSystemActionTypes.SCHOOL_SYSTEM_SCREEN_SELECTED:
      return payload
    default:
      return state
  }
}

import {schoolSystemActionTypes} from '../actionTypes'

export const schoolSystemSectionSelectedAction = (info) => {
  return {
    type: schoolSystemActionTypes.SCHOOL_SYSTEM_SECTION_SELECTED,
    payload: info,
  }
}

export const schoolSystemScreenSelectedAction = (info) => {
  return {
    type: schoolSystemActionTypes.SCHOOL_SYSTEM_SCREEN_SELECTED,
    payload: info,
  }
}

import {STUDENT_ACTIONS} from '../actionTypes'

export const clearReduxStateAction = () => {
  return {
    type: STUDENT_ACTIONS.STUDENT_PROFILE_DATA,
  }
}

export const emptyFieldsReduxStateAction = (request) => {
  return {
    type: STUDENT_ACTIONS.STUDENT_PROFILE_FIELDS_DATA,
    payload: request,
  }
}

export const addProfileAction = (data) => {
  return {
    type: STUDENT_ACTIONS.STUDENT_PROFILE_ADD_REQUEST,
    payload: data,
  }
}

export const updateProfileAction = (data) => {
  return {
    type: STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_REQUEST,
    payload: data,
  }
}

export const getStudentDetailsAction = (request) => {
  return {
    type: STUDENT_ACTIONS.STUDENT_PROFILE_DATA_REQUEST,
    payload: request,
  }
}

export const deleteStudentAction = (id) => {
  return {
    type: STUDENT_ACTIONS.STUDENT_PROFILE_DELETE,
    payload: id,
  }
}

export const getStudentListAction = () => {
  return {
    type: STUDENT_ACTIONS.STUDENT_LIST_REQUEST,
  }
}

export const uploadStudentDP = (data) => {
  return {
    type: STUDENT_ACTIONS.STUDENT_DISPLAY_PIC_UPLOAD_REQUEST,
    payload: data,
  }
}

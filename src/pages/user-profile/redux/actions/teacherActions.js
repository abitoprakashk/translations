import {TEACHER_ACTIONS} from '../actionTypes'

export const addProfileAction = (data) => {
  return {
    type: TEACHER_ACTIONS.TEACHER_PROFILE_ADD_REQUEST,
    payload: data,
  }
}

export const updateProfileAction = (data) => {
  return {
    type: TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_REQUEST,
    payload: data,
  }
}

export const clearReduxStateAction = () => {
  return {
    type: TEACHER_ACTIONS.TEACHER_PROFILE_DATA,
  }
}

export const deleteTeacherAction = (id) => {
  return {
    type: TEACHER_ACTIONS.TEACHER_PROFILE_DELETE,
    payload: id,
  }
}

export const getTeacherListAction = () => {
  return {
    type: TEACHER_ACTIONS.TEACHER_LIST_REQUEST,
  }
}

export const uploadTeacherDP = (data) => {
  return {
    type: TEACHER_ACTIONS.TEACHER_DISPLAY_PIC_UPLOAD_REQUEST,
    payload: data,
  }
}

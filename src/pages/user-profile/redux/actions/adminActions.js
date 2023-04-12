import {ADMIN_ACTIONS} from '../actionTypes'

export const updateProfileAction = (data) => {
  return {
    type: ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_REQUEST,
    payload: data,
  }
}

export const addProfileAction = (data) => {
  return {
    type: ADMIN_ACTIONS.ADMIN_PROFILE_ADD_REQUEST,
    payload: data,
  }
}

export const clearReduxStateAction = () => {
  return {
    type: ADMIN_ACTIONS.ADMIN_PROFILE_DATA,
  }
}

export const getAdminDetailsAction = (data) => {
  return {
    type: ADMIN_ACTIONS.ADMIN_PROFILE_DATA_REQUEST,
    payload: data,
  }
}

export const deleteAdminAction = (data) => {
  return {
    type: ADMIN_ACTIONS.ADMIN_PROFILE_DELETE,
    payload: data,
  }
}

export const getAdminListAction = () => {
  return {
    type: ADMIN_ACTIONS.ADMIN_LIST_REQUEST,
  }
}

export const uploadAdminDP = (data) => {
  return {
    type: ADMIN_ACTIONS.ADMIN_DISPLAY_PIC_UPLOAD_REQUEST,
    payload: data,
  }
}

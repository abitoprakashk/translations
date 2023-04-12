import {INSTITUTE_ACTIONS} from './../actionTypes'

export const updateProfileAction = (data) => {
  return {
    type: INSTITUTE_ACTIONS.INSTITUTE_PROFILE_UPDATE_REQUEST,
    payload: data,
  }
}

export const uploadLogoAction = (data) => {
  return {
    type: INSTITUTE_ACTIONS.LOGO_UPLOAD_REQUEST,
    payload: data,
  }
}

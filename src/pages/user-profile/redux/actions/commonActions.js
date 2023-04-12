import {COMMON_ACTIONS} from '../actionTypes'

export const getSignedUrlAction = (data) => {
  return {
    type: COMMON_ACTIONS.DISPLAY_PIC_UPLOAD_SIGNED_URL_REQUEST,
    payload: data,
  }
}

export const attachDPToMemberAction = (data) => {
  return {
    type: COMMON_ACTIONS.DISPLAY_PIC_ATTACH_REQUEST,
    payload: data,
  }
}

export const clearDisplayPicDataAction = () => {
  return {
    type: COMMON_ACTIONS.DISPLAY_PIC_UPLOAD_SIGNED_URL_SUCCESS,
    payload: null,
  }
}

export const clearDisplayPicErrorAction = () => {
  return {
    type: COMMON_ACTIONS.DISPLAY_PIC_UPLOAD_SIGNED_URL_FAILED,
    payload: null,
  }
}

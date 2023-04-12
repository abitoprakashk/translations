import {PopupActions} from '../actionTypes'

export const getPopupAction = () => {
  return {
    type: PopupActions.GET_POPUP_DATA,
  }
}

export const setPopupAction = (data) => {
  return {
    type: PopupActions.SET_POPUP_DATA,
    payload: data,
  }
}

export const setPopupTimeAction = () => {
  return {
    type: PopupActions.SET_POPUP_TIME,
  }
}

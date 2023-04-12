import {createTransducer} from '../../../../redux/helpers'
import {PopupActions} from '../actionTypes'

const INITIAL_STATE = {
  popupInfo: [],
  showPopup: false,
}

const showPopupData = (state, {payload}) => {
  return {
    ...state,
    popupInfo: payload,
    showPopup: true,
  }
}

const closePopup = (state) => {
  return {
    ...state,
    showPopup: false,
  }
}

const popupFail = (state) => {
  return {
    ...state,
    popupInfo: [],
    showPopup: false,
  }
}

const popupDataReducer = {
  [PopupActions.SHOW_POPUP_DATA]: showPopupData,
  [PopupActions.GET_POPUP_DATA_FAILURE]: popupFail,
  [PopupActions.SET_POPUP_DATA_FAILURE]: popupFail,
  [PopupActions.CLOSE_POPUP]: closePopup,
}

export default createTransducer(popupDataReducer, INITIAL_STATE)

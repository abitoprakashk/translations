import {commonActionTypes} from '../actionTypes'

const loadingListInitialState = {
  // checkLogin: true,
}

export const showSidebarReducer = (state = false, {type, payload}) => {
  switch (type) {
    case commonActionTypes.SHOW_SIDEBAR:
      return payload
    default:
      return state
  }
}

export const showLoadingReducer = (state = false, {type, payload}) => {
  switch (type) {
    case commonActionTypes.SHOW_LOADING:
      return payload
    default:
      return state
  }
}
export const loadingListReducer = (
  state = loadingListInitialState,
  {type, payload}
) => {
  switch (type) {
    case commonActionTypes.SET_LOADING_LIST:
      return {...state, ...payload}
    case commonActionTypes.RESET_LOADING_LIST:
      return payload
    default:
      return state
  }
}

export const showEditSessionReducer = (state = false, {type, payload}) => {
  switch (type) {
    case commonActionTypes.SHOW_EDIT_ACADEMIC_SESSION:
      return payload
    default:
      return state
  }
}

export const showErrorOccuredReducer = (state = false, {type, payload}) => {
  switch (type) {
    case commonActionTypes.SHOW_ERROR_OCCURED:
      return payload
    default:
      return state
  }
}

export const showLogoutPopupReducer = (state = false, {type, payload}) => {
  switch (type) {
    case commonActionTypes.SHOW_LOGOUT_POPUP:
      return payload
    default:
      return state
  }
}

export const showFeedbackLockPopupReducer = (
  state = false,
  {type, payload}
) => {
  switch (type) {
    case commonActionTypes.SHOW_FEATURE_LOCK_POPUP:
      return payload
    default:
      return state
  }
}

export const redirectReducer = (state = false, {type, payload}) => {
  switch (type) {
    case commonActionTypes.REDIRECT:
      return payload
    default:
      return state
  }
}

export const notificationCountReducer = (state = 0, {type, payload}) => {
  switch (type) {
    case commonActionTypes.NOTIFICATION_COUNT:
      return payload
    default:
      return state
  }
}

export const showPendingRequestTeacherPageReducer = (
  state = false,
  {type, payload}
) => {
  switch (type) {
    case commonActionTypes.SHOW_PENDING_REQUEST_TEACHER_PAGE:
      return payload
    default:
      return state
  }
}

export const showEditInstituteDetailsPopupReducer = (
  state = false,
  {type, payload}
) => {
  switch (type) {
    case commonActionTypes.SHOW_EDIT_INSTITUTE_DETAILS_POPUP:
      return payload
    default:
      return state
  }
}

export const showErrorMessageReducer = (state = null, {type, payload}) => {
  switch (type) {
    case commonActionTypes.ERROR_MESSAGE:
      return payload
    default:
      return state
  }
}

export const showFreeTrialCongratsReducer = (
  state = false,
  {type, payload}
) => {
  switch (type) {
    case commonActionTypes.SHOW_FREE_TRIAL_CONGRATS_POPUP:
      return payload
    default:
      return state
  }
}

export const showProfileDropdownReducer = (state = false, {type, payload}) => {
  switch (type) {
    case commonActionTypes.SHOW_PROFILE_DROPDOWN:
      return payload
    default:
      return state
  }
}

export const showNotificationReducer = (state = false, {type, payload}) => {
  switch (type) {
    case commonActionTypes.SHOW_NOTIFICATION_DROPDOWN:
      return payload
    default:
      return state
  }
}

export const toastDataReducer = (state = null, {type, payload}) => {
  switch (type) {
    case commonActionTypes.TOAST_DATA:
      return payload
    default:
      return state
  }
}

export const authReducer = (state = {}, {type, _payload}) => {
  switch (type) {
    case commonActionTypes.LOGOUT_USER: {
      window.sessionStorage.clear()
      return null
    }
    default:
      return state
  }
}

export const switchAdminReducer = (state = false, {type, payload}) => {
  switch (type) {
    case commonActionTypes.ADMIN_SWITCH_ACCOUNT:
      return payload
    default:
      return state
  }
}

export const countryListReducer = (state = [], {type, payload}) => {
  switch (type) {
    case commonActionTypes.COUNTRY_LIST:
      return payload
    default:
      return state
  }
}

export const setIsMobileReducer = (state = false, {type, payload}) => {
  switch (type) {
    case commonActionTypes.SET_IS_MOBILE:
      return payload
    default:
      return state
  }
}

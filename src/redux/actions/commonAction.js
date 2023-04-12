import {commonActionTypes} from '../actionTypes'
import {v4 as uuidv4} from 'uuid'

export const showSidebarAction = (flag) => {
  return {
    type: commonActionTypes.SHOW_SIDEBAR,
    payload: flag,
  }
}

export const showLoadingAction = (flag) => {
  return {
    type: commonActionTypes.SHOW_LOADING,
    payload: flag,
  }
}
export const setLoadingListAction = (payload) => {
  return {
    type: commonActionTypes.SET_LOADING_LIST,
    payload,
  }
}
export const resetLoadingListAction = (payload = {}) => {
  return {
    type: commonActionTypes.RESET_LOADING_LIST,
    payload,
  }
}

export const showErrorOccuredAction = (flag) => {
  return {
    type: commonActionTypes.SHOW_ERROR_OCCURED,
    payload: flag,
  }
}

export const showEditSessionAction = (flag) => ({
  type: commonActionTypes.SHOW_EDIT_ACADEMIC_SESSION,
  payload: flag,
})

export const showLogoutPopupAction = (flag) => {
  return {
    type: commonActionTypes.SHOW_LOGOUT_POPUP,
    payload: flag,
  }
}

export const showFeatureLockAction = (flag) => {
  return {
    type: commonActionTypes.SHOW_FEATURE_LOCK_POPUP,
    payload: flag,
  }
}

export const redirectAction = (flag) => {
  return {
    type: commonActionTypes.REDIRECT,
    payload: flag,
  }
}

export const notificationCountAction = (flag) => {
  return {
    type: commonActionTypes.NOTIFICATION_COUNT,
    payload: flag,
  }
}

export const showPendingRequestTeacherPageAction = (flag) => {
  return {
    type: commonActionTypes.SHOW_PENDING_REQUEST_TEACHER_PAGE,
    payload: flag,
  }
}

export const showEditInstituteDetailsPopupAction = (flag) => {
  return {
    type: commonActionTypes.SHOW_EDIT_INSTITUTE_DETAILS_POPUP,
    payload: flag,
  }
}

export const showErrorMessageAction = (msg) => {
  return {
    type: commonActionTypes.ERROR_MESSAGE,
    payload: msg,
  }
}

export const showFreeTrialCongratsAction = (flag) => {
  return {
    type: commonActionTypes.SHOW_FREE_TRIAL_CONGRATS_POPUP,
    payload: flag,
  }
}

export const showProfileDropdownAction = (flag) => {
  return {
    type: commonActionTypes.SHOW_PROFILE_DROPDOWN,
    payload: flag,
  }
}

export const showNotificationAction = (flag) => {
  return {
    type: commonActionTypes.SHOW_NOTIFICATION_DROPDOWN,
    payload: flag,
  }
}

export const showToast = (payload) => {
  const id = uuidv4()
  const {type, message = '', text = ''} = payload
  let nextType = type
  if (nextType === true) {
    nextType = 'success'
  } else if (nextType === false) {
    nextType = 'error'
  }

  return {
    type: commonActionTypes.SHOW_TOAST,
    payload: {
      ...payload,
      type: nextType,
      message: message || text,
      id,
    },
  }
}

export const showSuccessToast = (message) => {
  return showToast({
    type: 'success',
    message,
  })
}

export const showErrorToast = (message) => {
  return showToast({
    type: 'error',
    message,
  })
}

export const hideToast = (payload) => ({
  type: commonActionTypes.HIDE_TOAST,
  payload,
})

export const logoutUser = () => ({
  type: commonActionTypes.LOGOUT_USER,
  payload: null,
})

export const switchAdminAction = (payload) => ({
  type: commonActionTypes.ADMIN_SWITCH_ACCOUNT,
  payload,
})

export const countryListAction = (payload) => ({
  type: commonActionTypes.COUNTRY_LIST,
  payload,
})

export const setisMobileAction = (payload) => ({
  type: commonActionTypes.SET_IS_MOBILE,
  payload,
})

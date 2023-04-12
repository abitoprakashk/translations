import {adminInfoActionTypes} from '../actionTypes'

export const adminInfoAction = (info) => {
  return {
    type: adminInfoActionTypes.ADMIN_INFO,
    payload: info,
  }
}

export const currentAdminInfoAction = (requests) => {
  return {
    type: adminInfoActionTypes.CURR_ADMIN_INFO,
    payload: requests,
  }
}

export const sidebarAction = (requests) => {
  return {
    type: adminInfoActionTypes.SIDEBAR,
    payload: requests,
  }
}

import {adminInfoActionTypes} from '../actionTypes'

export const adminInfoReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case adminInfoActionTypes.ADMIN_INFO:
      return payload
    default:
      return state
  }
}

export const rolesListReducer = (state = [], {type, payload}) => {
  switch (type) {
    case adminInfoActionTypes.ROLES_LIST:
      return payload
    default:
      return state
  }
}

export const currentAdminInfoReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case adminInfoActionTypes.CURR_ADMIN_INFO:
      return payload
    default:
      return state
  }
}

export const sidebarReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case adminInfoActionTypes.SIDEBAR:
      return payload
    default:
      return state
  }
}

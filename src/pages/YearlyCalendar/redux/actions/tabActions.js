import {TabActionType} from '../actionTypes'

export const setTabAction = (tab) => {
  return {
    type: TabActionType.SET_TAB,
    payload: tab,
  }
}

import {QUICK_ACTIONS_LIST} from './contants'

export const actionsList = Object.keys(QUICK_ACTIONS_LIST).map(
  (key) => QUICK_ACTIONS_LIST[key]
)

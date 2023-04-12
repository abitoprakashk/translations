import {TabActionType} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'

const INITIAL_STATE = {
  tab: 'All',
}

const tabReducer = (state, {payload}) => {
  state.title = payload
  return state
}

const tabsReducer = {
  [TabActionType.TAB]: tabReducer,
}

export default createTransducer(tabsReducer, INITIAL_STATE)

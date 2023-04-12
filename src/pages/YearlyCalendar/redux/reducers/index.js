import {combineReducers} from 'redux'
import tabInfoReducer from './tabInfoReducer'

const yearlyReducer = combineReducers({
  tabInfo: tabInfoReducer,
})

export default yearlyReducer

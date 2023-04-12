import {combineReducers} from 'redux'
import {default as tabInfo} from './tabInfoReducer'
import certificateData from './certificateData'

const certificateReducer = combineReducers({
  tabInfo,
  certificateData,
})

export default certificateReducer

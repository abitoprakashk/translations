import {combineReducers} from 'redux'
import contentReducer from './contentReducer'

const contentMvpReducer = combineReducers({
  content: contentReducer,
})

export default contentMvpReducer

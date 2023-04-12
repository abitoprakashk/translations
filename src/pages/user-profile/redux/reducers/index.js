import {combineReducers} from 'redux'
import instituteReducer from './instituteReducer'
import studentReducer from './studentReducer'
import teacherReducer from './teacherReducer'
import adminReducer from './adminReducer'
import commonReducer from './commonReducer'

const userProfileReducer = combineReducers({
  institute: instituteReducer,
  student: studentReducer,
  admin: adminReducer,
  teacher: teacherReducer,
  common: commonReducer,
})

export default userProfileReducer

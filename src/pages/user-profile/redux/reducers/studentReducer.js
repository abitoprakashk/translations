import produce from 'immer'
import {STUDENT_ACTIONS} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'

const INITIAL_STATE = {
  isDynamicFieldsLoading: true,
  dynamicFieldsValues: null,
  userProfileFieldsValue: null,
  isUserlistLoading: false,
}

const manipulateObject = (state, obj) => {
  let fieldsValueObject = {}
  if (obj && obj.length > 0) {
    const studentData = obj[0]
    const initialObject = state.dynamicFieldsValues
    fieldsValueObject = {_id: studentData._id}
    if (initialObject) {
      for (const key in initialObject) {
        fieldsValueObject[key] = studentData[key]
      }
    }
  }
  return fieldsValueObject
}

const profileDataReducer = (state, {payload}) => {
  return produce(state, (draft) => {
    draft.updated = null
    draft.isDynamicFieldsLoading = false
    draft.dynamicFieldsValues = payload
    return draft
  })
}

const profileDetailsReducer = (state, {payload}) => {
  const objetData = manipulateObject(state, payload)
  return produce(state, (draft) => {
    draft.isDynamicFieldsLoading = false
    draft.isEdit = true
    draft.dynamicFieldsValues = objetData
    return draft
  })
}

const loadingReducer = (state, {payload}) => {
  let tmp = {...state}
  tmp.isLoading = payload
  return tmp
}

const afterUpdateReducer = (state, {payload}) => {
  state.updated = payload
  return state
}

const afterUpdateFailedReducer = (state, {payload}) => {
  return {...state, failed: payload}
}

const studentListRequestReducer = (state) => {
  state.isUserlistLoading = true
  return state
}

const studentListSuccessReducer = (state) => {
  state.isUserlistLoading = false
  return state
}

const studentReducer = {
  [STUDENT_ACTIONS.STUDENT_PROFILE_FIELDS_DATA]: profileDataReducer,
  [STUDENT_ACTIONS.STUDENT_PROFILE_DETAILS]: profileDetailsReducer,
  [STUDENT_ACTIONS.STUDENT_PROFILE_LOADER]: loadingReducer,
  [STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_SUCCESSFUL]: afterUpdateReducer,
  [STUDENT_ACTIONS.STUDENT_PROFILE_UPDATE_FAILED]: afterUpdateFailedReducer,
  [STUDENT_ACTIONS.STUDENT_LIST_REQUEST]: studentListRequestReducer,
  [STUDENT_ACTIONS.STUDENT_LIST_GET_SUCCEEDED]: studentListSuccessReducer,
}

export default createTransducer(studentReducer, INITIAL_STATE)

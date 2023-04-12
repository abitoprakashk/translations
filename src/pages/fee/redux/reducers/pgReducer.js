import {createTransducer} from '../../../../redux/helpers'
import {pgListActionType} from '../actionTypes/pgActionTypes'

const INITIAL_STATE = {
  pgList: {},
  pgFields: [],
  loading: false,
}

const setPgList = (state, {payload}) => {
  return {
    ...state,
    pgList: payload,
    loading: false,
  }
}

const setPgFields = (state, {payload}) => {
  return {
    ...state,
    pgFields: payload,
    loading: false,
  }
}

const showLoader = (state) => {
  return {
    ...state,
    loading: true,
  }
}

const hideLoader = (state) => {
  return {
    ...state,
    pgFields: [],
    loading: false,
  }
}

const pgUpdateFail = (state) => {
  return {
    ...state,
    loading: false,
  }
}

const updated = () => {
  location.reload()
}
const pgReducer = {
  [pgListActionType.FETCH_PG_LIST_SUCCESS]: setPgList,
  [pgListActionType.FETCH_PG_LIST_FIELDS_SUCCESS]: setPgFields,
  [pgListActionType.FETCH_PG_LIST]: showLoader,
  [pgListActionType.FETCH_PG_LIST_FAILURE]: hideLoader,
  [pgListActionType.FETCH_PG_LIST_FIELDS]: showLoader,
  [pgListActionType.FETCH_PG_LIST_FIELDS_FAILURE]: hideLoader,
  [pgListActionType.UPDATE_PG_DATA_FAILURE]: pgUpdateFail,
  [pgListActionType.UPDATE_PG_DATA_REQUEST]: showLoader,
  [pgListActionType.UPDATE_PG_DATA_SUCCESS]: updated,
}

export default createTransducer(pgReducer, INITIAL_STATE)

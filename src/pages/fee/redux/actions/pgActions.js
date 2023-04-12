import {pgListActionType} from '../actionTypes/pgActionTypes'

export const fetchPgList = (payload) => {
  return {
    type: pgListActionType.FETCH_PG_LIST,
    payload: payload,
  }
}

export const fetchPgListFields = (payload) => {
  return {
    type: pgListActionType.FETCH_PG_LIST_FIELDS,
    payload: payload,
  }
}

export const updatePgData = (payload) => {
  return {
    type: pgListActionType.UPDATE_PG_DATA_REQUEST,
    payload: payload,
  }
}

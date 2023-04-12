import {
  SET_TABLE_DATA,
  SET_FILTER_DATA,
  SET_TABLE_SEARCH,
  SET_DATE_FILTER,
  SET_ATTENDANCE_FILTER,
} from './AttendanceReport.actionTypes'

export const setTableData = (payload) => ({
  type: SET_TABLE_DATA,
  payload,
})

export const setFilterData = (payload) => ({
  type: SET_FILTER_DATA,
  payload,
})

export const setTableSearch = (payload) => ({
  type: SET_TABLE_SEARCH,
  payload,
})

export const setDateFilter = (payload) => ({
  type: SET_DATE_FILTER,
  payload,
})

export const setAttendanceFilter = (payload) => ({
  type: SET_ATTENDANCE_FILTER,
  payload,
})

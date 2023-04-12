import {createTransducer} from '@teachmint/krayon'
import produce from 'immer'
import {
  SET_ATTENDANCE_FILTER,
  SET_DATE_FILTER,
  SET_FILTER_DATA,
  SET_TABLE_DATA,
  SET_TABLE_SEARCH,
} from './AttendanceReport.actionTypes'

const INITIAL_STATE = {
  studentWise: {
    filterData: {},
    tableData: {},
    tableSearch: '',
    dateFilter: null,
  },
  classWise: {
    filterData: {},
    tableData: {},
    tableSearch: '',
    dateFilter: null,
  },
  dateWise: {
    filterData: {},
    tableData: {},
    tableSearch: '',
    dateFilter: null,
  },
  todayAttendance: {
    filterData: {},
    tableData: {},
    tableSearch: '',
    dateFilter: {
      // dropDownConstant: DATE_FILTER.LAST_MONTH,
      // value: DATE_FILTER.LAST_MONTH.label,
    },
  },
}

export const AttendanceReportReducerKey = {
  STUDENT_WISE: 'studentWise',
  TODAY_ATTENDANCE: 'todayAttendance',
  CLASS_WISE: 'classWise',
  DATE_WISE: 'dateWise',
}

const setFilterData = (state, {payload: {data, key}}) => {
  return produce(state, (draft) => {
    draft[key].filterData = data
    return draft
  })
}
const setTableData = (state, {payload: {data, key}}) => {
  return produce(state, (draft) => {
    draft[key].tableData = data
    return draft
  })
}

const setTableSearch = (state, {payload: {data, key}}) => {
  return produce(state, (draft) => {
    draft[key].tableSearch = data
    return draft
  })
}

const setDateFilter = (state, {payload: {data, key}}) => {
  return produce(state, (draft) => {
    draft[key].dateFilter = data
    return draft
  })
}

const setAttendanceFilter = (state, {payload: {data, key}}) => {
  return produce(state, (draft) => {
    draft[key].attendanceFilter = data
    return draft
  })
}

const attendanceReportReducer = {
  [SET_FILTER_DATA]: setFilterData,
  [SET_TABLE_DATA]: setTableData,
  [SET_TABLE_SEARCH]: setTableSearch,
  [SET_DATE_FILTER]: setDateFilter,
  [SET_ATTENDANCE_FILTER]: setAttendanceFilter,
}
export default createTransducer(attendanceReportReducer, INITIAL_STATE)

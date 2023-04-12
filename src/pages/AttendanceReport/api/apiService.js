import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const getTodayAttendanceApi = async (dateRange) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}attendance-report/today/records?attendance_date=${JSON.stringify(
      dateRange
    )}`,
  })
  return res.data
}

export const getAttendanceInsightApi = async (dateRange) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}attendance-report/percentage?attendance_date=${JSON.stringify(
      dateRange
    )}`,
  })
  return res.data
}

export const getDateWiseAttendanceApi = async (dateRange) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}attendance-report/trend/daily/class?attendance_date=${JSON.stringify(
      dateRange
    )}`,
  })
  return res.data
}

export const getAttendanceTrendDailyApi = async (dateRange) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}attendance-report/trend/daily?attendance_date=${JSON.stringify(
      dateRange
    )}`,
  })
  return res.data
}

export const getAttendanceTrendMonthlyApi = async (dateRange) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}attendance-report/trend/monthly?attendance_date=${JSON.stringify(
      dateRange
    )}`,
  })
  return res.data
}

export const getAttendanceRegisterApi = async (dateRange) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}attendance-report/registar?attendance_date=${JSON.stringify(
      dateRange
    )}`,
  })
  return res.data
}

export const getDownloadReportApi = async (json) => {
  return await axios.post(`${REACT_APP_API_URL}attendance-report/report`, json)
}

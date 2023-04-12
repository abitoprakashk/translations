import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'

export const getOrgOverviewDetails = async (payload) => {
  return await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}organisation/dashboard/overview`,
    params: payload,
  })
}

export const getOrgFeeReport = async (payload) => {
  return await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}organisation/dashboard/fees`,
    params: payload,
  })
}

export const getOrgAdmissionReport = async (payload) => {
  return await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}organisation/dashboard/admissions`,
    params: payload,
  })
}

export const getOrgStudentAttendanceReport = async (payload) => {
  return await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}organisation/dashboard/student/attendance`,
    params: payload,
  })
}
export const getOrgStaffAttendanceReport = async (payload) => {
  return await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}organisation/dashboard/staff/attendance`,
    params: payload,
  })
}

import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

// Fetch Staff List API
export const getStaffList = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-user/staff/details`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

// Fetch Staff Attendance Data API
export const getStaffAttendanceList = async (payload) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}staff-attendance?from_date=${payload.from_date}&to_date=${payload.to_date}`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

// Fetch Staff Attendance Data API
export const getStaffAttendance = async (payload) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}staff-attendance`,
      params: {
        from_date: payload.from_date,
        to_date: payload.to_date,
        iid: payload.iid,
      },
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

// Submit Staff Attendance API
export const submitStaffAttendance = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}staff-attendance/markattendance`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

// Staff Attendance Report Download API
export const getStaffAttendanceDownloadReport = async (payload) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}staff-attendance/report?duration=${payload}`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

// Fetch Staff Attendance Calendar Holidays/Days Info
export const getStaffAttendanceDayInfo = async (payload) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}staff-attendance/daysinfo?from_date=${payload.from_date}&to_date=${payload.to_date}`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

//Fetch Attendance Requests
export const fetchAttendanceRequests = (params) => {
  return axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}geofence-staff-attendance/requests`,
    params: params,
  })
}

//Resolve Attendance Request
export const resolveAttendanceRequest = (payload) => {
  return axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}geofence-staff-attendance/requests/approve`,
    data: payload,
  })
}

export const fetchStaffAttendanceSummary = () => {
  return axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}non-teaching-staff-attendance/session/summary`,
  })
}

export const fetchNonTeachingStaffAttendance = (params) => {
  return axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}non-teaching-staff-attendance/attendance`,
    params: params,
  })
}

// Update Staff Attendance API
export const updateStaffAttendanceData = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}staff-attendance/edit/attendance`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const markStaffAttendance = (payload) => {
  return axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}non-teaching-staff-attendance/mark/attendance`,
    data: payload,
  })
}

// Get Staff Monthly Attendance Data
export const getStaffMonthlyAttendanceData = async (payload) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}staff-attendance/monthly/summary`,
      params: {
        iid: payload.iid,
        date: payload.date,
      },
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

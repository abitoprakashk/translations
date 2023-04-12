import axios from 'axios'
import {REACT_APP_API_URL, BACKEND_HEADERS} from '../constants'

// Create Institute Student Attendance overview
export const utilsGetInstituteStudentAttendanceOverview = (timestamp) => {
  const params = new URLSearchParams()
  params.append('timestamp', timestamp)

  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}manual-attendance/institute/attendance/summary`,
      headers: BACKEND_HEADERS,
      params,
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Create Institute Student Attendance overview
export const utilsGetSectionStudentAttendanceOverview = (
  sectionId,
  startTime,
  endTime
) => {
  const params = new URLSearchParams()
  params.append('section_id', sectionId)
  params.append('interval_start', startTime)
  params.append('interval_end', endTime)

  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}manual-attendance/web/section/attendance/summary`,
      headers: BACKEND_HEADERS,
      params,
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsGetSectionStudentAttendanceSlots = (sectionId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}classroom/section/slots`,
      params: {section_id: sectionId},
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const markStudentAttendance = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}manual-attendance/mark/attendance`,
      data,
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

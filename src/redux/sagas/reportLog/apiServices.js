import axios from 'axios'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../../constants'

export const saveReportLog = async (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}log/reports`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((res) => {
        if (res?.data?.status) {
          let data = res.data.obj
          resolve(data)
        } else {
          reject({message: 'Report log not saved'})
        }
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const fetchDownloadReportLog = async () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}reports-log/reports/log`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) {
          resolve(res.data)
        } else {
          reject({message: 'Report log not fetched'})
        }
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const fetchPreformanceReport = async () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute/perfomance/summary`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) {
          resolve(res.data)
        } else {
          reject({message: 'Performance report not fetched'})
        }
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

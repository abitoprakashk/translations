import axios from 'axios'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../../../constants'

export const fetchSavedReports = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}get/report_downloads`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const downloadAndSaveReport = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}fee-module/report/download/request`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const updateSavedReport = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: '',
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const deleteSavedReport = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: '',
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const fetchInstituteFeeTypes = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/fee/categories/institute`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const fetchInstalmentDateTimestamp = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/installment/timestamps/institute`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) return resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const fetchFeeData = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/fee/reports/overview${
        data ? `?timestamp=${data}` : ''
      }`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) return resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const fetchChequeCount = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/pending/cheque`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) return resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const fetchTimeStampData = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report/download/request`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((res) => {
        if (res?.data?.status) return resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

import axios from 'axios'
import {REACT_APP_API_URL, BACKEND_HEADERS} from '../../../../constants'

export const getStaffShiftMapping = () => {
  return axios({
    url: `${REACT_APP_API_URL}institute-shift/staff/list`,
    method: 'GET',
    headers: BACKEND_HEADERS,
  })
}

export const getShiftList = () => {
  return axios({
    url: `${REACT_APP_API_URL}institute-shift/list`,
    method: 'GET',
    headers: BACKEND_HEADERS,
  })
}

export const updateShift = (payload) => {
  return axios({
    url: `${REACT_APP_API_URL}institute-shift/update`,
    method: 'POST',
    headers: BACKEND_HEADERS,
    data: payload,
  })
}

export const deleteShift = (payload) => {
  return axios({
    url: `${REACT_APP_API_URL}institute-shift/remove`,
    method: 'POST',
    headers: BACKEND_HEADERS,
    data: payload,
  })
}

export const getShiftInfo = (params) => {
  return axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}institute-shift`,
    params: params,
    headers: BACKEND_HEADERS,
  })
}

export const getShiftQRCode = (params) => {
  return axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}staff-attendance/qrcode`,
    params: params,
    responseType: 'blob',
  })
}

export const downloadQRCode = async (params) => {
  return axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}staff-attendance/download/qr`,
    params: params,
  })
}

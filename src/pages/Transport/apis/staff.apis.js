import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const fetchStaff = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}transport-staff/list`,
  })
  return res
}

export const updateStaff = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-staff/update`,
    data: payload,
  })
  return res
}

export const deleteStaff = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-staff/delete`,
    data: payload,
  })
  return res
}

export const fetchSignedUrls = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-staff/signed-url`,
    data: payload,
  })
  return res
}

import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const fetchVehicles = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}transport-vehicle/list`,
  })
  return res
}

export const updateVehicles = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-vehicle/update`,
    data: payload,
  })
  return res
}

export const deleteVehicle = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-vehicle/delete`,
    data: payload,
  })
  return res
}

export const fetchDocumentSignedUrls = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-vehicle/signed-url`,
    data: payload,
  })
  return res
}

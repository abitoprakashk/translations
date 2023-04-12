import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const fetchStops = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}transport-pickup-point/list`,
  })
  return res
}

export const addStops = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-pickup-point/add`,
    data: payload,
  })
  return res
}

export const updateStop = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-pickup-point/update`,
    data: payload,
  })
  return res
}

export const deleteStop = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-pickup-point/delete`,
    data: payload,
  })
  return res
}

import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const fetchRoutes = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}transport-route/list`,
  })
  return res
}

export const updateRoutes = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-route/update`,
    data: payload,
  })
  return res
}

export const deleteRoutes = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-route/delete`,
    data: payload,
  })
  return res
}

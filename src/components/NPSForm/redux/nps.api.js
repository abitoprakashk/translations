import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const submitNPSForm = async (data) => {
  const res = await axios.post(`${REACT_APP_API_URL}admin-feedback/submit`, {
    ...data,
  })
  return res
}

export const getNPSForm = async () => {
  const res = await axios.get(`${REACT_APP_API_URL}admin-feedback`)
  return res
}

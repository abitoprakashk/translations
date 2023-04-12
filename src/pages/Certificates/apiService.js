import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'

export const getCertificateData = async (type) => {
  // based on event_type
  const res = await axios({
    method: 'GET',
    url: type
      ? `${REACT_APP_API_URL}certificate?type=${type}`
      : `${REACT_APP_API_URL}certificate`,
  })

  return {data: res.data, type: type}
}

export const createCertificate = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}certificate/create`,
    data: payload,
  })
  return res.data
}

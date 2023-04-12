import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

export const fetchBiometricUsersList = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}biometric-user-mapping/list`,
  })
  return res
}

export const updateBiometricUsers = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}biometric-user-mapping/update`,
    data: payload,
  })
  return res
}

export const deleteBiometricUsers = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}biometric-user-mapping/delete`,
    data: payload,
  })
  return res
}

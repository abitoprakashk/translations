import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

export const fetchBiometricSettings = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}biometric-settings/settings`,
  })
  return res
}

export const requestBiometricMachines = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}biometric-settings/request-biometric`,
    data: payload,
  })
  return res
}

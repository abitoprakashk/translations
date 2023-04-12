import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

export const fetchBiometricMachinesList = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}biometric-machine/list`,
  })
  return res
}

export const updateBiometricMachines = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}biometric-machine/update`,
    data: payload,
  })
  return res
}

export const deleteBiometricMachines = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}biometric-machine/delete`,
    data: payload,
  })
  return res
}

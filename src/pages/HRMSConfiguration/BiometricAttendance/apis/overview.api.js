import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

export const fetchBiometricAggregates = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}biometric-overview/aggregates`,
  })
  return res
}

export const fetchBiometricAttendance = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}biometric-attendance/list`,
    data: payload,
  })
  return res
}

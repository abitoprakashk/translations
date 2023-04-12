import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const fetchTransportAggregates = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}transport/aggregates`,
  })
  return res
}

export const fetchTransportLiveTracking = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}transport/live-tracking`,
  })
  return res
}

export const fetchSettings = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}transport-settings/settings`,
  })
  return res
}

export const updateSchoolLocation = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-settings/update-school-address`,
    data: payload,
  })
  return res
}

export const requestTransportGPS = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-settings/request-gps`,
    data: payload,
  })
  return res
}

export const acknowledgeVehicleSOS = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport/acknowledge-sos`,
    data: payload,
  })
  return res
}

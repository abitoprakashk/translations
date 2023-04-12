import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

export const postDashboardPreferenceObj = (data) => {
  const res = axios.post(`${REACT_APP_API_URL}dashboard-preference/update`, {
    ...data,
  })
  return res
}

export const getDashboardPreferenceObj = () => {
  const res = axios.get(`${REACT_APP_API_URL}dashboard-preference`)
  return res
}

export const getLatestWidgetAnnouncementObj = () => {
  const res = axios.get(`${REACT_APP_API_URL}communication/widget`)
  return res
}

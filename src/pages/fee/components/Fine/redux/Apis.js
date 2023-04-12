import axios from 'axios'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../../../../constants'

export const fetchFeeFineRules = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/fee/fine/rules`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const saveRuleConfiguration = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}fee-module/create/fee/fine/rules`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const fetchFeeFineStudentListing = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/fine/student/listing`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const deleteFeeFineRule = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}fee-module/delete/fine/rule`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject({errorOccured: true}))
  })
}

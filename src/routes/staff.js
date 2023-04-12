import axios from 'axios'
import {REACT_APP_API_URL, BACKEND_HEADERS} from '../constants'

// Create Staff
export const utilsCreateStaff = (routeDetails) => {
  routeDetails.phone_number = `${routeDetails.country_code}-${routeDetails.phone_number}`
  delete routeDetails.country_code

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}staff/create`,
      headers: BACKEND_HEADERS,
      data: routeDetails,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get staff list
export const utilsGetStaff = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}staff/list`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data?.status && response?.data?.obj)
          resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Delete staff
export const utilsDeleteStaff = (_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}staff/delete`,
      headers: BACKEND_HEADERS,
      data: {_id},
    })
      .then((response) => {
        if (response?.data?.status && response?.data?.obj)
          resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

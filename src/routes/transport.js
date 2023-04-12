import axios from 'axios'
import {REACT_APP_API_URL, BACKEND_HEADERS} from '../constants'

// Create route
export const utilsCreateTransportRoutes = (routeDetails) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}transport-route/create`,
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

// Get transport routes list
export const utilsGetTransportRoutes = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}transport-route/list`,
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

// Delete transport routes list
export const utilsDeleteTransportRoutes = (_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}transport-route/delete`,
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

/**
 * Multi Associate
 */
export const utilsRouteMultiAssociation = (associations) => {
  return new Promise((resolve, reject) => {
    const data = {associations}

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}transport-route/multi/associate`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Add vehicle
export const utilsCreateTransportVehicle = (routeDetails) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}vehicle/create`,
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

// Get transport vehicle list
export const utilsGetTransportVehicle = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}vehicle/list`,
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

// Delete transport vehicle list
export const utilsDeleteTransportVehicle = (_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}vehicle/delete`,
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

// Add pickup point
export const utilsCreateTransportPickup = (waypointDetails) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}pick-up/create`,
      headers: BACKEND_HEADERS,
      data: waypointDetails,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get pickup points
export const utilsGetTransportPickup = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}transport-pickup-point/list`,
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

// Delete pickup point
export const utilsDeleteTransportPickup = (_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}pick-up/delete`,
      headers: BACKEND_HEADERS,
      data: {_id},
    })
      .then((response) => {
        if (response?.data?.status && response?.data?.obj)
          resolve({...response?.data})
        reject({...response?.data})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Delete pickup point
export const utilsManagePickupStudents = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}pick-up/assign/students`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((response) => {
        if (response?.data?.status && response?.data?.obj)
          resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

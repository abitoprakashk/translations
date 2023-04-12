import axios from 'axios'
import {REACT_APP_API_URL, BACKEND_HEADERS} from '../../constants'

/**
 * calls the api to get details of popup to be shown
 */
export const getNudgePopup = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}nudge-popup`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve(response.data)
        reject({msg: response.data.msg, errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * calls the api to set details of popup to be shown
 */
export const setNudgePopup = (popupData) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}nudge-popup/update`,
      headers: BACKEND_HEADERS,
      data: popupData,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({status: true})
        reject({msg: response.data.msg, errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}
/**
 * calls the api to set time of last shown popup
 */
export const setNudgePopupTime = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}nudge-popup/cancel`,
      headers: BACKEND_HEADERS,
      data: {},
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve(response.data)
        reject({msg: response.data.msg, errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

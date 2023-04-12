import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'
export const fetchGlobalSettings = (_instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}classroom-setting/globalclassroomsettings`,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true) {
          resolve(response.data.obj)
        }

        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const updateGlobalSettings = (instituteId, updatedSetting) => {
  const data = {
    id: updatedSetting.id,
    value: updatedSetting.value,
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}classroom-setting/update/globalclassroomsettings`,
      data: data,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true) {
          resolve(response.data.obj)
        }

        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

import axios from 'axios'
import {BACKEND_HEADERS} from '../../../../constants'

export const apiRequest = (axiosData) => {
  return new Promise((resolve, reject) => {
    axios({...axiosData, headers: BACKEND_HEADERS})
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch((error) => {
        reject(error?.msg)
      })
  })
}

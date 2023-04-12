import axios from 'axios'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../constants'

export const checkUserAccessToContent = async (_instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}content/check/allowed/user`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const fetchTaxonomyData = async (data) => {
  const {children_type, ...payload} = data
  payload.field = children_type || data.field

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}/content/taxonomy/list`,
      headers: BACKEND_HEADERS,
      data: payload,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const fetchContentListData = async (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}/content/content/list`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}
export const fetchContent = async (uuid) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}/content/specific/content?content_id=${uuid}`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const reportContent = async (uuid) => {
  const data = {
    content_id: uuid,
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}/content/report/content`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

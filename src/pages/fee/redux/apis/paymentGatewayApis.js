import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

export const getPgList = async (payload) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}contingent-transactions/online/pg/list?country=${payload['country']}`,
  })
  return res.data
}

export const getPgFields = async (payload) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}contingent-transactions/online/pg/field/list?pg_id=${payload['pg_id']}`,
  })
  return res.data
}

export const updatePgCredentials = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}contingent-transactions/update/pg/details`,
    data: payload,
  })
  return res.data
}

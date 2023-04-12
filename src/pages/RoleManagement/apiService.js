import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'

export const getAllRoles = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}institute-role/list`,
  })
  return res
}

export const getRoleInfo = async (payload) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}institute-role`,
    params: payload,
  })
  return res
}

export const assignUserRole = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}institute-role/assign/users`,
    data: payload,
  })
  return res
}

export const createCustomRole = async (payload) => {
  let url = payload?.role_id
    ? `${REACT_APP_API_URL}institute-role/update`
    : `${REACT_APP_API_URL}institute-role/create`

  const res = await axios({
    method: 'POST',
    url: url,
    data: payload,
  })
  return res
}

export const deleteCustomRole = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}institute-role/delete`,
    data: payload,
  })
  return res
}

export const importRole = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}institute-role/import/role`,
    data: payload,
  })
  return res
}

export const getPermissionMap = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}module-permission/map`,
  })
  return res
}

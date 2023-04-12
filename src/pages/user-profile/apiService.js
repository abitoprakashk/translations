import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'
import {convertFiletoBase64} from '../communication/apiService'

export const updateInstituteProfile = async ({_instituteId, data}) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/update`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const updateInstituteLogo = async ({_id, logo}) => {
  if (logo) {
    logo = await convertFiletoBase64(logo)
  }
  const data = {
    file: logo,
  }
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/upload/logo`,
      data: data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getUserDetails = async ({imember_id}) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-user`,
      params: {imember_id},
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getUserProfileDetails = async (payload) => {
  try {
    const responseData = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}ips/institute/users`,
      data: payload,
    })
    return responseData.data
  } catch (e) {
    return {error: e}
  }
}

export const updateUserProfile = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}ips/update/users`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const addUserProfile = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}ips/add/users`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getAdminProfiles = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-admin`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const addAdminProfile = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-admin/create`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const updateAdminProfile = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-admin/update`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const deleteAdminProfile = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-admin/delete`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const deleteUserDetails = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}ips/delete/user`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const updateMemberDP = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}user-document/member/img`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getSignedUrl = async (params) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}user-document/signed/url`,
      params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getUserPermissionsV2 = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}institute-role/user/role`,
  })
  return res
}

import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'

export const getTemplatePreview = async (payload) => {
  const res = await axios.post(
    `${REACT_APP_API_URL}certificate-template/preview`,
    {...payload}
  )
  return res
}

export const saveTemplate = async (data) => {
  const res = await axios.post(
    `${REACT_APP_API_URL}certificate-template/create`,
    {
      ...data,
    }
  )
  return res
}

export const getAllTemplates = async (data) => {
  const res = await axios.get(`${REACT_APP_API_URL}certificate-template/list`, {
    ...data,
  })
  return res
}

export const getTemplateDetails = async ({id, isDefault}) => {
  return await axios.get(`${REACT_APP_API_URL}certificate-template/details`, {
    params: {id, default: isDefault},
  })
}

export const updateTempate = async (data) => {
  return await axios.post(`${REACT_APP_API_URL}certificate-template/update`, {
    ...data,
  })
}

export const getStaffList = async () => {
  return await axios.get(
    `${REACT_APP_API_URL}institute-admin/staff?include_left=true`
  )
}

export const getFieldValuesForTemplate = async (payload) => {
  return await axios.post(`${REACT_APP_API_URL}certificate-field/values`, {
    ...payload,
  })
}

export const generateSingleCertificate = async (payload) => {
  return await axios.post(
    `${REACT_APP_API_URL}certificate-document/generate/single`,
    {
      ...payload,
    }
  )
}

export const getGeneratedDocumentStatus = async (payload) => {
  return await axios.post(`${REACT_APP_API_URL}certificate-document/details`, {
    ids: payload,
  })
}

export const getAllGeneratedDocs = async ({c, userType, count}) => {
  const timestamp = c || parseInt(+new Date() / 1000)
  return await axios.get(
    `${REACT_APP_API_URL}certificate-document/list?c=${timestamp}&count=${count}&user_type=${userType}`
  )
}

export const bulkGenerate = async (payload) => {
  return await axios.post(
    `${REACT_APP_API_URL}certificate-document/generate/bulk`,
    payload
  )
}

export const getDefaultTemplatePreview = async (payload) => {
  return await axios.post(
    `${REACT_APP_API_URL}certificate-template/preview/default`,
    {id: payload}
  )
}

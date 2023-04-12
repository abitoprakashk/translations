import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'

export const getTemplatePreview = async (payload) => {
  const res = await axios.post(`${REACT_APP_API_URL}id-card-template/preview`, {
    ...payload,
  })
  return res
}

export const saveTemplate = async (payload) => {
  const res = await axios.post(`${REACT_APP_API_URL}id-card-template/create`, {
    ...payload,
  })
  return res
}

export const getAllIdTemplates = async () => {
  const res = await axios.get(`${REACT_APP_API_URL}id-card-template/list`)
  return res
}

export const getTemplateDetails = async ({id, isDefault}) => {
  const res = await axios.get(
    `${REACT_APP_API_URL}id-card-template/details?id=${id}&default=${isDefault}`
  )
  return res
}

export const updateCustomIdTemplate = async (data) => {
  const res = await axios.post(`${REACT_APP_API_URL}id-card-template/update`, {
    ...data,
  })
  return res
}

export const generateSingleIdCard = async (data) => {
  const res = await axios.post(
    `${REACT_APP_API_URL}id-card-document/generate/single`,
    {
      ...data,
    }
  )
  return res
}

export const generateBulkIdCard = async (data) => {
  const res = await axios.post(
    `${REACT_APP_API_URL}id-card-document/generate/bulk`,
    {
      ...data,
    }
  )
  return res
}
export const getbulkGeneratedIDCardStatus = async (data) => {
  const res = await axios.post(`${REACT_APP_API_URL}id-card-document/details`, {
    ids: data,
  })
  return res
}

export const getGeneratedIdCardList = async (payload) => {
  const res = await axios.get(`${REACT_APP_API_URL}id-card-document/list`, {
    params: payload,
  })
  return res
}

export const getDefaultIdTemplatePreview = async (payload) => {
  return await axios.post(
    `${REACT_APP_API_URL}id-card-template/preview/default`,
    {id: payload}
  )
}

export const setActiveTemplate = async (payload) => {
  return await axios.post(
    `${REACT_APP_API_URL}id-card-template/select`,
    payload
  )
}

export const getIDCardOrderHistory = async () => {
  return await axios.get(`${REACT_APP_API_URL}id-card-order`)
}

export const getIdCardAccessoriesConfig = async () => {
  return await axios.get(`${REACT_APP_API_URL}id-card-order/config`)
}

export const idCardOrderCheckout = async (payload) => {
  return await axios.post(`${REACT_APP_API_URL}id-card-order/checkout`, payload)
}

export const getIdCardPayementId = async (payload) => {
  return await axios.post(`${REACT_APP_API_URL}id-card-order/pay`, payload)
}

export const idCardVerifyPayment = async (payload) => {
  return await axios.post(
    `${REACT_APP_API_URL}id-card-order/verify/payment`,
    payload
  )
}

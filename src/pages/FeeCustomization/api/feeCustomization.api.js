import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const FEE_CUSTOM_REPORT_CRUD = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
}

export const CRUDFeeCustomReportApi = async ({type, json}) => {
  const res = await axios.post(
    `${REACT_APP_API_URL}template-report/${type}`,
    json
  )
  return res.data
}

export const getFeeCustomizationSingleTemplateDataAPI = async (id) => {
  const res = await axios.get(`${REACT_APP_API_URL}template-report/template`, {
    params: {template_id: id},
  })
  return res.data
}

export const getAllFeeCustomizationTemplatesAPI = async () => {
  const res = await axios.get(`${REACT_APP_API_URL}template-report/templates`)
  return res.data
}

export const deleteFeeCustomizationReportAPI = async (id) => {
  const res = await axios.post(`${REACT_APP_API_URL}template-report/delete`, {
    template_id: id,
  })
  return res.data
}

export const getPivotTableDataAPI = async (params = {}) => {
  const _params = {}
  Object.keys(params).map((key) => {
    _params[key] = JSON.stringify(params[key])
  })
  const res = await axios.get(`${REACT_APP_API_URL}template-report/data`, {
    params: _params,
  })
  return res.data
}

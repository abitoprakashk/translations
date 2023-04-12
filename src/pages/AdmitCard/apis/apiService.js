import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const getStudentsListSectionWise = async (params) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}admit-card/student/wise/details`,
      params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const generateAdmitCards = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}admit-card/generate`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const generateBulkDownloadAdmiCardUrl = async (data) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}admit-card/by/sections?section_id=${data.section_id}&request_id=${data.request_id}`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getAdmitCardDownloadUrl = async (data) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}admit-card/by/sections?section_id=${data.section_id}`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

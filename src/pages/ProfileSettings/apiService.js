import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'

// Fetch persona profile Settings Saga call
export const getPersonaProfileSettings = async (payload) => {
  const userType = payload.persona ? payload.persona : ''
  const responseData = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}profile-settings/settings?persona=${userType}`,
  })
  return responseData
}

// Submit add category Form API
export const addCategorySubmitForm = async (payload) => {
  const responseData = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}profile-settings/add/category`,
    data: payload,
  })
  return responseData
}

// Fetch persona profile Settings Saga call
export const getCategoryFieldsSettings = async (payload) => {
  const responseData = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}profile-settings/category/fields`,
    data: payload,
  })
  return responseData
}

// Submit category add field form API
export const categoryAddFieldFormSubmit = async (payload) => {
  const responseData = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}profile-settings/add/field`,
    data: payload,
  })
  return responseData
}

// Update category field form API
export const categoryUpdateFieldFormSubmit = async (payload) => {
  const responseData = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}profile-settings/update/field`,
    data: payload,
  })
  return responseData
}

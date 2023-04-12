import {REACT_APP_API_URL} from '../../constants'
import axios from 'axios'

const getPersonaSettings = async (persona) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}profile-settings/settings`,
      {params: {persona: persona}}
    )
    return response
  } catch (e) {
    return {error: e}
  }
}

const getPersonaMembers = async (persona) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}ips/directory/list`,
      data: {type: [persona], include_left: false},
    })
    return response
  } catch (e) {
    return {error: e}
  }
}

const addPersonaMembers = async (data) => {
  try {
    const response = await axios({
      url: `${REACT_APP_API_URL}ips/add/users`,
      method: 'POST',
      data: data,
    })
    return response
  } catch (e) {
    return {error: e}
  }
}

const updatePersonaMembers = async (data) => {
  try {
    const response = await axios({
      url: `${REACT_APP_API_URL}ips/update/users`,
      method: 'POST',
      data: data,
    })
    return response
  } catch (e) {
    return {error: e}
  }
}

export {
  getPersonaSettings,
  getPersonaMembers,
  addPersonaMembers,
  updatePersonaMembers,
}

import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'

const userTypes = {
  student: 1,
  staff: 2,
}

const moduleTypes = {
  CERTIFICATE: 'certificate',
  IDCARD: 'id-card',
}

export const getImageSignedUrl = async ({type, module}) => {
  let url = `${REACT_APP_API_URL}${moduleTypes[module]}-image/signedUrl?content_type=${type}`
  const res = await axios.get(url)
  return res
}

export const storePublicUrlInDB = async ({module, ...data}) => {
  let url = `${REACT_APP_API_URL}${moduleTypes[module]}-image/save`
  const res = await axios.post(url, {
    ...data,
  })
  return res
}

export const getImageDirectory = async ({type, module}) => {
  let url = `${REACT_APP_API_URL}${moduleTypes[module]}-image/list?type=${type}`
  const res = await axios.get(url)
  return res
}

export const getTemplateFields = async ({module, type}) => {
  return await axios.get(
    `${REACT_APP_API_URL}${moduleTypes[module]}-field/list?user_type=${userTypes[type]}`
  )
}
// Delete template generated image
export const deleteCertiBackgroundImage = async ({imgId, module}) => {
  let url = `${REACT_APP_API_URL}${moduleTypes[module]}-image/delete`
  return await axios.post(url, {
    id: imgId,
  })
}

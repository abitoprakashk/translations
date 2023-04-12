import {REACT_APP_API_URL} from '../../../constants'
import axios from 'axios'
import {uploadFileBySignedUrl} from '../../../utils/SignedUrlUpload'

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

const getPersonaMembers = async (data) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}ips/institute/users`,
      data: data,
    })
    return response
  } catch (e) {
    return {error: e}
  }
}

const getSignedUrl = async (payload) => {
  const keyId = payload['key_id']
  const persona = payload['persona']
  const file_name = payload['file_name']
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}user-document/signed/url`,
      {params: {key_id: keyId, persona: persona, filename: file_name}}
    )
    return response
  } catch (e) {
    return {error: e}
  }
}

const getUuidSignedUrl = async (payload) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}user-document/uuid/signed/url`,
      data: payload,
    })
    return response
  } catch (e) {
    return {error: e}
  }
}

const uploadDocSignedUrl = (payload, OnSuccessfullyUploadedPic, OnError) => {
  return uploadFileBySignedUrl(payload.signedUrl, payload.attachment, {
    imageCompression: true,
    uploadFinished: OnSuccessfullyUploadedPic,
    onChunkUploadError: OnError,
  })
}

const uploadDocLink = async (data) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}user-document/update/document`,
      data: data,
    })
    return response
  } catch (e) {
    return {error: e}
  }
}

const uploadAttachmentId = async (data) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}user-document/update/key/value/uuid`,
      data: data,
    })
    return response
  } catch (e) {
    return {error: e}
  }
}

export {
  getPersonaMembers,
  getPersonaSettings,
  getSignedUrl,
  getUuidSignedUrl,
  uploadDocSignedUrl,
  uploadDocLink,
  uploadAttachmentId,
}

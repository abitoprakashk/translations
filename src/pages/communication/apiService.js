import axios from 'axios'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../constants'

const communicationParams = {
  title: '', //leave blank for poll/survery
  message: '', //poll/survery question will go here
  announcement_type: 0, //announcement: 0 / survery: 1 / poll: 2
  channels: [], //[ sms, notification, ivr ]
  segments: ['teacher', 'student', 'unassigned'], //[all] or [teacher, student, all, unassigned]
  duration: 0, //value in days (for survey/poll and optional for announcement)
  node_ids: [], // (it can be section id, standard id, department id)
  draft: false, //True/False
  unassigned: false,
  is_annonymos: false,
  is_poll_public: false,
  selected_users: [],
}

// const convertToFormData = (params) => {
//   let formData = new FormData()
//   Object.keys(params).forEach((key) => {
//     let val =
//       typeof params[key] === 'object' && !(params[key] instanceof File)
//         ? JSON.stringify(params[key])
//         : params[key]
//     formData.append(key, val)
//   })
//   return formData
// }

export const convertFiletoBase64 = (file) => {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = (fileEvent) => {
      const fileContents = fileEvent.target.result
      resolve(fileContents)
    }
    reader.onerror = () => {
      reject('oops, something went wrong with the file reader.')
    }
    reader.readAsDataURL(file)
  })
}
export const createNewCommunication = async (body) => {
  const fileObj = {file: null, voice: null}
  if (body.voice) {
    fileObj.voice = await convertFiletoBase64(body.voice)
  }
  body = {...communicationParams, ...body, ...fileObj}
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}communication/announcement`,
    headers: BACKEND_HEADERS,
    data: body,
  })

  return res.data
}

export const updateCommunication = async (body) => {
  const fileObj = {file: null, voice: null}
  delete body.file
  if (body.file) {
    fileObj.file = await convertFiletoBase64(body.file)
  }
  if (body.voice) {
    fileObj.voice = await convertFiletoBase64(body.voice)
  }
  body = {...communicationParams, ...body, ...fileObj}
  delete body.creator_i_user_id
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}communication/announcement`,
    headers: BACKEND_HEADERS,
    data: body,
  })

  return res.data
}

export const getUserList = async (body) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}communication/imembers`,
    data: body,
  })
  return res.data
}

export const getUncategorisedClasses = async (_institute_id) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-class/uncategorized/classroom`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const fetchPostsData = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}communication/institute/announcements`,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve(response.data.obj)
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const fetchFeedbackResponseData = (payload) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}communication/announcement/feedbacks`,
      params: {announcement_id: payload},
    })
      .then((response) => {
        if (response && response.data && response.data.status === true) {
          resolve(response.data.obj)
        } else {
          reject({errorOccured: true})
        }
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const deleteDraft = async (params) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}communication/announcement/remove`,
      data: params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getTemplate = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}communication-templates`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const sendReminder = async (params) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}announcements/send/reminder`,
      data: params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getPostReceiversList = async (postId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}announcements/receivers/list`,
      params: {_id: postId},
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const editCommunication = async (body) => {
  const fileObj = {file: null, voice: null}
  delete body.file
  if (body.voice) {
    fileObj.voice = await convertFiletoBase64(body.voice)
  }
  body = {...communicationParams, ...body, ...fileObj}
  delete body.creator_i_user_id
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}announcements/edit`,
    headers: {'Content-Type': 'application/json'},
    data: body,
  })

  return res.data
}

export const removePost = async (params) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}announcements/disable/post`,
      headers: {'Content-Type': 'application/json'},
      data: params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getSelectedUsers = async (post_id) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}announcements/selected/user/list`,
      params: {
        _id: post_id,
      },
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getSmsTemplates = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}sms/notification/templates`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}
export const getSmsUnusedQuota = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}sms/quota`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}
export const sendSms = async (body) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}sms/send`,
    headers: {'Content-Type': 'application/json'},
    data: body,
  })
  return res.data
}

export const getSmsPreview = async (body) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}sms/preview`,
    headers: {'Content-Type': 'application/json'},
    data: body,
  })
  return res.data
}

export const getSignedUrl = async (extension, name, mime) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}announcements/signed/url`,
      params: {
        extension,
        mime,
        file_name: name,
      },
    })
    return res.data.obj
  } catch (e) {
    return {error: e}
  }
}

export const createSmsRechargeOrder = async (data) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}sms/create/recharge/order`,
    data: data,
  })
  return res.data
}

export const verifySmsRecharge = async (order) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}sms/verify`,
    data: order,
  })
  return res.data
}

export const addOrUpdateRule = async (data) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}trigger/update-rule`,
    data: data,
  })
  return res.data
}

export const getRulesList = async (params) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}trigger/list-rules`,
    params: params,
  })
  return res.data
}

export const getSchedulerTemplates = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}trigger/trigger-settings`,
  })
  return res.data
}

export const postToggleSwitch = async (data) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}trigger/toggle-rule-active-status`,
    data: data,
  })
  return res.data
}

export const postDeleteRule = async (data) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}trigger/delete-rule`,
    data: data,
  })
  return res.data
}

export const fetchAutomatedMessages = async (data) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}trigger/view/automated-messages`,
    data: data,
  })
  return res.data
}

export const fetchRuleInstances = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}trigger/list-instances`,
  })
  return res.data
}

export const toggleRuleInstances = async (data) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}trigger/toggle-instance-status`,
    data: data,
  })
  return res.data
}

import axios from 'axios'
// import {showToast} from '../redux/actions/commonAction'
// import {GENERIC_ERROR_MESSAGE} from '../constants/common.constants'
import {BACKEND_HEADERS} from '../constants'
import store from '../redux/store'
import {
  // deleteAdminSpecificToLocalStorage,
  getAdminSpecificFromLocalStorage,
  getFromSessionStorage,
  setToSessionStorage,
} from './Helpers'
import {BROWSER_STORAGE_KEYS} from '../constants/institute.constants'
// import {LOGIN} from './SidebarItems'
// import {
//   REACT_APP_TEACHMINT_ACCOUNTS_URL,
//   REACT_APP_BASE_URL,
// } from '../constants'
import {t} from 'i18next'

// Method to get Institute ID
function getInstituteId() {
  return getAdminSpecificFromLocalStorage(
    BROWSER_STORAGE_KEYS.CURRENT_INSTITUTE_ID
  )
}
function getOrgId() {
  return getAdminSpecificFromLocalStorage(BROWSER_STORAGE_KEYS.CURRENT_ORG_ID)
}

export const getCurrentAcademicSessionId = () => {
  const state = store.getState()
  const {instituteAcademicSessionInfo, instituteActiveAcademicSessionId} = state

  // If user has already selected an academic session, return that academic session id
  if (instituteActiveAcademicSessionId) return instituteActiveAcademicSessionId

  // If user has not already selected an academic session manually,
  // select the session with active_status = 1 as the default selected academic session
  // If none is selected, this function returns undefined
  if (instituteAcademicSessionInfo?.length) {
    return instituteAcademicSessionInfo.find(
      (academicSession) => academicSession.active_status === 1
    )?._id
  } else
    return getAdminSpecificFromLocalStorage(
      BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID
    )
}

// Add a request interceptor
export const addAxiosRequestInterceptor = () => {
  axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      config.headers = {
        ...BACKEND_HEADERS,
        ...config.headers,
      }

      const instituteId = getInstituteId()
      if (instituteId) config.headers['X-InstituteId'] = instituteId
      const orgId = getOrgId()
      if (orgId) config.headers['X-OrgId'] = orgId

      const adminUUID = getFromSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID)
      if (adminUUID) config.headers['fetch-user'] = adminUUID

      const activeAcademicSessionId = getCurrentAcademicSessionId(
        BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID
      )

      if (activeAcademicSessionId && !config.headers['x-academicsessionid'])
        config.headers['x-academicsessionid'] = activeAcademicSessionId

      return config
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error)
    }
  )
}

// eslint-disable-next-line no-unused-vars
export const addAxiosResponseInterceptor = (dispatch) => {
  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      // const {
      //   data: {status, msg},
      // } = response
      // if (status === false) {
      //   const message = msg || GENERIC_ERROR_MESSAGE
      //   // dispatch(
      //   //   showToast({
      //   //     type: 'error',
      //   //     message,
      //   //   })
      //   // )
      //   return Promise.reject(message)
      // }

      // Set admin UUID to session storage
      const adminUUID = response?.data?.obj?.user_auth_uuid
      if (adminUUID && adminUUID !== 'None')
        setToSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID, adminUUID)

      // Logout if erro code = 1007
      // if (response?.data?.error_code == 1007) {
      //   deleteAdminSpecificToLocalStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID)
      //   window.location.href = `${REACT_APP_TEACHMINT_ACCOUNTS_URL}?client_id=tfi&redirect_uri=${REACT_APP_BASE_URL}${String(
      //     LOGIN
      //   ).substring(1)}&state=default&scope=all&utype=4`
      // }

      // if (response?.data?.error_code === 7010) {
      //   const base_url = window.location.origin
      //   const path = window.location.pathname
      //   if (path !== '/institute/dashboard/unauth') {
      //     window.location.href = `${base_url}/institute/dashboard/unauth`
      //   }
      // }

      return response
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      // console.error(error)
      const statusCode = error?.response?.status
      if (statusCode === 401) {
        // unauthenticated status handling here
      }
      if (statusCode === 403) {
        // unauthorised status handling here
      }
      const message = t('genericErrorMessage')
      // const message =
      //   'Something went wrong! Please contact support if the issue persists...'
      // dispatch(
      //   showToast({
      //     type: 'error',
      //     message,
      //   })
      // )
      return Promise.reject(message)
    }
  )
}

import axios from 'axios'
import {
  REACT_APP_API_URL,
  BACKEND_HEADERS,
  REACT_APP_TEACHMINT_COMPASS_URL,
} from '../constants'
import {convertFiletoBase64} from '../pages/communication/apiService'

axios.defaults.withCredentials = true

/**
 *  create a new admin by phone number
 */

export const getSystemTimestamp = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}get/timestamp`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (
          response &&
          response.data &&
          response.data.status === true &&
          response.data.obj
        )
          resolve({timestamp: response.data.obj.uid})
      })
      .catch((error) => reject(error))
  })
}

/**
 * checks if the person is already logged in or not.
 * response->
 *  status -> true
 *   msg-> NAME -> user is logged in
 *   msg-> NONAME -> user is logged in but had not filled Name and institute name (so redirect to that screen)
 *  status -> false
 *   not logged in
 */
export const utilsCheckLogin = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-admin/check/login`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true) {
          resolve({data: response.data.obj.msg})
        } else {
          resolve({data: 'FAILED'})
        }
      })
      .catch((_error) => reject({errorOccured: true}))
  })
}

/**
 * calls the REACT_APP_API_URL to logout.
 */
export const utilsLogout = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-admin/logout`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true) {
          resolve({redirect: true})
        }
      })
      .catch((_error) => reject({errorOccured: true}))
  })
}

/**
 *   update admin data
 */
export const utilsUpdateAdminData = (adminName) => {
  return new Promise((resolve, reject) => {
    let fd = new FormData()
    fd.append('name', adminName)

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}admin/info`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({status: true})
        reject({errorOccured: true})
      })
      .catch((_error) => reject({errorOccured: true}))
  })
}

/**
 *   create new institute
 */
export const utilsCreateInstitute = (
  instituteName,
  instituteType,
  whatsappOptIn,
  affiliatedBoard,
  departmentItems,
  academicYearStart,
  academicYearEnd,
  institutePhoneNumbers,
  selectedLanguage,
  selectedCountry,
  selectedCurrency,
  fromClass,
  toClass,
  lsParams
) => {
  return new Promise((resolve, reject) => {
    const startDateFullYear = academicYearStart.getFullYear()
    const endDateFullYear = academicYearEnd.getFullYear()

    const academicSessionName =
      startDateFullYear === endDateFullYear
        ? `Session ${startDateFullYear}`
        : `Session ${startDateFullYear} - ${endDateFullYear}`
    let data = {
      name: instituteName,
      institute_type: instituteType,
      whatsapp_opt_in: whatsappOptIn,
      affiliated_by: affiliatedBoard,
      departments: departmentItems,
      academic_session_start_time: academicYearStart.getTime(),
      academic_session_end_time: academicYearEnd.getTime(),
      academic_session_name: academicSessionName,
      phone_numbers: institutePhoneNumbers,
      country: selectedCountry,
      currency: selectedCurrency,
      language: selectedLanguage,
      fromClass: fromClass,
      toClass: toClass,
      ls_params: lsParams,
    }

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/create`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({instituteIdTemp: response.data.obj.institute_id})
        reject({errorOccured: true})
      })
      .catch((_error) => reject({errorOccured: true}))
  })
}

/**
 * Add institute logo
 */
export const utilsAddInstituteLogo = async (instituteId, instituteLogo) => {
  if (instituteLogo) {
    instituteLogo = await convertFiletoBase64(instituteLogo)
  }
  return new Promise((resolve, reject) => {
    const data = {
      file: instituteLogo,
    }

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/upload/logo`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then(async (response) => {
        if (response && response.data && response.data.status === true) {
          resolve({status: true})
        }
      })
      .catch((_error) => reject({errorOccured: true}))
  })
}

/**
 *   create new institute
 */
export const utilsValidateAuthCode = (authCode) => {
  return new Promise((resolve, reject) => {
    let params = new URLSearchParams()
    params.append('code', authCode)

    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}user_service/authorize`,
      headers: BACKEND_HEADERS,
      params,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch((_error) => reject({errorOccured: true}))
  })
}

/**
 *   create new institute
 */
export const utilsNotRegistredLeadSquare = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/lead/square/info`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch((_error) => reject({errorOccured: true}))
  })
}

/**
 * Get Current Location
 */
export const utilsGetUserLocation = () => {
  return new Promise((resolve, reject) => {
    fetch(`${REACT_APP_TEACHMINT_COMPASS_URL}resolve/country`)
      .then((response) => response.json())
      .then((obj) => {
        resolve({...obj})
      })
      .catch((error) => reject(error))
  })
}

/**
 * Get Country Data
 */
export const utilsGetCountryInfo = () => {
  return new Promise((resolve, reject) => {
    fetch('https://accounts.teachmint.com/get/country/codes')
      .then((response) => response.json())
      .then((data) => resolve({...data}))
      .catch((_error) => reject({errorOccured: true}))
  })
}

/**
 *   Edit Institute Structure
 */
export const utilsEditInstituteStructure = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/edit/structure`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({status: true, obj: response.data.obj})
        reject({errorOccured: true})
      })
      .catch((_error) => reject({errorOccured: true}))
  })
}

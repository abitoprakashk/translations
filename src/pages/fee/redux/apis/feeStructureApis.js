import axios from 'axios'
import {DateTime} from 'luxon'
import {Trans} from 'react-i18next'
import {generatePath} from 'react-router-dom'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../../../constants'
import {
  ERROR_MESSAGES,
  FEE_STRUCTURE_TYPES_IDS,
  STUDENT_OPTIONS,
  TRANSPORT_METHODS,
  URL_ADD_CUSTOM_CATEGORY,
  URL_CHECK_RECIPT_PREFIX,
  URL_DELETE_FEE_STRUCTURE,
  URL_FEE_MODIFY_PREVIOUS_DUES_STRUCTURE,
  URL_FEE_DELETE_STUDENT_PREVIOUS_SESSION_DUES,
  URL_FEE_FETCH_IMPORTED_SESSION_DUE_DATA,
  URL_FEE_FETCH_FAILED_SESSION_TRANSFER_TASK,
  URL_FEE_ACKNOWLEDGE_FAILED_TASK,
  URL_FEE_STRUCTURE,
  URL_IMPORT_PREVIOUS_SESSION_DUES,
  URL_FEE_STRUCTURE_DOWNLOAD_REPORT,
  URL_FETACH_FEE_STRUCTURE,
  URL_FETCH_PREVIOUS_SESSION_DUES,
  URL_FETCH_FEE_CATEGORIES,
  URL_FETCH_USED_FEE_CATEGORIES,
  URL_GET_FEE_SETTING,
  URL_GET_FEE_STRUCTURE,
  URL_MODIFY_FEE_INSTALLMENT,
  URL_UPDATE_FEE_STRUCTURE,
} from '../../fees.constants'

const somethingWentWrong = (
  <Trans i18nKey={'somethingWentWrong'}>Something went wrong</Trans>
)

const apiErrorResponse = {
  status: false,
  msg: somethingWentWrong,
}

// List of keys to remove from data before sending to APIs
const unusedProperties = ['c', 'u', 'deleted', 'institute_id', 'session_id']

const generateUrl = (url, data) => {
  return `${REACT_APP_API_URL}${generatePath(url, data)}`
}

// Format fee structure data before creating/updating
const formatFeeStructureFormValues = (formValues) => {
  const feeStructure = JSON.parse(JSON.stringify(formValues))
  if (feeStructure.fee_type === 'CUSTOM') {
    delete feeStructure.fee_types
    return feeStructure
  }
  feeStructure.applicable_students = !feeStructure.applicable_students
    ? STUDENT_OPTIONS.NONE
    : feeStructure.applicable_students
  feeStructure.fee_categories.map((category, index) => {
    feeStructure.fee_categories[index]._id = category._id ?? null
    feeStructure.fee_categories[index].is_delete = category.isDelete
    if (feeStructure.fee_type !== FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE) {
      feeStructure.fee_categories[index].amount = parseInt(category.amount)
    } else {
      Object.values(feeStructure.schedule_timestamps).forEach((timestamp) => {
        if (!category.schedule[timestamp]) {
          feeStructure.fee_categories[index].schedule[timestamp] = 0
        }
      })
    }
    if (feeStructure.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
      if (feeStructure.transport_type === TRANSPORT_METHODS.DISTANCE) {
        feeStructure.fee_categories[index].distance = [
          parseFloat(category.distanceFrom),
          parseFloat(category.distanceTo),
        ]
      }
      delete feeStructure.fee_categories[index].distanceFrom
      delete feeStructure.fee_categories[index].distanceTo
      delete feeStructure.fee_categories[index].master_id
    } else {
      feeStructure.fee_categories[index].tax = parseFloat(
        category.tax !== '' ? category.tax : 0
      )
    }
    delete feeStructure.fee_categories[index].isDelete
    // Remove unused properties
    unusedProperties.forEach(
      (e) => delete feeStructure.fee_categories[index][e]
    )
  })
  if (feeStructure.fee_type !== FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
    delete feeStructure.tax
  } else {
    feeStructure.tax = parseFloat(
      feeStructure.tax !== '' ? feeStructure.tax : 0
    )
  }

  // Remove deleted categories while creating structures
  if (!feeStructure._id) {
    let feeCategories = []
    feeStructure.fee_categories.map((category) => {
      if (!category.is_delete) {
        feeCategories.push(category)
      }
    })
    feeStructure.fee_categories = feeCategories
  }

  if (feeStructure.fee_type === FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE) {
    feeStructure.onetime_due_date = DateTime.fromSeconds(
      feeStructure.onetime_due_date
    ).toFormat('yyyy-MM-dd')
  }
  feeStructure.schedule_timestamps = Object.values(
    feeStructure.schedule_timestamps
  )
  feeStructure.due_date = parseInt(feeStructure.due_date)

  // Profile based properties
  feeStructure.profile_filters = {}
  if (
    feeStructure?.gender &&
    feeStructure.gender !== '' &&
    feeStructure.gender !== 'all'
  ) {
    feeStructure.profile_filters.gender = feeStructure.gender
  }
  if (
    feeStructure?.category &&
    feeStructure.category.length > 0
    // feeStructure.category.length !== PROFILE_CATEGORY_OPTIONS.length
  ) {
    feeStructure.profile_filters.category = feeStructure.category
  }

  // Remove unused properties
  unusedProperties.forEach((e) => delete feeStructure[e])

  return feeStructure
}

// Format fee structure data before editing
const formatGetFeeStructureData = (response) => {
  let data = response.data.obj
  // Format fee categories
  data.fee_categories.map((category, index) => {
    data.fee_categories[index].isDelete = false
    if (
      data.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE &&
      data.transport_type !== TRANSPORT_METHODS.WAYPOINT
    ) {
      data.fee_categories[index].distanceFrom = category.distance[0]
      data.fee_categories[index].distanceTo = category.distance[1]
      delete data.fee_categories[index].distance
    }
  })
  // Format due date and Schedule timestamps
  let schedule_timestamps = {}
  if (data.fee_type === FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE) {
    data.onetime_due_date = data.schedule_timestamps[0]
    data.schedule_timestamps.forEach((timestamp) => {
      schedule_timestamps.onetime = timestamp
    })
  } else {
    data.schedule_timestamps.sort().forEach((timestamp) => {
      schedule_timestamps[DateTime.fromSeconds(timestamp).toFormat('MM-yyyy')] =
        timestamp
    })
  }
  data.schedule_timestamps = schedule_timestamps
  // Support for old structures which doesn't have transport type
  if (
    data.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE &&
    data.transport_type === TRANSPORT_METHODS.NONE
  ) {
    data.transport_type = TRANSPORT_METHODS.DISTANCE
  }
  data.gender = data?.profile_filters?.gender
  data.category = data?.profile_filters?.category
  delete data?.profile_filters
  return data
}

// Fetch fee structures and classes listing
export const fetchFeeStructureData = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_FETACH_FEE_STRUCTURE),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Fetch fee structures and classes listing
export const fetchPreviousSessionDues = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_FETCH_PREVIOUS_SESSION_DUES),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Fetch Fee Categories
export const fetchFeeCategories = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_FETCH_FEE_CATEGORIES),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Fetch Fee Categories
export const fetchUsedFeeCategories = (session) => {
  return new Promise((resolve, reject) => {
    const data = {
      prev_session_id: session,
    }
    axios({
      method: 'POST',
      url: generateUrl(URL_FETCH_USED_FEE_CATEGORIES, session),
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Check receipt prefix already exists
export const checkReceiptPrefix = (prefix) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_CHECK_RECIPT_PREFIX, {prefix}),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Create fee structure data
export const createFeeStructure = (formValues) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_FEE_STRUCTURE),
      headers: BACKEND_HEADERS,
      data: formatFeeStructureFormValues(formValues),
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Import Previous Session Dues
export const importPreviousSessionDues = (formValues) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_IMPORT_PREVIOUS_SESSION_DUES),
      headers: BACKEND_HEADERS,
      data: formValues,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Get specific fee structure
export const getFeeStructure = (feeStructureId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_GET_FEE_STRUCTURE, {feeStructureId}),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data?.status) {
          resolve({
            status: response.data.status,
            obj: formatGetFeeStructureData(response),
          })
        } else reject(apiErrorResponse)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Update fee structure
export const updateFeeStructure = (formValues) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_UPDATE_FEE_STRUCTURE),
      headers: BACKEND_HEADERS,
      data: formatFeeStructureFormValues(formValues),
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Delete fee structure
export const deleteFeeStructure = (feeStructureId) => {
  const data = {
    structure_id: feeStructureId,
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_DELETE_FEE_STRUCTURE),
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Download fee structure report
export const downloadFeeStructureReport = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_FEE_STRUCTURE_DOWNLOAD_REPORT),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Modify Fee Installment of Recurring and Transport Structures
export const modifyFeeInstallment = (data) => {
  const schedules = {...data.schedule}
  Object.keys(schedules).map((timestamp) => {
    schedules[timestamp] = parseInt(schedules[timestamp])
  })
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_MODIFY_FEE_INSTALLMENT),
      headers: BACKEND_HEADERS,
      data: {
        _id: data._id,
        schedule: schedules,
      },
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Modify Previous Session Dues
export const modifyPreviousSessionDues = (data) => {
  let categories = []
  Object.keys(data.categories).forEach((category) => {
    categories.push({
      _id: category,
      amount: parseInt(data.categories[category]),
    })
  })
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_FEE_MODIFY_PREVIOUS_DUES_STRUCTURE),
      headers: BACKEND_HEADERS,
      data: {
        student_id: data.student_id,
        categories: categories,
      },
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Delete Single Student from Previous Session Dues
export const deleteStudentPreviousSessionDues = (data) => {
  let category_ids = []
  data.categories.map((category) => {
    category_ids.push(category._id)
  })
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_FEE_DELETE_STUDENT_PREVIOUS_SESSION_DUES),
      headers: BACKEND_HEADERS,
      data: {
        student_id: data.student_id,
        category_ids: category_ids,
        structure_id: data.structure_id,
      },
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Fetch imported session dues
export const fetchImportedSessionDueData = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_FEE_FETCH_IMPORTED_SESSION_DUE_DATA),
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Fetch imported session dues
export const fetchFailedSessionTransferTask = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_FEE_FETCH_FAILED_SESSION_TRANSFER_TASK),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// acknowledgeFailedTask
export const acknowledgeFailedTask = (payload) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_FEE_ACKNOWLEDGE_FAILED_TASK),
      headers: BACKEND_HEADERS,
      data: payload,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Fetch global fee settings
export const fetchFeeSettings = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_GET_FEE_SETTING),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Create new custom category for Recurring and Onetime structures
export const newCustomCategoryCreate = async (formData) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_ADD_CUSTOM_CATEGORY),
      data: formData,
    })
      .then((response) => {
        if (response?.data?.status) {
          resolve(response.data)
        } else {
          reject({
            message: response?.data?.msg
              ? response.data.msg
              : ERROR_MESSAGES.customCategory.notCreated,
          })
        }
      })
      .catch(() => {
        reject({message: ERROR_MESSAGES.customCategory.errorWhileCreating})
      })
  })
}

export const getFeeWebinarStatus = async () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/webinar/status`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) {
          let data = res.data.obj
          resolve(data)
        } else reject({message: res.data.msg})
      })
      .catch(() => {
        reject(apiErrorResponse)
      })
  })
}

export const revokeFeeReceiptsTransactions = async (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}fee-module/revoke/bulk/transactions`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((res) => {
        if (res?.data?.status) {
          let data = res.data
          resolve(data)
        } else reject({message: res.data.msg})
      })
      .catch(() => {
        reject(apiErrorResponse)
      })
  })
}

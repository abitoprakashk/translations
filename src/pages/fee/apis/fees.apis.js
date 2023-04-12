import axios from 'axios'
import {generatePath} from 'react-router-dom'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../../constants'
import {
  changeDateFormateToSec,
  hugeDateConverter,
  toCamelCasedKeys,
} from '../../../utils/Helpers'
import {
  URL_COLLECT_FEES,
  URL_CREATE_DISCOUNT,
  URL_DELETE_DISCOUNT,
  URL_EDIT_DISCOUNT,
  URL_FETACH_FEE_HISTORY,
  URL_FETACH_STUDENT_DETAIL,
  URL_FETCH_DISCOUNTS,
  URL_FETCH_DISCOUNT_STUDENTS_LIST,
  URL_FETCH_FEE_COLLECTIOIN_STATS,
  URL_FETCH_STUDENT_DUES_DATA,
  URL_GET_SECTION_OF_CLASS,
  URL_SEARCH_STUDENT,
  URL_SEND_REMINDER,
  URL_UPDATE_DISCOUNT,
  URL_REVOKE_TRANSACTION,
  URL_DOWNLOAD_DEMAND_LETTER,
  URL_REFRESH_TRANSACTION,
  URL_SETTING_UPDATE,
  URL_DASHBOARD_FETCH_FEE_STATISTICS,
  URL_FETCH_STUDENT_IDS_FOR_FEE_REMINDER,
  URL_DOWNLOAD_RECEIPTS,
  URL_COLLECT_BACKDATED_PAYMENT,
  URL_GET_COLLECT_BACKDATED_PAYMENT_TASK,
  URL_GET_COLLECT_BACKDATED_PAYMENT_TASK_ACKNOWLEDGE,
  URL_DELETE_STUDENT_ADHOC_DISCOUNT,
  URL_ENABLE_TEACHPAY,
  URL_ADMIN_TO_TEACHPAY,
  URL_STUDENT_DATA_TO_TEACHPAY,
} from '../fees.constants'
import {createFeeStructureTree, prepareFeesPayload} from './fees.utils'

const generateUrl = (url, data) => {
  return `${REACT_APP_API_URL}${generatePath(url, data)}`
}

const apiErrorResponse = {
  status: false,
  msg: 'Something went wrong',
}

export const fetchFeeCollectionStats = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_FETCH_FEE_COLLECTIOIN_STATS),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve(
            response.data.obj.section_wise.map((sectionData) =>
              toCamelCasedKeys(sectionData)
            )
          )
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const fetchDashboardFeeStatistics = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_DASHBOARD_FETCH_FEE_STATISTICS),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data.obj)
        else reject(apiErrorResponse)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const fetchStudentDuesData = async (classIds, sectionIds) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_FETCH_STUDENT_DUES_DATA),
      headers: BACKEND_HEADERS,
      data: {
        class_ids: classIds,
        section_ids: sectionIds,
        // handle status filter from frontend
        payment_status: 'ALL',
      },
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({
            ...response.data.obj,
            students: response.data.obj.students.map((classData) =>
              toCamelCasedKeys(classData)
            ),
          })
        reject(response.data.msg)
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const downloadDemandLetter = (studentId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_DOWNLOAD_DEMAND_LETTER, {studentId}),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// Fee Transaction APIs Start
export const fetchFeeTransacationListData = async (
  sessionStartDate,
  sessionEndDate,
  paymentStatus = 'ALL',
  paymentModes = []
) => {
  const startDate = sessionStartDate.setHours(0, 0, 0) / 1000
  const endDate = sessionEndDate.setHours(23, 59, 59) / 1000

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}fee-module/fee/transactions`,
      headers: BACKEND_HEADERS,
      data: {
        start_date: startDate,
        end_date: endDate,
        payment_status: paymentStatus,
        payment_methods: paymentModes,
      },
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve(response.data.obj)
        reject(response.data.msg)
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const fetchFeeTransacationTimelineData = (
  transactionId,
  transPaymentMode
) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}contingent-transactions/transaction/timeline?pending_transaction_id=${transactionId}&mode=${transPaymentMode}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve(response.data.obj)
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const downloadFeeTransactionReceipt = (
  studentId,
  receiptNo,
  isCancelled
) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/receipt/download?student_id=${studentId}&receipt_number=${receiptNo}${
        isCancelled ? '&cancelled=true' : ''
      }`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve(response.data.obj)
        reject(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const revokeTransaction = (receiptNo, isCancelled) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_REVOKE_TRANSACTION),
      headers: BACKEND_HEADERS,
      data: {
        receipt_no: receiptNo,
        is_cancelled: isCancelled,
      },
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve(response.data.obj)
        else reject(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const fetchFeeTransacationTimelineStatusUpdate = async (
  transactionId,
  transStatus
) => {
  let timelineUpdateStatus = {
    transaction_id: transactionId,
    transaction_status: transStatus,
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}contingent-transactions/update/transaction/status`,
      headers: BACKEND_HEADERS,
      data: timelineUpdateStatus,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve(response.data.obj)
        reject(response.data.msg)
      })
      .catch(() => reject({errorOccured: true}))
  })
}
// Fee Transaction APIs End

export const sendReminder = async (studentIds) => {
  // const res = await axios({
  //   method: 'POST',
  //   url: `${REACT_APP_API_URL}fee/send/reminder/`,
  //   headers: BACKEND_HEADERS,
  //   data: toFormData({
  //     institute_id: instituteId,
  //     student_ids: toArrayString(studentIds),
  //   }),
  // })

  // return res.data.status

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      // url: `${REACT_APP_API_URL}fee/send/reminder/`,
      url: generateUrl(URL_SEND_REMINDER),
      headers: BACKEND_HEADERS,
      data: {
        student_ids: studentIds,
      },
    })
      .then((res) => {
        if (res?.data?.status) {
          resolve(res.data.status)
        } else reject({message: res.data.msg})
      })
      .catch(() => {
        reject({message: 'Some error happened with sending fee reminder'})
      })
  })
}

export const fetchStudentDetails = async (phoneNumber) => {
  const res = await axios({
    method: 'GET',
    // url: `${REACT_APP_API_URL}v1/get/single/student/detail/${instituteId}/${phoneNumber}`,
    url: generateUrl(URL_FETACH_STUDENT_DETAIL, {phoneNumber}),
    headers: BACKEND_HEADERS,
  })
  return toCamelCasedKeys(res.data.obj)
}

export const fetchFeeHistory = async (studentId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      // url: `${REACT_APP_API_URL}fee/details/student/${instituteId}/${academicSessionId}/${studentId}/`,
      url: generateUrl(URL_FETACH_FEE_HISTORY, {studentId}),
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) {
          let data = res.data.obj
          data = toCamelCasedKeys(data)
          data.receipts = data.receipts.map((r) => toCamelCasedKeys(r))
          data.studentId = studentId
          resolve(data)
        } else reject({message: res.data.msg})
      })
      .catch(() => {
        reject({message: 'Some error happened with fetching fee history'})
      })
  })
}

export const searchStudents = async (searchTerm) => {
  return new Promise((resolve, reject) => {
    if (!searchTerm) {
      resolve([])
    }

    axios({
      method: 'GET',
      // url: `${REACT_APP_API_URL}search/student/fee/${instituteId}/${academicSessionId}/?search=${searchTerm}`,
      url: generateUrl(URL_SEARCH_STUDENT, {searchTerm}),
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.obj)
          resolve(res.data.obj.map((student) => toCamelCasedKeys(student)))
        else reject({errorOccured: true, message: res?.data?.msg})
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const getSectionsOfClass = async (classId) => {
  const res = await axios({
    method: 'GET',
    // url: `${REACT_APP_API_URL}v1/get/node/details/${instituteId}/${classId}`,
    url: generateUrl(URL_GET_SECTION_OF_CLASS, {classId}),
    headers: BACKEND_HEADERS,
  })
  return res.data.obj.children.map((sec) => ({
    id: sec.id,
    name: sec.name,
  }))
}

export const collectPaymentDetail = async (studentId, advancePayment) => {
  let apiUrl = ''
  // const res = await axios({
  //   method: 'GET',
  //   url: `${REACT_APP_API_URL}collect/payment/details/${instituteId}/${academicSessionId}/${studentId}/`,
  //   headers: BACKEND_HEADERS,
  // })
  if (advancePayment) {
    apiUrl = `${REACT_APP_API_URL}fee-module/collect/payment/details?student_id=${studentId}&advance_payment=true`
  } else {
    apiUrl = `${REACT_APP_API_URL}fee-module/collect/payment/details?student_id=${studentId}`
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      // url: `${REACT_APP_API_URL}collect/payment/details/${instituteId}/${academicSessionId}/${studentId}/`,
      url: apiUrl,
      // url: generateUrl(URL_COLLECT_PAYMENT_DETAIL, {studentId: studentId}),
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) {
          const feesData = createFeeStructureTree(res.data.obj)
          resolve(feesData)
        } else reject({message: res.data.msg})
      })
      .catch(() => {
        reject({
          message: 'Some error happened with fetching fee collection data',
        })
      })
  })
}

export const collectFees = async (studentId, feesData, metaData = {}) => {
  const feesPayload = prepareFeesPayload(feesData, metaData)

  const convertedDate = hugeDateConverter(feesData.payDate)
  const processDate = changeDateFormateToSec(convertedDate, 'fullDate')
  const disbursalDate = feesData.disbursalDate
    ? changeDateFormateToSec(feesData.disbursalDate)
    : ''

  const payload = {
    student_id: studentId,
    payment_method: feesData.paymentMethod,
    payment_id: feesData.referenceNumber || '',
    timestamp: processDate,
    // payment_date: processDate,
    fees_paid: feesPayload,
    additional_notes: feesData.optionalData || '',
    payment_status: feesData.transactionStatus || 'RECEIVED',
    disbursal_timestamp: disbursalDate,
    class_id: feesData.classId,
    fine_amount: feesData.fine_amount || 0,
  }
  if (metaData?.lumpsumData) {
    payload.lumpsum_amount_data = metaData?.lumpsumData
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      // url: `${REACT_APP_API_URL}fee/student/payment/${instituteId}/${studentId}/`,
      url: generateUrl(URL_COLLECT_FEES),
      headers: BACKEND_HEADERS,
      data: payload,
    })
      .then((res) => {
        if (res?.data?.status) {
          let data = res.data.obj
          resolve(data)
        } else
          reject({
            //message: res.data.msg, TODO : Ask BE team to send a better message
            message: res.data.msg,
          })
      })
      .catch(() => {
        reject({message: 'Payment was not recorded. Please try again.'})
      })
  })
}

// Offers and Discounts API
export const fetchDiscounts = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_FETCH_DISCOUNTS),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        reject(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const fetchDiscountStudentsList = ({formValues, feeCategories}) => {
  let filters = {fee_categories: feeCategories}
  if (formValues._id) {
    filters = {...filters, discount_id: formValues._id}
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_FETCH_DISCOUNT_STUDENTS_LIST),
      //url: `${REACT_APP_API_URL}fee-module/student/list/filter/by/category?fee_categories=${feeCategories}&discount_id=${formValues._id}`,
      headers: BACKEND_HEADERS,
      data: filters,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        reject(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const createDiscount = (discount) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_CREATE_DISCOUNT),
      headers: BACKEND_HEADERS,
      data: discount,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        reject(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const editDiscount = (discountId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_EDIT_DISCOUNT, {discountId}),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        reject(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const updateDiscount = (discount) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_UPDATE_DISCOUNT),
      headers: BACKEND_HEADERS,
      data: discount,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        reject(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const deleteDiscount = (discountId) => {
  return new Promise((resolve, reject) => {
    const data = {
      discount_id: discountId,
    }
    axios({
      method: 'POST',
      url: generateUrl(URL_DELETE_DISCOUNT),
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        reject(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const kycStatus = async (_instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/online/payment/kyc/status`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) {
          let data = res.data.obj
          resolve(data)
        } else {
          reject({message: 'KYC Status Pending'})
        }
      })
      .catch(() => {
        reject({message: 'Some Error happend while submitting KYC Details'})
      })
  })
  // return Promise.resolve({status: Math.floor(Math.random() * 10)})
}

export const multiplePaymentGatewayCreate = async (formData) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}fee-module/pg/create`,
      data: formData,
    })
      .then((res) => {
        if (res?.data?.status) {
          let data = res.data.obj
          resolve(data)
        } else {
          reject({message: 'Paymentgateway is not created'})
        }
      })
      .catch(() => {
        reject({message: 'Some Error happend while submitting KYC Details'})
      })
  })
  // return Promise.resolve({status: Math.floor(Math.random() * 10)})
}

export const updateFeeSetting = (data1) => {
  return new Promise((resolve, reject) => {
    let data = data1.payload
    axios({
      method: 'POST',
      url: generateUrl(URL_SETTING_UPDATE),
      headers: BACKEND_HEADERS,
      data: {
        data,
      },
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        else reject(response?.data ?? apiErrorResponse)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const refreshOnlineStatus = async (transactionData) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_REFRESH_TRANSACTION),
      headers: BACKEND_HEADERS,
      data: transactionData,
    })
      .then((res) => {
        if (res?.data?.status) {
          resolve(res.data.status)
        } else reject({message: res.data.msg || 'Something went wrong'})
      })
      .catch(() => {
        reject({message: 'Something went wrong'})
      })
  })
}

export const fetchStudentIdsForFeeReminder = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(URL_FETCH_STUDENT_IDS_FOR_FEE_REMINDER),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data.obj)
        else reject(apiErrorResponse)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const downloadCombineReciepts = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_DOWNLOAD_RECEIPTS),
      headers: BACKEND_HEADERS,
      data,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve(response.data.obj)
        else reject(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const collectBackdatedPayment = (payload) => {
  return new Promise((resolve, reject) => {
    const data = {
      data: payload,
    }
    axios({
      method: 'POST',
      url: generateUrl(URL_COLLECT_BACKDATED_PAYMENT),
      headers: BACKEND_HEADERS,
      data,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        else reject(apiErrorResponse)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const collectBackdatedPaymentTaskRequest = (taskId = '') => {
  let url = `${generateUrl(URL_GET_COLLECT_BACKDATED_PAYMENT_TASK)}${
    taskId ? `?_id=${taskId}` : ''
  }`

  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        else reject(apiErrorResponse)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const collectBackdatedPaymentTaskAcknowledge = (payload) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_GET_COLLECT_BACKDATED_PAYMENT_TASK_ACKNOWLEDGE),
      headers: BACKEND_HEADERS,
      data: payload,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        else reject(apiErrorResponse)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const deleteStudentAdHocDiscount = (payload) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(URL_DELETE_STUDENT_ADHOC_DISCOUNT),
      headers: BACKEND_HEADERS,
      data: payload,
    })
      .then((response) => {
        if (response?.data?.status) resolve(response.data)
        else {
          reject(response?.data)
        }
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const enableTechPay = async () => {
  return await axios({
    method: 'POST',
    url: generateUrl(URL_ENABLE_TEACHPAY),
    data: {},
  })
}

export const adminToTechPay = async () => {
  return await axios({
    method: 'POST',
    url: generateUrl(URL_ADMIN_TO_TEACHPAY),
    data: {},
  })
}

export const studentDataSendToTechPay = async () => {
  return await axios({
    method: 'POST',
    url: generateUrl(URL_STUDENT_DATA_TO_TEACHPAY),
    data: {},
  })
}

import axios from 'axios'
import {Trans} from 'react-i18next'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../../../../constants'

const generateUrl = (uri) => `${REACT_APP_API_URL}/fee-module/${uri}`

const somethingWentWrong = (
  <Trans i18nKey={'somethingWentWrong'}>Something went wrong</Trans>
)

const apiErrorResponse = {
  status: false,
  msg: somethingWentWrong,
}

export const getStudentProfileFeeTabDetails = ({studentId = null}) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(`student/fee/summary?student_id=${studentId}`),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const getStudentProfileFeeUpdateHistory = ({studentId = null}) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}/fee-module/student/fee/history?student_id=${studentId}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

// export const getStudentProfileFeeSummary = ({studentId = null}) => {
//   return new Promise((resolve, reject) => {
//     axios({
//       method: 'GET',
//       url: `${REACT_APP_API_URL}/fee/student/${studentId}/summary`,
//       // url: `${REACT_APP_API_URL}/institute/announcements`,
//       headers: BACKEND_HEADERS,
//     })
//       .then((response) => {
//         resolve(response.data)
//       })
//       .catch(() => reject(apiErrorResponse))
//   })
// }

// export const getStudentProfileFeeInstalmentWiseDetails = ({
//   studentId = null,
// }) => {
//   return new Promise((resolve, reject) => {
//     axios({
//       method: 'GET',
//       url: `${REACT_APP_API_URL}/fee/transactions/${studentId}/`,
//       // url: `${REACT_APP_API_URL}/institute/announcements`,
//       headers: BACKEND_HEADERS,
//     })
//       .then((response) => {
//         resolve(response.data)
//       })
//       .catch(() => reject(apiErrorResponse))
//   })
// }

export const getStudentProfileFeePaymentHistory = ({
  studentId = null,
  modalForAndTimeStamp = {},
}) => {
  return new Promise((resolve, reject) => {
    let url = generateUrl(`payment/transaction/history?student_id=${studentId}`)
    if (modalForAndTimeStamp?.installmentTimestamp) {
      url = `${url}&timestamp=${modalForAndTimeStamp.installmentTimestamp}`
    }

    axios({
      method: 'GET',
      url,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const getStudentProfileFeeDiscountTillDate = ({studentId = null}) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(`discount/till/date?student_id=${studentId}`),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const getStudentProfileWalletTransactions = ({studentId = null}) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}/fee/student/${studentId}/wallet/transactions`,
      // url: `${REACT_APP_API_URL}/institute/announcements`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const studentProfileWalletRefundRequest = ({studentId}) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}/fee/student/${studentId}/wallet/refund`,
      // url: `${REACT_APP_API_URL}/institute/announcements`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const getReceiptPrefixesRequest = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: generateUrl(`receipt/prefixes`),
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const addStudentAddOnFeesRequest = (payload) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(`add/addon/fees`),
      headers: BACKEND_HEADERS,
      data: payload,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const deleteAddOnFee = (payload) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(`delete/addon/fee`),
      headers: BACKEND_HEADERS,
      data: payload,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

export const addStudentAddOnDiscount = (payload) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: generateUrl(`add/addon/discount`),
      headers: BACKEND_HEADERS,
      data: payload,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => reject(apiErrorResponse))
  })
}

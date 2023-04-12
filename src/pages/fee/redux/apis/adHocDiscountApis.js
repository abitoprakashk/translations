import axios from 'axios'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../../../constants'

const apiErrorResponse = {
  status: false,
  msg: 'Something went wrong',
}

export const fetchAdHocStudentListing = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/adhoc/student/listing`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject(apiErrorResponse)
      })
  })
}

export const createDiscountReason = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}fee-module/create/discount/reason`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject(apiErrorResponse)
      })
  })
}

export const fetchAdHocDiscountList = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/discount/reason`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject(apiErrorResponse)
      })
  })
}

export const downloadAdHocDiscountReceipt = (studentId, receiptNo) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/receipt/download?student_id=${studentId}&receipt_number=${receiptNo}`,
      headers: BACKEND_HEADERS,
    })
      .then((res) => {
        if (res?.data?.status) resolve(res.data)
        else reject(res.data)
      })
      .catch(() => {
        reject(apiErrorResponse)
      })
  })
}

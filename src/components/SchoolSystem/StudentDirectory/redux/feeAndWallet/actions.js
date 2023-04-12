import {FEE_TAB_ACTION_TYPES} from './actionTypes'

export const setFeeCollectSliderScreen = (screen = null, data = {}) => {
  return {
    type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_TAB_STATE,
    payload: {collectFeeSlider: {isOpen: screen, ...data}},
  }
}

export const getStudentProfileFeeTabDetailsRequestAction = (studentId) => {
  return {
    type: FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_FEE_TAB_DETAILS_REQUEST,
    payload: {studentId},
  }
}

export const getStudentProfileFeePaymentHistoryAction = (payload) => {
  return {
    type: FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_PAYMENT_HISTORY_REQUEST,
    payload,
  }
}

export const setStudentProfileFeePaymentHistoryStateAction = (payload) => {
  return {
    type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_PAYMENT_HISTORY_STATE,
    payload,
  }
}

export const getStudentProfileFeeDiscountTillDateAction = (studentId) => {
  return {
    type: FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_DISCOUNT_TILL_DATE_REQUEST,
    payload: {studentId},
  }
}

export const setStudentProfileFeeDiscountTillDateStateAction = (payload) => {
  return {
    type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_DISCOUNT_TILL_DATE_STATE,
    payload,
  }
}

// WALLET
export const getStudentProfileWalletSummaryAction = (studentId) => {
  return {
    type: FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_WALLET_SUMMARY_REQUEST,
    payload: {studentId},
  }
}

export const setStudentProfileWalletSummaryAction = (payload) => {
  return {
    type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_SUMMARY_STATE,
    payload,
  }
}

export const studentProfileWalletMakeRefundAction = (payload) => {
  return {
    type: FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_WALLET_MAKE_REFUND_REQUEST,
    payload,
  }
}

export const setStudentProfileWalletRefundStateAction = (payload) => {
  return {
    type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_REFUND_STATE,
    payload,
  }
}

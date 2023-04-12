import feeDiscountsTypes from './feeDiscountsActionTypes'

export const fetchFeeStatsRequestedAction = (
  instituteId,
  academicSessionId
) => {
  return {
    type: feeDiscountsTypes.FETCH_DISCOUNTS_REQUESTED,
    payload: {
      instituteId,
      academicSessionId,
    },
  }
}

export const setDiscountStatesAction = (payload) => {
  return {
    type: feeDiscountsTypes.SET_DISCOUNT_STATES,
    payload,
  }
}

export const fetchAdHocDiscountRequestAction = () => {
  return {
    type: feeDiscountsTypes.FETCH_AD_HOC_STUDENT_LISTING,
  }
}

export const fetchAdHocDiscountListingRequestAction = () => {
  return {
    type: feeDiscountsTypes.FETCH_AD_HOC_DISCOUNT_LIST,
  }
}

export const createAdHocDiscountAction = (payload) => {
  return {
    type: feeDiscountsTypes.CREATE_AD_HOC_DISCOUNT_REASON,
    payload,
  }
}

export const downloadAdHocDiscountReceiptAction = (payload) => {
  return {
    type: feeDiscountsTypes.DOWNLOAD_AD_HOC_DICSOUNT_RECEIPT,
    payload,
  }
}

export const deleteAdHocDiscountAction = (payload) => {
  return {
    type: feeDiscountsTypes.DELETE_STUDENT_ADHOC_DISCOUNT_REQUESTED,
    payload,
  }
}

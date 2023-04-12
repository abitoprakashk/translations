import feeTransactionActionTypes from './feeTransactionActionTypes'

// Fee Transaction list
export const fetchFeeTransactionListRequestAction = (
  sessionStartDate,
  sessionEndDate,
  paymentStatus,
  paymentModes
) => {
  return {
    type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_LIST_STATS_REQUESTED,
    payload: {
      sessionStartDate,
      sessionEndDate,
      paymentStatus,
      paymentModes,
    },
  }
}

//banktranscations
export const fetchChequeTranscationListAction = (
  sessionStartDate,
  sessionEndDate,
  paymentStatus,
  paymentModes
) => {
  return {
    type: feeTransactionActionTypes.FETCH_CHEQUE_TRANSACTION_LIST_STATS_REQUESTED,
    payload: {
      sessionStartDate,
      sessionEndDate,
      paymentStatus,
      paymentModes,
    },
  }
}

export const fetchFeeTransactionListSucceededAction = (feesData) => {
  return {
    type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_LIST_SUCCEEDED,
    payload: feesData,
  }
}

export const fetachApplyFilterDataAction = (filterData) => {
  return {
    type: feeTransactionActionTypes.FETACH_APPLY_FILTER_DATA,
    payload: filterData,
  }
}
export const fetachChequeApplyFilterDataAction = (filterData) => {
  return {
    type: feeTransactionActionTypes.FETACH_CHEQUE_TRANSACTION_APPLY_FILTER_DATA,
    payload: filterData,
  }
}
// Fee Timeline Status
export const fetchFeeTimelineStatusRequestAction = (
  transactionId,
  transPaymentMode
) => {
  return {
    type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_TIMELINE_REQUESTED,
    payload: {
      transactionId,
      transPaymentMode,
    },
  }
}

export const fetchFeeTimelineStatusSuccessedAction = (feesData) => {
  return {
    type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_TIMELINE_SUCCEEDED,
    payload: feesData,
  }
}

// Fee Timeline Update Status
export const updateFeeTimelineStatusRequestAction = (
  transactionId,
  transStatus,
  sessionStartDate,
  sessionEndDate,
  transPaymentMode
) => {
  return {
    type: feeTransactionActionTypes.UPDATE_FEE_TRANSACTION_TIMELINE_STATUS_REQUESTED,
    payload: {
      transactionId,
      transStatus,
      sessionStartDate,
      sessionEndDate,
      transPaymentMode,
    },
  }
}

export const fetchFeeTransactionSearchTextFilterAction = (searchTerm) => {
  return {
    type: feeTransactionActionTypes.FETCH_FEE_TRANSACTION_SEARCH_TEXT_FILTER,
    payload: searchTerm,
  }
}

// Student Profile Slider Open

export const setSliderScreenAction = (name, data) => {
  return {
    type: feeTransactionActionTypes.SET_SLIDER_SCREEN,
    payload: {
      name,
      data,
    },
  }
}

export const refreshTranscationStatusAction = (
  sessionStartDate,
  sessionEndDate,
  paymentStatus,
  paymentModes,
  transId
) => {
  return {
    type: feeTransactionActionTypes.REFRESH_ONLINE_FEE_TRANSACTION_REQUESTED,
    payload: {
      sessionStartDate,
      sessionEndDate,
      paymentStatus,
      paymentModes,
      transId,
    },
  }
}

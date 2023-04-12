import feeCollectionActionTypes from './feeCollectionActionTypes'

export const fetchFeeStatsRequestedAction = () => {
  return {
    type: feeCollectionActionTypes.FETCH_FEE_STATS_REQUESTED,
    payload: null,
  }
}

export const collectFeesSucceededAction = (feesData) => {
  return {
    type: feeCollectionActionTypes.COLLECT_FEES_SUCCEEDED,
    payload: feesData,
  }
}

export const setCollctFeesDurationAction = (duration) => {
  return {
    type: feeCollectionActionTypes.SET_COLLECT_FEES_DURATION,
    payload: duration,
  }
}

export const collectFeesRequestedAction = (studentId, advancePayment) => {
  return {
    type: feeCollectionActionTypes.COLLECT_FEES_REQUESTED,
    payload: {
      studentId,
      advancePayment,
    },
  }
}

export const submitFeesRequestAction = (
  studentId,
  data,
  studentDuesFilters,
  metaData = {}
) => {
  return {
    type: feeCollectionActionTypes.SUBMIT_FEES_REQUESTED,
    payload: {
      studentId,
      data,
      studentDuesFilters,
      metaData,
    },
  }
}

export const setSliderScreenAction = (name, data) => {
  return {
    type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
    payload: {
      name,
      data,
    },
  }
}

export const hideSliderScreenAction = () => {
  return {
    type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
    payload: null,
  }
}

export const setStudentDuesFiltersAction = (filterData) => {
  return {
    type: feeCollectionActionTypes.SET_STUDENT_DUES_FILTERS,
    payload: filterData,
  }
}

export const feeReminderRequestedAction = (studentIds) => {
  return {
    type: feeCollectionActionTypes.FEE_REMINDER_REQUESTED,
    payload: {
      studentIds,
    },
  }
}

export const studentDuesTextFilterAction = (searchTerm) => {
  return {
    type: feeCollectionActionTypes.STUDENT_DUES_TEXT_FILTER,
    payload: searchTerm,
  }
}

export const studentDuesRequestedAction = (
  classIds,
  sectionIds,
  paymentStatus
) => {
  return {
    type: feeCollectionActionTypes.STUDENT_DUES_REQUESTED,
    payload: {
      classIds,
      sectionIds,
      paymentStatus,
    },
  }
}

export const sectionsRequestedAction = (classId) => {
  return {
    type: feeCollectionActionTypes.SECTIONS_REQUESTED,
    payload: {
      classId,
    },
  }
}

export const feeHistoryRequestedAction = (studentId) => {
  return {
    type: feeCollectionActionTypes.FEE_HISTORY_REQUESTED,
    payload: {
      studentId,
    },
  }
}

export const searchResultsRequestedAction = (searchTerm) => {
  return {
    type: feeCollectionActionTypes.SEARCH_RESULTS_REQUESTED,
    payload: {
      searchTerm,
    },
  }
}

export const paymentGateWaySetupActions = (instituteId) => {
  return {
    type: feeCollectionActionTypes.PAYMENT_GATEWAY_SETUP_REQUESTED,
    payload: instituteId,
  }
}

export const multiplePaymentGatewayCreate = (formData) => {
  return {
    type: feeCollectionActionTypes.MULTIPLE_PAYMENT_GATEWAY_CREATE_REQUEST,
    payload: formData,
  }
}

export const feeHistoryTabFalseActions = (action) => {
  return {
    type: feeCollectionActionTypes.REDIRECT_TO_HISTORY_FEE_TAB,
    payload: action,
  }
}
export const paymentGatewayFalseActions = (action) => {
  return {
    type: feeCollectionActionTypes.REDIRECT_TO_PAYMENTGATEWAY_SCREEN,
    payload: action,
  }
}

export const feeSettingsUpdate = (data) => {
  return {
    type: feeCollectionActionTypes.FETCH_FEE_SETTINGS_UPDATE,
    payload: data,
  }
}

export const fetchStudentIdsForFeeReminderAction = () => {
  return {
    type: feeCollectionActionTypes.FETCH_STUDENT_IDS_FOR_FEE_REMINDER_REQUESTED,
  }
}

export const setStudentIdsForFeeReminder = (payload) => {
  return {
    type: feeCollectionActionTypes.SET_STUDENT_IDS_FOR_FEE_REMINDER,
    payload,
  }
}

export const setRecordPaymentDetailsAction = (payload) => {
  return {
    type: feeCollectionActionTypes.SET_RECORD_PAYMENT_DETAILS,
    payload,
  }
}

export const setIsTransactionZeroPopupAlreadyShownAction = (payload) => {
  return {
    type: feeCollectionActionTypes.SET_IS_TRANSACTION_POPUP_ALREADY_SHOWN,
    payload,
  }
}

export const feeCollectBackDatedPaymentTaskAcknowledgeRequest = (payload) => {
  return {
    type: feeCollectionActionTypes.COLLECT_BACK_DATED_PAYMENT_TASK_ACKNOWLEDGE_REQUEST,
    payload,
  }
}

export const feeCollectBackDatedPaymentTaskRequest = (payload) => {
  return {
    type: feeCollectionActionTypes.COLLECT_BACK_DATED_PAYMENT_TASK_REQUEST,
    payload,
  }
}

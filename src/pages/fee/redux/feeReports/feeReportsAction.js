import {feeReportActionTypes} from './feeReportsActiontype'

export const setFeeReportStudentClassSectionAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_FEE_REPORTS_STUDENT_CLASS_SECTIONS,
    payload,
  }
}
export const setFeeReportFeeTypeAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_FEE_REPORTS_FEE_TYPES,
    payload,
  }
}

export const setFeeReportClassesAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_FEE_REPORTS_CLASSES,
    payload,
  }
}

export const setDateRangeAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_DATE_RANGE,
    payload,
  }
}

export const setFeeReportDepartmentsction = (payload) => {
  return {
    type: feeReportActionTypes.SET_FEE_REPORTS_DEPARTMENTS,
    payload,
  }
}

export const resetFeeReportStatesAction = () => {
  return {
    type: feeReportActionTypes.RESET_FEE_REPORTS_STATES,
  }
}

export const setIsPendingChequeDataIncludedAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_IS_PENDING_CHEQUE_DATA_INCLUDED,
    payload,
  }
}

export const fetchSavedReportsAction = () => {
  return {
    type: feeReportActionTypes.FETCH_SAVED_REPORTS,
  }
}

export const setReportTemplateIdAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_REPORT_TEMPLATE_ID,
    payload,
  }
}

export const downloadReportAction = (payload) => {
  return {
    type: feeReportActionTypes.DOWNLOAD_REPORT,
    payload,
  }
}

export const fetchReportData = (payload) => {
  return {
    type: feeReportActionTypes.FETCH_REPORT_DATA,
    payload,
  }
}

export const setHierarchyIdsAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_HIERARCHY_IDS,
    payload,
  }
}

export const setMasterCategoryIdsAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_MASTER_CATEGORY_IDS,
    payload,
  }
}

export const setChequeStatus = (payload) => {
  return {
    type: feeReportActionTypes.SET_CHEQUE_STATUS,
    payload,
  }
}

export const setPaymentModes = (payload) => {
  return {
    type: feeReportActionTypes.SET_PAYMENT_MODES,
    payload,
  }
}

export const setFeeReports = (payload) => {
  return {
    type: feeReportActionTypes.SET_FEE_REPORTS_STATES,
    payload,
  }
}

export const fetchInstituteFeeTypesAction = () => {
  return {
    type: feeReportActionTypes.FETCH_INSTITUTE_FEE_TYPES,
  }
}

export const setInstituteFeeTypesAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_INSTITUTE_FEE_TYPES,
    payload,
  }
}

export const fetchInstalmentDateTimestampAction = () => {
  return {
    type: feeReportActionTypes.FETCH_INSTALMENT_TIMESTAMP,
  }
}

export const fetchFeeDataAction = (payload) => {
  return {
    type: feeReportActionTypes.FETCH_FEE_DATA,
    payload,
  }
}

export const fetchFeeChequeCountAction = (payload) => {
  return {
    type: feeReportActionTypes.FETCH_CHEQUE_COUNT,
    payload,
  }
}

export const fetchFeeDataStartAction = (payload) => {
  return {
    type: feeReportActionTypes.FETCH_FEE_DATA_START,
    payload,
  }
}

export const fetchFeeDataDefaultersAction = (payload) => {
  return {
    type: feeReportActionTypes.FETCH_FEE_DATA_DEFAULTERS,
    payload,
  }
}

export const fetchTimeStampFeeDataAction = (payload) => {
  return {
    type: feeReportActionTypes.FETCH_TIMESTAMP_DATA,
    payload,
  }
}

export const setInstalmentDateTimestampListAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_INSTALMENT_TIMESTAMP_LIST,
    payload,
  }
}

export const setInstalmentDateTimestampAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_INSTALMENT_TIMESTAMP,
    payload,
  }
}

export const setIsReportDownloadModalOpenAction = (payload) => {
  return {
    type: feeReportActionTypes.SET_IS_REPORT_DOWNLOAD_MODAL_OPEN,
    payload,
  }
}

import {DateTime} from 'luxon'
import {createTransducer} from '../../../../redux/helpers'
import {feeReportActionTypes} from './feeReportsActiontype'

const mockSavedReports = []
const dateRangeDefVal = {
  startDate: DateTime.now().minus({months: 1}).toFormat('yyyy-MM-dd'),
  endDate: DateTime.now().toFormat('yyyy-MM-dd'),
}

const INITIAL_STATE = {
  loader: false,
  reportTemplateId: '',
  feeTypeState: [],
  classes: [],
  departments: [],
  dateRange: dateRangeDefVal,
  paymentModes: [],
  isIncludePendingCheck: false,
  months: [],
  sections: [],
  isPendingChequeDataIncluded: false,
  savedReportsList: mockSavedReports,
  hierarchyIds: [],
  masterCategoryIds: [],
  feeTypeList: [],
  instalmentTimestampList: [],
  selectedInstalmentTimestamp: [],
  isReportDownloadModalOpen: false,
  isReportDownloading: false,
  chequeStatus: [],
  downloadReportData: null,
  feeReportData: [],
  feeTypeTimestampData: [],
  feeReportDataStart: [],
  feeReportDataDefaulters: [],
  chequeCount: 0,
}

const setLoaderReducer = (state, {payload}) => {
  return {
    ...state,
    loader: payload,
  }
}

const setFeeReportsStates = (state, {payload}) => {
  return {
    ...state,
    ...payload,
  }
}

const setFeeReportsDepartmentsReducer = (state, {payload}) => {
  return {
    ...state,
    departments: payload,
  }
}

const setFeeReportsSectionsReducer = (state, {payload}) => {
  return {
    ...state,
    sections: payload,
  }
}

const setFeeReportsClassesReducer = (state, {payload}) => {
  return {
    ...state,
    classes: payload,
  }
}

const setFeeReportsMonthesReducer = (state, {payload}) => {
  return {
    ...state,
    months: payload,
  }
}

const setIsPendingCheckDataIncludedReducer = (state, {payload}) => {
  return {
    ...state,
    isPendingChequeDataIncluded: payload,
  }
}

const setFeeTypeReducer = (state, {payload}) => {
  return {
    ...state,
    feeTypeState: payload,
  }
}

const setPaymentModesReducer = (state, {payload}) => {
  return {
    ...state,
    paymentModes: payload,
  }
}

const setDaterangeReducer = (state, {payload}) => {
  return {
    ...state,
    dateRange: {...state.dateRange, ...payload},
  }
}

const setReportTemplateIdReducer = (state, {payload}) => {
  return {
    ...state,
    reportTemplateId: payload,
  }
}

const setHierarchyIdsReducer = (state, {payload}) => {
  return {
    ...state,
    hierarchyIds: payload,
  }
}

const setMasterCategoryIdsReducer = (state, {payload}) => {
  return {
    ...state,
    masterCategoryIds: payload,
  }
}

const setFeeTypeListReducer = (state, {payload}) => {
  return {
    ...state,
    feeTypeList: payload,
  }
}

const setInstalmentDateTimestampListReducer = (state, {payload}) => {
  return {
    ...state,
    instalmentTimestampList: payload,
  }
}

const setInstalmentDateTimestampReducer = (state, {payload}) => {
  return {
    ...state,
    selectedInstalmentTimestamp: payload,
  }
}

const setIsReportDownloadModalOpenReducer = (state, {payload}) => {
  return {
    ...state,
    isReportDownloadModalOpen: payload,
  }
}

const setChequeStatusReducer = (state, {payload}) => {
  return {
    ...state,
    chequeStatus: payload,
  }
}

const setDownloadReportDataReducer = (state, {payload}) => {
  return {
    ...state,
    downloadReportData: payload,
  }
}

const setFeeDataReducer = (state, {payload}) => {
  return {
    ...state,
    feeReportData: payload,
  }
}

const setFeeDataStartReducer = (state, {payload}) => {
  return {
    ...state,
    feeReportDataStart: payload,
  }
}

const setFeeDataDefaultersReducer = (state, {payload}) => {
  return {
    ...state,
    feeReportDataDefaulters: payload,
  }
}

const setFeeTypeTimestampDataReducer = (state, {payload}) => {
  return {
    ...state,
    feeTypeTimestampData: payload,
  }
}

const setFeeChqueCountReducer = (state, {payload}) => {
  return {
    ...state,
    chequeCount: payload?.number,
  }
}

const resetFeeReportsStatesReducer = (state) => {
  return {
    ...state,
    loader: false,
    reportTemplateId: '',
    feeTypeState: [],
    classes: [],
    departments: [],
    dateRange: dateRangeDefVal,
    paymentModes: [],
    isIncludePendingCheck: false,
    months: [],
    sections: [],
    isPendingChequeDataIncluded: false,
    savedReportsList: mockSavedReports,
    hierarchyIds: [],
    masterCategoryIds: [],
    selectedInstalmentTimestamp: [],
    // isReportDownloadModalOpen: false,
    isReportDownloading: false,
    chequeStatus: [],
    downloadReportData: null,
  }
}

const feeReportsReducer = {
  [feeReportActionTypes.SET_FEE_REPORTS_LOADER]: setLoaderReducer,
  [feeReportActionTypes.SET_FEE_REPORTS_STATES]: setFeeReportsStates,
  [feeReportActionTypes.SET_FEE_REPORTS_DEPARTMENTS]:
    setFeeReportsDepartmentsReducer,
  [feeReportActionTypes.SET_FEE_REPORTS_STUDENT_CLASS_SECTIONS]:
    setFeeReportsSectionsReducer,
  [feeReportActionTypes.SET_FEE_REPORTS_CLASSES]: setFeeReportsClassesReducer,
  [feeReportActionTypes.SET_FEE_REPORTS_MONTHS]: setFeeReportsMonthesReducer,
  [feeReportActionTypes.RESET_FEE_REPORTS_STATES]: resetFeeReportsStatesReducer,
  [feeReportActionTypes.SET_IS_PENDING_CHEQUE_DATA_INCLUDED]:
    setIsPendingCheckDataIncludedReducer,
  [feeReportActionTypes.SET_FEE_TYPE]: setFeeTypeReducer,
  [feeReportActionTypes.SET_PAYMENT_MODES]: setPaymentModesReducer,
  [feeReportActionTypes.SET_DATE_RANGE]: setDaterangeReducer,
  [feeReportActionTypes.SET_REPORT_TEMPLATE_ID]: setReportTemplateIdReducer,
  [feeReportActionTypes.SET_HIERARCHY_IDS]: setHierarchyIdsReducer,
  [feeReportActionTypes.SET_MASTER_CATEGORY_IDS]: setMasterCategoryIdsReducer,
  [feeReportActionTypes.SET_INSTITUTE_FEE_TYPES]: setFeeTypeListReducer,
  [feeReportActionTypes.SET_INSTALMENT_TIMESTAMP_LIST]:
    setInstalmentDateTimestampListReducer,
  [feeReportActionTypes.SET_INSTALMENT_TIMESTAMP]:
    setInstalmentDateTimestampReducer,
  [feeReportActionTypes.SET_IS_REPORT_DOWNLOAD_MODAL_OPEN]:
    setIsReportDownloadModalOpenReducer,
  [feeReportActionTypes.SET_CHEQUE_STATUS]: setChequeStatusReducer,
  [feeReportActionTypes.SET_DOWNLOAD_REPORT_DATA]: setDownloadReportDataReducer,
  [feeReportActionTypes.SET_FEE_DATA]: setFeeDataReducer,
  [feeReportActionTypes.SET_FEE_DATA_DEFAULTERS]: setFeeDataDefaultersReducer,
  [feeReportActionTypes.SET_FEE_DATA_START]: setFeeDataStartReducer,
  [feeReportActionTypes.SET_CHEQUE_COUNT]: setFeeChqueCountReducer,
  [feeReportActionTypes.FETCH_TIMESTAMP_DATA]: setFeeTypeTimestampDataReducer,
}

export default createTransducer(feeReportsReducer, INITIAL_STATE)

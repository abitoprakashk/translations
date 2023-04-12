// Reducer with initial state
import {GENERIC_ERROR_MESSAGE} from '../../../constants/common.constants'
import {createTransducer} from '../../../redux/helpers'
import feeCollectionActions from './feeCollectionActionTypes'
export const DEFAULT_COLLECT_BACKDATED_PAYMENT_STATES = {
  buttonLoader: false,
  invalidDataStats: null,
  invalidData: null,
  successfullyUpdated: false,
  successUpdateCount: 0,
  isProccessCompleted: false,
  proccessTaskId: null,
  collectionModeOnResponse: null,
}

const INITIAL_STATE = {
  stats: [],
  statsLoading: false,
  stateErrMsg: '',
  searchResults: [],
  searchResultsLoading: false,
  searchResultErrMsg: '',
  studentDues: {
    discount_amount: 0,
    due_amount: 0,
    fine_amount: 0,
    paid_amount: 0,
    payable_amount: 0,
    pending_amount: 0,
    students: [],
  },
  studentDuesLoading: false,
  studentDueErrMsg: '',
  studentDuesFilters: {
    classIds: [],
    sectionIds: null,
    paymentStatus: 'ALL',
  },
  feeHistory: null,
  feeHistoryLoading: false,
  feeHistoryErrMsg: '',
  sliderScreen: null,
  sliderData: null,
  selectedStudent: null,
  feesReminderLoading: false,
  feesReminderErrorMsg: '',
  collectFees: null,
  collectFeesLoading: null,
  collectFeesDuration: 'current',
  submitFees: null,
  submitFeesLoading: null,
  paymentGatewaySetup: null,
  paymentGatewaySetupLoading: null,
  feeHistortyTab: false,
  paymentGatewayErrorMsg: '',
  multiplePaymentgatewayLoading: null,
  multiplePaymentgateway: null,
  multiplePaymentGatewayErrorMessage: '',
  redirectToPaymentGateway: false,
  feeSettingLoading: null,
  feesettingData: null,
  feeSettingsErrorMsg: null,
  studentIdsForFeeReminder: {
    studentIds: [],
    showLoader: false,
    errorMsg: '',
  },
  recordPaymentDetails: {
    isPopupOpen: false,
    receiptUrl: null,
    studentId: '',
    name: '',
    amount: 0,
    classroom: '',
    paymentMode: '',
    buttonLoader: false,
  },
  isTransactionZeroPopupAlreadyShown: false,
  collectBackdatedPayment: {...DEFAULT_COLLECT_BACKDATED_PAYMENT_STATES},
}

const feeStatsRequestedReducer = (state) => {
  return {
    ...state,
    statsLoading: true,
  }
}

const feeStatsSuccessReducer = (state, action) => {
  return {
    ...state,
    statsLoading: false,
    stats: action.payload,
    feeHistortyTab: false,
    stateErrMsg: '',
    studentDuesFilters: INITIAL_STATE.studentDuesFilters,
  }
}

const feeStatsErrorReducer = (state, action) => {
  return {
    ...state,
    stateErrMsg: action.payload ?? GENERIC_ERROR_MESSAGE,
    statsLoading: false,
  }
}

const searchResultsRequestedReducer = (state) => {
  return {
    ...state,
    searchResultsLoading: true,
  }
}

const searchResultsSuccessReducer = (state, action) => {
  return {
    ...state,
    searchResultsLoading: false,
    searchResultErrMsg: '',
    searchResults: action.payload,
  }
}

const searchResultsErrorReducer = (state, action) => {
  return {
    ...state,
    searchResultErrMsg: action.payload ?? GENERIC_ERROR_MESSAGE,
    searchResultsLoading: false,
  }
}

const studentDuesRequestedReducer = (state) => {
  return {
    ...state,
    studentDuesLoading: true,
  }
}

const studentDuesSuccessReducer = (state, action) => {
  return {
    ...state,
    studentDuesLoading: false,
    studentDues: action.payload,
    studentDueErrMsg: '',
  }
}

const studentDuesErrorReducer = (state, action) => {
  return {
    ...state,
    studentDueErrMsg: action.payload ?? GENERIC_ERROR_MESSAGE,
    studentDuesLoading: false,
  }
}

const downloadDemandLetterRequestedReducer = (state) => {
  return {
    ...state,
    studentDuesLoading: true,
  }
}

const downloadDemandLetterSuccessReducer = (state) => {
  return {
    ...state,
    studentDuesLoading: false,
  }
}

const downloadDemandLetterErrorReducer = (state) => {
  return {
    ...state,
    studentDuesLoading: false,
  }
}

const setStudentDuesFilterReducer = (state, action) => {
  return {
    ...state,
    studentDuesFilters: action.payload,
  }
}

const studentDuesTextFilterReducer = (state, action) => {
  const searchTerm = action.payload
  state.studentDues.forEach((dues) => {
    dues.hidden =
      dues.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
      dues.phoneNumber.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1
  })
  return state
}

const feesReminderRequestedReducer = (state) => {
  return {
    ...state,
    feesReminderLoading: true,
  }
}

const feesReminderSuccessReducer = (state) => {
  return {
    ...state,
    feesReminderErrorMsg: '',
    feesReminderLoading: false,
  }
}

const feesReminderErrorReducer = (state, action) => {
  return {
    ...state,
    feesReminderErrorMsg: action.payload ?? GENERIC_ERROR_MESSAGE,
    feesReminderLoading: false,
  }
}

const feeHistoryRequestedReducer = (state) => {
  return {
    ...state,
    feeHistoryLoading: true,
  }
}

const feeHistorySuccessReducer = (state, action) => {
  return {
    ...state,
    feeHistoryLoading: false,
    feeHistoryErrMsg: '',
    feeHistory: action.payload,
  }
}

const feeHistoryErrorReducer = (state, action) => {
  return {
    ...state,
    feeHistoryErrMsg: action.payload ?? GENERIC_ERROR_MESSAGE,
    feeHistoryLoading: false,
  }
}

const setSliderReducer = (state, action) => {
  return {
    ...state,
    sliderScreen: action.payload && action.payload.name,
    sliderData: action.payload && action.payload.data,
  }
}

const setSelectedStudentReducer = (state, action) => {
  return {
    ...state,
    selectedStudent: action.payload,
  }
}

const collectFeesRequestedReducer = (state) => {
  return {
    ...state,
    collectFeesLoading: true,
  }
}

const collectFeesSuccessReducer = (state, action) => {
  return {
    ...state,
    collectFees: action.payload,
    collectFeesLoading: false,
  }
}

const collectFeesErrorReducer = (state) => {
  return {
    ...state,
    collectFeesLoading: false,
  }
}

const setCollectFeesDurationReducer = (state, action) => {
  return {
    ...state,
    collectFeesDuration: action.payload,
  }
}

const submitFeesRequestedReducer = (state) => {
  return {
    ...state,
    submitFeesLoading: true,
  }
}

const submitFeesSuccessReducer = (state, action) => {
  return {
    ...state,
    submitFeesLoading: false,
    submitFees: action.payload,
  }
}

const submitFeesErrorReducer = (state) => {
  return {
    ...state,
    submitFeesLoading: false,
  }
}

const paymentGatewaystatusSuccessReducer = (state, action) => {
  return {
    ...state,
    paymentGatewaySetupLoading: false,
    paymentGatewaySetup: action.payload,
  }
}

const paymentGatewayErrorReducer = (state, action) => {
  return {
    ...state,
    paymentGatewayErrorMsg: action.payload ?? GENERIC_ERROR_MESSAGE,
    paymentGatewaySetupLoading: false,
  }
}

const paymentGatewaystatusRequestReducer = (state) => {
  return {
    ...state,
    multiplePaymentGatewayErrorMessage: '',
    paymentGatewaySetupLoading: true,
  }
}

const redirectFeeHistoryReducer = (state, action) => {
  return {
    ...state,
    feeHistortyTab: action.payload,
  }
}

const multiplepaymentgatewayRequestReducer = (state) => {
  return {
    ...state,
    multiplePaymentGatewayErrorMessage: '',
    multiplePaymentgatewayLoading: true,
  }
}

const multiplepaymentgatewaySuccessReducer = (state, action) => {
  return {
    ...state,
    multiplePaymentgatewayLoading: false,
    multiplePaymentgateway: action.payload,
    multiplePaymentGatewayErrorMessage: '',
    redirectToPaymentGateway: false,
  }
}
const multiplepaymentgatewayErrorReducer = (state, action) => {
  return {
    ...state,
    multiplePaymentGatewayErrorMessage: action.payload ?? GENERIC_ERROR_MESSAGE,
    multiplePaymentgatewayLoading: false,
  }
}

const paymentGatewayRedirectReducer = (state, action) => {
  return {
    ...state,
    redirectToPaymentGateway: action.payload,
  }
}

const feeSettingUpdateRequestReducer = (state) => {
  return {
    ...state,
    feeSettingLoading: true,
  }
}

const feeSettingUpdateSucess = (state, action) => {
  return {
    ...state,
    feeSettingLoading: false,
    feesettingData: action.payload,
  }
}

const feeSettingUpdateFail = (state, action) => {
  return {
    ...state,
    feeSettingsErrorMsg: action.payload ?? GENERIC_ERROR_MESSAGE,
    feeSettingLoading: false,
  }
}
const setStudentIdsForFeeReminderReducer = (state, action) => {
  return {
    ...state,
    studentIdsForFeeReminder: {
      ...state.studentIdsForFeeReminder,
      ...action.payload,
    },
  }
}

const recordPaymentDetailsReducer = (state, {payload}) => {
  return {
    ...state,
    recordPaymentDetails: {...state.recordPaymentDetails, ...payload},
  }
}

const setIsTransactionZeroPopupAlreadyShownReducer = (state, {payload}) => {
  return {
    ...state,
    isTransactionZeroPopupAlreadyShown: payload,
  }
}

const setCollectbackdatedPaymentStatesReducer = (state, {payload}) => {
  return {
    ...state,
    collectBackdatedPayment: {...state.collectBackdatedPayment, ...payload},
  }
}

const feeCollectionReducer = {
  [feeCollectionActions.FETCH_FEE_STATS_REQUESTED]: feeStatsRequestedReducer,
  [feeCollectionActions.FETCH_FEE_STATS_SUCCEEDED]: feeStatsSuccessReducer,
  [feeCollectionActions.FETCH_FEE_STATS_FAILED]: feeStatsErrorReducer,
  [feeCollectionActions.SEARCH_RESULTS_REQUESTED]:
    searchResultsRequestedReducer,
  [feeCollectionActions.SEARCH_RESULTS_SUCCEEDED]: searchResultsSuccessReducer,
  [feeCollectionActions.SEARCH_RESULTS_FAILED]: searchResultsErrorReducer,
  [feeCollectionActions.STUDENT_DUES_REQUESTED]: studentDuesRequestedReducer,
  [feeCollectionActions.STUDENT_DUES_SUCCEEDED]: studentDuesSuccessReducer,
  [feeCollectionActions.STUDENT_DUES_FAILED]: studentDuesErrorReducer,
  [feeCollectionActions.DOWNLOAD_DEMAND_LETTER_REQUESTED]:
    downloadDemandLetterRequestedReducer,
  [feeCollectionActions.DOWNLOAD_DEMAND_LETTER_SUCCEEDED]:
    downloadDemandLetterSuccessReducer,
  [feeCollectionActions.DOWNLOAD_DEMAND_LETTER_FAILED]:
    downloadDemandLetterErrorReducer,
  [feeCollectionActions.FEE_REMINDER_REQUESTED]: feesReminderRequestedReducer,
  [feeCollectionActions.FEE_REMINDER_SUCCEEDED]: feesReminderSuccessReducer,
  [feeCollectionActions.FEE_REMINDER_FAILED]: feesReminderErrorReducer,
  [feeCollectionActions.SET_STUDENT_DUES_FILTERS]: setStudentDuesFilterReducer,
  [feeCollectionActions.STUDENT_DUES_TEXT_FILTER]: studentDuesTextFilterReducer,
  [feeCollectionActions.FEE_HISTORY_REQUESTED]: feeHistoryRequestedReducer,
  [feeCollectionActions.FEE_HISTORY_SUCCEEDED]: feeHistorySuccessReducer,
  [feeCollectionActions.FEE_HISTORY_FAILED]: feeHistoryErrorReducer,
  [feeCollectionActions.SET_SLIDER_SCREEN]: setSliderReducer,
  [feeCollectionActions.SET_SELECTED_STUDENT]: setSelectedStudentReducer,
  [feeCollectionActions.COLLECT_FEES_REQUESTED]: collectFeesRequestedReducer,
  [feeCollectionActions.COLLECT_FEES_SUCCEEDED]: collectFeesSuccessReducer,
  [feeCollectionActions.COLLECT_FEES_FAILED]: collectFeesErrorReducer,
  [feeCollectionActions.SET_COLLECT_FEES_DURATION]:
    setCollectFeesDurationReducer,
  [feeCollectionActions.SUBMIT_FEES_REQUESTED]: submitFeesRequestedReducer,
  [feeCollectionActions.SUBMIT_FEES_SUCCEEDED]: submitFeesSuccessReducer,
  [feeCollectionActions.SUBMIT_FEES_FAILED]: submitFeesErrorReducer,
  [feeCollectionActions.PAYMENT_GATEWAY_SETUP_REQUESTED]:
    paymentGatewaystatusRequestReducer,
  [feeCollectionActions.PAYMENT_GATEWAY_SETUP_SUCCEEDED]:
    paymentGatewaystatusSuccessReducer,
  [feeCollectionActions.PAYMENT_GATEWAY_SETUP_FAILED]:
    paymentGatewayErrorReducer,
  [feeCollectionActions.REDIRECT_TO_HISTORY_FEE_TAB]: redirectFeeHistoryReducer,
  [feeCollectionActions.MULTIPLE_PAYMENT_GATEWAY_CREATE_REQUEST]:
    multiplepaymentgatewayRequestReducer,
  [feeCollectionActions.MULTIPLE_PAYMENT_GATEWAY_CREATE_SUCCESS]:
    multiplepaymentgatewaySuccessReducer,
  [feeCollectionActions.MULTIPLE_PAYMENT_GATEWAY_CREATE_FAILED]:
    multiplepaymentgatewayErrorReducer,
  [feeCollectionActions.REDIRECT_TO_PAYMENTGATEWAY_SCREEN]:
    paymentGatewayRedirectReducer,
  [feeCollectionActions.FETCH_FEE_SETTINGS_UPDATE]:
    feeSettingUpdateRequestReducer,
  [feeCollectionActions.FETCH_FEE_SETTINGS_SUCCEEDED]: feeSettingUpdateSucess,
  [feeCollectionActions.FETCH_FEE_SETTINGS_FAIL]: feeSettingUpdateFail,
  [feeCollectionActions.SET_STUDENT_IDS_FOR_FEE_REMINDER]:
    setStudentIdsForFeeReminderReducer,
  [feeCollectionActions.SET_RECORD_PAYMENT_DETAILS]:
    recordPaymentDetailsReducer,
  [feeCollectionActions.SET_IS_TRANSACTION_POPUP_ALREADY_SHOWN]:
    setIsTransactionZeroPopupAlreadyShownReducer,
  [feeCollectionActions.SET_COLLECT_BACKDATED_PAYMENT_STATES]:
    setCollectbackdatedPaymentStatesReducer,
}

export default createTransducer(feeCollectionReducer, INITIAL_STATE)

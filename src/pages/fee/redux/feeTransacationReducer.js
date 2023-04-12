// Reducer with initial state
import {GENERIC_ERROR_MESSAGE} from '../../../constants/common.constants'
import {createTransducer} from '../../../redux/helpers'
import {
  defaultBankTransStatus,
  defaultPaymentStatus,
} from '../components/FeeTransaction/FeeTransactionConstants'
import feeTransactionActionTypes from './feeTransactionActionTypes'

const INITIAL_STATE = {
  stats: [],

  feeTransacationlistData: [],
  feeTransacationlistDataLoading: false,

  chequeTransacationlistData: [],
  chequeTransacationlistDataLoading: false,

  feeTimelineStatusData: [],
  feeTimelineStatusDataLoading: false,

  feeTimelineUpdateStatusData: [],
  feeTimelineUpdateStatusDataLoading: false,

  feeTransacationlistDataFilters: {
    paymentStatus: defaultPaymentStatus,
    paymentModes: [],
  },

  bankTransacationlistDataFilters: {
    paymentStatus: defaultBankTransStatus,
    paymentModes: [],
  },

  sliderScreen: null,
  sliderData: null,

  feeTransacationListErrMsg: '',
  chequeTransacationListErrMsg: '',
  feeTimelineErrMsg: '',

  onlineTransactionStatus: '',
  onlineTransactionStatusSuccess: '',
  onlineTransactionStatusLoading: '',
}

// Fee Transaction List Data Request
const feeTransacationListStatsRequestedReducer = (state) => {
  return {
    ...state,
    feeTransacationlistDataLoading: true,
  }
}

const feeTransacationSuccessStatsRequestedReducer = (state, action) => {
  return {
    ...state,
    feeTransacationlistDataLoading: false,
    feeTransacationListErrMsg: '',
    feeTransacationlistData: action.payload,
  }
}

const feeTransacationSuccessStatsErrorReducer = (state, action) => {
  return {
    ...state,
    feeTransacationListErrMsg: action.payload ?? GENERIC_ERROR_MESSAGE,
    feeTransacationlistDataLoading: false,
  }
}

const feeFeeTrasactionFilterDataReducar = (state, action) => {
  return {
    ...state,
    feeTransacationlistDataFilters: action.payload,
  }
}

const chequeTransacationSuccessStatsRequestedReducer = (state, action) => {
  return {
    ...state,
    chequeTransacationlistDataLoading: false,
    chequeTransacationListErrMsg: '',
    chequeTransacationlistData: action.payload,
  }
}

const chequeTransacationSuccessStatsErrorReducer = (state, action) => {
  return {
    ...state,
    chequeTransacationListErrMsg: action.payload ?? GENERIC_ERROR_MESSAGE,
    chequeTransacationlistDataLoading: false,
  }
}

const chequeTrasactionFilterDataReducar = (state, action) => {
  return {
    ...state,
    bankTransacationlistDataFilters: action.payload,
  }
}

const feeTransacationSearchTextFilterReducer = (state, action) => {
  const searchTerm = action.payload
  state.feeTransacationlistData.forEach((feesTransacation) => {
    feesTransacation.hidden =
      feesTransacation.student_name
        .toLowerCase()
        .indexOf(searchTerm.toLowerCase()) === -1 &&
      feesTransacation.phone.toLowerCase().indexOf(searchTerm.toLowerCase()) ===
        -1
    // feesTransacation.transaction_id
    //   ? feesTransacation.transaction_id
    //       .toLowerCase()
    //       .indexOf(searchTerm.toLowerCase()) === -1
    //   : ''
    // feesTransacation.id.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1
  })
  return state
}

// Fee Timeline Data Request
const feeTimelineStatusRequestedReducer = (state) => {
  return {
    ...state,
    feeTimelineStatusDataLoading: true,
  }
}

const feeTimelineStatusSuccessedReducer = (state, action) => {
  return {
    ...state,
    feeTimelineStatusDataLoading: false,
    feeTimelineErrMsg: '',
    feeTimelineStatusData: action.payload,
  }
}

const feeTimelineStatusErrorReducer = (state, action) => {
  return {
    ...state,
    feeTimelineErrMsg: action.payload ?? GENERIC_ERROR_MESSAGE,
    feeTimelineStatusDataLoading: false,
  }
}

// Transaction receipt download
const receiptDownloadRequestedReducer = (state) => {
  return {
    ...state,
    feeTransacationlistDataLoading: true,
  }
}

const receiptDownloadSuccessReducer = (state) => {
  return {
    ...state,
    feeTransacationlistDataLoading: false,
  }
}

const receiptDownloadErrorReducer = (state) => {
  return {
    ...state,
    feeTransacationlistDataLoading: false,
  }
}

// Revoke Transaction
const revokeTransactionRequestedReducer = (state) => {
  return {
    ...state,
    feeTransacationlistDataLoading: true,
  }
}

const revokeTransactionSuccessReducer = (state) => {
  return {
    ...state,
    feeTransacationlistDataLoading: false,
  }
}

const revokeTransactionErrorReducer = (state) => {
  return {
    ...state,
    feeTransacationlistDataLoading: false,
  }
}

// cheque ddRevoke Transaction
const revokeBankTransactionRequestedReducer = (state) => {
  return {
    ...state,
    chequeTransacationlistDataLoading: true,
  }
}

const revokeBankTransactionSuccessReducer = (state) => {
  return {
    ...state,
    chequeTransacationlistDataLoading: false,
  }
}

const revokeBankTransactionErrorReducer = (state) => {
  return {
    ...state,
    chequeTransacationlistDataLoading: false,
  }
}

// Fee Timeline Update Status
const feeTimelineUpdateStatusRequestedReducer = (state) => {
  return {
    ...state,
    feeTimelineUpdateStatusDataLoading: true,
  }
}

const feeTimelineUpdateStatusSuccessedReducer = (state, action) => {
  return {
    ...state,
    feeTimelineUpdateStatusDataLoading: false,
    feeTimelineUpdateStatusData: action.payload,
  }
}

const feeTimelineUpdateStatusErrorReducer = (state) => {
  return {
    ...state,
    feeTimelineUpdateStatusDataLoading: false,
  }
}

const setSliderReducer = (state, action) => {
  return {
    ...state,
    sliderScreen: action.payload && action.payload.name,
    sliderData: action.payload && action.payload.data,
  }
}

const onlineTransactionStatusRequestedReducer = (state) => {
  return {
    ...state,
    onlineTransactionStatusLoading: true,
  }
}

const onlineTransactionStatusSuccessedReducer = (state, action) => {
  return {
    ...state,
    onlineTransactionStatusLoading: false,
    onlineTransactionStatus: action,
  }
}

const onlineTransactionStatusErrorReducer = (state) => {
  return {
    ...state,
    onlineTransactionStatusLoading: true,
  }
}

const feeTransacationReducer = {
  // Fee Transaction list
  [feeTransactionActionTypes.FETCH_FEE_TRANSACTION_LIST_STATS_REQUESTED]:
    feeTransacationListStatsRequestedReducer,
  [feeTransactionActionTypes.FETCH_FEE_TRANSACTION_LIST_SUCCEEDED]:
    feeTransacationSuccessStatsRequestedReducer,
  [feeTransactionActionTypes.FETCH_FEE_TRANSACTION_LIST_STATS_FAILED]:
    feeTransacationSuccessStatsErrorReducer,
  [feeTransactionActionTypes.FETACH_APPLY_FILTER_DATA]:
    feeFeeTrasactionFilterDataReducar,

  [feeTransactionActionTypes.FETCH_FEE_TRANSACTION_SEARCH_TEXT_FILTER]:
    feeTransacationSearchTextFilterReducer,

  // Fee Timeline data get
  [feeTransactionActionTypes.FETCH_FEE_TRANSACTION_TIMELINE_REQUESTED]:
    feeTimelineStatusRequestedReducer,
  [feeTransactionActionTypes.FETCH_FEE_TRANSACTION_TIMELINE_SUCCEEDED]:
    feeTimelineStatusSuccessedReducer,
  [feeTransactionActionTypes.FETCH_FEE_TRANSACTION_TIMELINE_FAILED]:
    feeTimelineStatusErrorReducer,

  // Transaction receipt download reducer register
  [feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_REQUESTED]:
    receiptDownloadRequestedReducer,
  [feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_SUCCEEDED]:
    receiptDownloadSuccessReducer,
  [feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_FAILED]:
    receiptDownloadErrorReducer,

  // Revoke Transaction reducer register
  [feeTransactionActionTypes.REVOKE_FEE_TRANSACTION_REQUESTED]:
    revokeTransactionRequestedReducer,
  [feeTransactionActionTypes.REVOKE_FEE_TRANSACTION_SUCCEEDED]:
    revokeTransactionSuccessReducer,
  [feeTransactionActionTypes.REVOKE_FEE_TRANSACTION_FAILED]:
    revokeTransactionErrorReducer,

  // Fee Timeline data update
  [feeTransactionActionTypes.UPDATE_FEE_TRANSACTION_TIMELINE_STATUS_REQUESTED]:
    feeTimelineUpdateStatusRequestedReducer,
  [feeTransactionActionTypes.UPDATE_FEE_TRANSACTION_TIMELINE_STATUS_SUCCEEDED]:
    feeTimelineUpdateStatusSuccessedReducer,
  [feeTransactionActionTypes.UPDATE_FEE_TRANSACTION_TIMELINE_STATUS_FAILED]:
    feeTimelineUpdateStatusErrorReducer,

  // cheque status
  [feeTransactionActionTypes.FETCH_CHEQUE_TRANSACTION_LIST_SUCCEEDED]:
    chequeTransacationSuccessStatsRequestedReducer,
  [feeTransactionActionTypes.FETCH_CHEQUE_TRANSACTION_LIST_STATS_FAILED]:
    chequeTransacationSuccessStatsErrorReducer,
  [feeTransactionActionTypes.FETACH_CHEQUE_TRANSACTION_APPLY_FILTER_DATA]:
    chequeTrasactionFilterDataReducar,

  [feeTransactionActionTypes.REVOKE_CHEQUE_TRANSACTION_REQUESTED]:
    revokeBankTransactionRequestedReducer,
  [feeTransactionActionTypes.REVOKE_CHEQUE_TRANSACTION_SUCCEEDED]:
    revokeBankTransactionSuccessReducer,
  [feeTransactionActionTypes.REVOKE_CHEQUE_TRANSACTION_FAILED]:
    revokeBankTransactionErrorReducer,
  [feeTransactionActionTypes.REFRESH_ONLINE_FEE_TRANSACTION_REQUESTED]:
    onlineTransactionStatusRequestedReducer,
  [feeTransactionActionTypes.REFRESH_ONLINE_FEE_TRANSACTION_REQUESTED]:
    onlineTransactionStatusSuccessedReducer,
  [feeTransactionActionTypes.REFRESH_ONLINE_FEE_TRANSACTION_REQUESTED]:
    onlineTransactionStatusErrorReducer,

  [feeTransactionActionTypes.SET_SLIDER_SCREEN]: setSliderReducer,
}

export default createTransducer(feeTransacationReducer, INITIAL_STATE)

import {createTransducer} from '../../../../../redux/helpers'
import {FEE_TAB_ACTION_TYPES} from './actionTypes'

const INITIAL_DATA = {isDataFetching: false, data: [], error: ''}

export const STUDENT_PROFILE_FEE_TAB_DEFULT_STATE = {
  feeTab: {
    isDataFetching: false,
    summary: {
      ...INITIAL_DATA,
      data: {},
    },
    feeUpdateHistory: {
      ...INITIAL_DATA,
    },
    discountTilllDate: {
      ...INITIAL_DATA,
      data: {},
    },
    instlamentwiseDetails: {
      ...INITIAL_DATA,
    },
    collectFeeSlider: {
      isOpen: false,
      sliderData: {},
    },
    paymentHistory: {
      ...INITIAL_DATA,
    },
  },
}

// WALLET STATES
export const STUDENT_PROFILE_WALLET_TAB_DEFULT_STATE = {
  walletTab: {
    walletSummary: {
      ...INITIAL_DATA,
    },
    walletRefund: {
      error: '',
      isDataSending: false,
      isRefundModalOpen: false,
    },
  },
}

const INITIAL_STATE = {
  ...STUDENT_PROFILE_FEE_TAB_DEFULT_STATE,
  ...STUDENT_PROFILE_WALLET_TAB_DEFULT_STATE,
}

const setStudentProfileFeeTabReducer = (state, {payload}) => {
  return {
    ...state,
    feeTab: {...state.feeTab, ...payload},
  }
}

const setFeeTabfeeUpdateHistoryReducer = (state, {payload}) => {
  return {
    ...state,
    feeTab: {
      ...state.feeTab,
      feeUpdateHistory: {...state.feeTab.feeUpdateHistory, ...payload},
    },
  }
}

const setFeeTabSummaryReducer = (state, {payload}) => {
  return {
    ...state,
    feeTab: {
      ...state.feeTab,
      summary: {...state.feeTab.summary, ...payload},
    },
  }
}

const setFeeTabInstalmentwiseDetailsReducer = (state, {payload}) => {
  return {
    ...state,
    feeTab: {
      ...state.feeTab,
      instlamentwiseDetails: {
        ...state.feeTab.instlamentwiseDetails,
        ...payload,
      },
    },
  }
}

const setFeeTabPaymentHistoryStateReducer = (state, {payload}) => {
  return {
    ...state,
    feeTab: {
      ...state.feeTab,
      paymentHistory: {
        ...state.feeTab.paymentHistory,
        ...payload,
      },
    },
  }
}

const setFeeTabDiscountAppliedTillDateStateReducer = (state, {payload}) => {
  return {
    ...state,
    feeTab: {
      ...state.feeTab,
      discountTilllDate: {
        ...state.feeTab.discountTilllDate,
        ...payload,
      },
    },
  }
}

// WALLET REDUCERS
const setStudentProfileWalletTabReducer = (state, {payload}) => {
  return {
    ...state,
    walletTab: {...state.walletTab, ...payload},
  }
}

const setStudentProfileWalletSumaryReducer = (state, {payload}) => {
  return {
    ...state,
    walletTab: {
      ...state.walletTab,
      walletSummary: {
        ...state.walletTab.walletSummary,
        ...payload,
      },
    },
  }
}

const setStudentProfileWalletRefundReducer = (state, {payload}) => {
  return {
    ...state,
    walletTab: {
      ...state.walletTab,
      walletRefund: {
        ...state.walletTab.walletRefund,
        ...payload,
      },
    },
  }
}

const setStudentProfileFeeAndWalletStateResetReducer = (state, {payload}) => {
  return {
    ...state,
    ...payload,
  }
}

const studentProfileFeeAndWalletTabReducer = {
  [FEE_TAB_ACTION_TYPES.SET_UPADATE_HISTORY_STATE]:
    setFeeTabfeeUpdateHistoryReducer,
  [FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_TAB_STATE]:
    setStudentProfileFeeTabReducer,
  [FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_SUMMARY_STATE]:
    setFeeTabSummaryReducer,
  [FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_INSTALLMENT_WISE_DETAILS_STATE]:
    setFeeTabInstalmentwiseDetailsReducer,
  [FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_PAYMENT_HISTORY_STATE]:
    setFeeTabPaymentHistoryStateReducer,
  [FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_DISCOUNT_TILL_DATE_STATE]:
    setFeeTabDiscountAppliedTillDateStateReducer,

  // WALLET
  [FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_WALLET_TAB_STATE]:
    setStudentProfileWalletTabReducer,
  [FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_SUMMARY_STATE]:
    setStudentProfileWalletSumaryReducer,
  [FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_AND_WALLET_STATE_RESET]:
    setStudentProfileFeeAndWalletStateResetReducer,
  [FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_REFUND_STATE]:
    setStudentProfileWalletRefundReducer,
}

export default createTransducer(
  studentProfileFeeAndWalletTabReducer,
  INITIAL_STATE
)

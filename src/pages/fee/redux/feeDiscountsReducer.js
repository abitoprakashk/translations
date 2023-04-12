// Reducer with initial state
import {createTransducer} from '../../../redux/helpers'
import feeDiscountsTypes from './feeDiscountsActionTypes'

const INITIAL_STATE = {
  discounts: [],
  discountsLoading: false,
  discountStudentsList: [],
  discountStudentsListLoading: false,
  createDiscountLoading: false,
  updateDiscountLoading: false,
  adHocDiscountPersonList: [],
  adHocDiscountStudentList: [],
  adHocDiscountReasons: [],
  adHocDiscountStudentListLoader: false,
  newAdHocDiscount: '',
  isCreateReasonModalOpen: false,
  selectedAdHocReason: null,
  adHocDiscountValues: {
    discountAmount: '',
    selectedAdHocReason: null,
    remarks: '',
  },
}

const feeDiscountRequestedReducer = (state) => {
  return {
    ...state,
    discountsLoading: true,
  }
}

const feeDiscountSuccessReducer = (state, action) => {
  return {
    ...state,
    discountsLoading: false,
    discounts: action.payload,
  }
}

const feeDiscountErrorReducer = (state) => {
  return {
    ...state,
    discountsLoading: false,
  }
}

const feeDiscountStudentsListRequestedReducer = (state) => {
  return {
    ...state,
    discountStudentsListLoading: true,
  }
}

const feeDiscountStudentsListSuccessReducer = (state, action) => {
  return {
    ...state,
    discountStudentsListLoading: false,
    discountStudentsList: action.payload,
  }
}

const feeDiscountStudentsListErrorReducer = (state) => {
  return {
    ...state,
    discountStudentsListLoading: false,
  }
}

const createDiscountRequestedReducer = (state) => {
  return {
    ...state,
    createDiscountLoading: true,
  }
}

const createDiscountSuccessReducer = (state) => {
  return {
    ...state,
    createDiscountLoading: false,
  }
}

const createDiscountErrorReducer = (state) => {
  return {
    ...state,
    createDiscountLoading: false,
  }
}

const editDiscountRequestedReducer = (state) => {
  return {
    ...state,
    discountsLoading: true,
  }
}

const editDiscountSuccessReducer = (state) => {
  return {
    ...state,
    discountsLoading: false,
  }
}

const editDiscountErrorReducer = (state) => {
  return {
    ...state,
    discountsLoading: false,
  }
}

const updateDiscountRequestedReducer = (state) => {
  return {
    ...state,
    updateDiscountLoading: true,
  }
}

const updateDiscountSuccessReducer = (state) => {
  return {
    ...state,
    updateDiscountLoading: false,
  }
}

const updateDiscountErrorReducer = (state) => {
  return {
    ...state,
    updateDiscountLoading: false,
  }
}

const feeDiscountDeleteRequestedReducer = (state) => {
  return {
    ...state,
    discountsLoading: true,
  }
}

const feeDiscountDeleteSuccessReducer = (state) => {
  return {
    ...state,
    discountsLoading: false,
    deleteDiscountId: null,
  }
}

const feeDiscountDeleteErrorReducer = (state) => {
  return {
    ...state,
    discountsLoading: false,
    deleteDiscountId: null,
  }
}

const downloadDiscountRequestedReducer = (state) => {
  return {
    ...state,
    discountsLoading: true,
  }
}

const downloadDiscountSuccessReducer = (state) => {
  return {
    ...state,
    discountsLoading: false,
  }
}

const downloadDiscountErrorReducer = (state) => {
  return {
    ...state,
    discountsLoading: false,
  }
}

const setDiscountStatesReducer = (state, {payload}) => {
  return {
    ...state,
    ...payload,
  }
}

const feeDiscountReducer = {
  [feeDiscountsTypes.FETCH_DISCOUNTS_REQUESTED]: feeDiscountRequestedReducer,
  [feeDiscountsTypes.FETCH_DISCOUNTS_SUCCEEDED]: feeDiscountSuccessReducer,
  [feeDiscountsTypes.FETCH_DISCOUNTS_FAILED]: feeDiscountErrorReducer,
  [feeDiscountsTypes.CREATE_DISCOUNT_REQUESTED]: createDiscountRequestedReducer,
  [feeDiscountsTypes.CREATE_DISCOUNT_SUCCEEDED]: createDiscountSuccessReducer,
  [feeDiscountsTypes.CREATE_DISCOUNT_FAILED]: createDiscountErrorReducer,
  [feeDiscountsTypes.GET_STUDENT_LIST_REQUESTED]:
    feeDiscountStudentsListRequestedReducer,
  [feeDiscountsTypes.GET_STUDENT_LIST_SUCCEEDED]:
    feeDiscountStudentsListSuccessReducer,
  [feeDiscountsTypes.GET_STUDENT_LIST_FAILED]:
    feeDiscountStudentsListErrorReducer,
  [feeDiscountsTypes.EDIT_DISCOUNT_REQUESTED]: editDiscountRequestedReducer,
  [feeDiscountsTypes.EDIT_DISCOUNT_SUCCEEDED]: editDiscountSuccessReducer,
  [feeDiscountsTypes.EDIT_DISCOUNT_FAILED]: editDiscountErrorReducer,
  [feeDiscountsTypes.UPDATE_DISCOUNT_REQUESTED]: updateDiscountRequestedReducer,
  [feeDiscountsTypes.UPDATE_DISCOUNT_SUCCEEDED]: updateDiscountSuccessReducer,
  [feeDiscountsTypes.UPDATE_DISCOUNT_FAILED]: updateDiscountErrorReducer,
  [feeDiscountsTypes.DELETE_DISCOUNT_REQUESTED]:
    feeDiscountDeleteRequestedReducer,
  [feeDiscountsTypes.DELETE_DISCOUNT_SUCCEEDED]:
    feeDiscountDeleteSuccessReducer,
  [feeDiscountsTypes.DELETE_DISCOUNT_FAILED]: feeDiscountDeleteErrorReducer,
  [feeDiscountsTypes.DOWNLOAD_DISCOUNT_REQUESTED]:
    downloadDiscountRequestedReducer,
  [feeDiscountsTypes.DOWNLOAD_DISCOUNT_SUCCEEDED]:
    downloadDiscountSuccessReducer,
  [feeDiscountsTypes.DOWNLOAD_DISCOUNT_FAILED]: downloadDiscountErrorReducer,
  [feeDiscountsTypes.SET_DISCOUNT_STATES]: setDiscountStatesReducer,
}

export default createTransducer(feeDiscountReducer, INITIAL_STATE)

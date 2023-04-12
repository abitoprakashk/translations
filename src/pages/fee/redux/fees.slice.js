import {createActions, createReducer} from '../../../redux/helpers'

const name = 'fees'

const initialState = {
  feeCollectionStats: [],
  studentDuesData: [],
  paymentDetailData: [],
  feeStructuresDataLoading: false,
  feeStructureLoading: false,
  feeStructureError: false,
}

//The reducer uses immer.js, so you have to mutate the state
const reducerConfig = {
  loadFeeCollectionStats: (state, stats) => {
    state.feeCollectionStats = stats
  },
  loadStudentDuesData: (state, duesData) => {
    state.studentDuesData = duesData
  },
  filterStudentDues: (state, searchTerm) => {
    state.studentDuesData.forEach((dues) => {
      dues.hidden =
        dues.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        dues.phoneNumber.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1
    })
  },
  loadFeeStructuresDataLoading: (state, showLoading = true) => {
    state.feeStructuresDataLoading = showLoading
  },
  loadFeeStructuresDataError: (state) => {
    state.feeStructuresDataLoading = false
    state.feeStructuresDataError = true
  },
  manageFeeStructureLoading: (state, showLoader = true) => {
    state.feeStructureLoading = showLoader
  },
  manageFeeStructureError: (state, showError = true) => {
    state.feeStructureLoading = false
    state.feeStructureError = showError
  },
  loadPaymentDetailData: (state, paymentData) => {
    state.paymentDetailData = paymentData
  },
}

//actions which does not directly call a reducer fuction but trigger a saga
// const otherActions = ['feeCollectionStatsRequested', 'studentDuesDataRequested']

export const feesReducer = createReducer(name, reducerConfig, initialState)
export const {
  loadFeeCollectionStats,
  loadStudentDuesData,
  filterStudentDues,
  loadPaymentDetailData,
  loadFeeStructuresDataLoading,
  loadFeeStructuresDataError,
  manageFeeStructureLoading,
  manageFeeStructureError,
} = createActions(name, reducerConfig)

// export const {feeCollectionStatsRequested, studentDuesDataRequested} =
//   createSagaActions(name, otherActions)

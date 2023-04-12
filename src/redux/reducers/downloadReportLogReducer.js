import {reportLogActionTypes} from '../actionTypes'
import {createTransducer} from '../helpers'

const INITIAL_STATE = {
  loader: true,
  downloadReportLogData: {},
  performanceReportStates: {
    isModalOpen: false,
    isDownloading: false,
    isDownloaded: false,
  },
}

const setLoaderReducer = (state, {payload}) => {
  return {
    ...state,
    loader: payload,
  }
}

const setDownloadReportLogDataReducer = (state, {payload}) => {
  return {
    ...state,
    loader: false,
    downloadReportLogData: payload,
  }
}

const setPerformanceReportStates = (state, {payload}) => {
  return {
    ...state,
    performanceReportStates: {...state.performanceReportStates, ...payload},
  }
}

const downloadReportLogReducer = {
  [reportLogActionTypes.SET_DOWNLOAD_REPORT_LOADER]: setLoaderReducer,
  [reportLogActionTypes.DOWNLOAD_REPORT_LOG_SUCCESS]:
    setDownloadReportLogDataReducer,
  [reportLogActionTypes.SET_PERFORMANCE_REPORT_STATES]:
    setPerformanceReportStates,
}

export default createTransducer(downloadReportLogReducer, INITIAL_STATE)

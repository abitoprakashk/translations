import {reportLogActionTypes} from '../actionTypes'

export const fetchDownloadReportLogAction = () => {
  return {
    type: reportLogActionTypes.DOWNLOAD_REPORT_LOG_REQUEST,
    payload: null,
  }
}

export const setDownloadReportLogAction = (payload) => {
  return {
    type: reportLogActionTypes.DOWNLOAD_REPORT_LOG_SUCCESS,
    payload,
  }
}

export const saveReportLogAction = (payload) => {
  return {
    type: reportLogActionTypes.SAVE_REPORT_LOG,
    payload,
  }
}

export const fetchPerformanceReportAction = () => {
  return {
    type: reportLogActionTypes.PERFORMANCE_REPORT_REQUEST,
    payload: null,
  }
}

export const setPerformanceReportStatesAction = (payload) => {
  return {
    type: reportLogActionTypes.SET_PERFORMANCE_REPORT_STATES,
    payload,
  }
}

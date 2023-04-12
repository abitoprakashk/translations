import {createTransducer} from '../../../../redux/helpers'
import {CertificateInfoActionType} from '../actionTypes'

const INITIAL_STATE = {
  tabInfo: [],
  allTabData: null,
  loading: false,
}

const setTabData = (state, {payload}) => {
  return {
    ...state,
    tabInfo: payload,
    loading: false,
  }
}

const setAllTabData = (state, {payload}) => {
  return {
    ...state,
    allTabData: payload,
  }
}

const showLoader = (state) => {
  return {
    ...state,
    loading: true,
  }
}

const hideLoader = (state) => {
  return {
    ...state,
    tabInfo: [],
    loading: false,
  }
}

const tabInfoReducer = {
  [CertificateInfoActionType.FETCH_CERTIFICATE_TAB_DATA_SUCCESS]: setTabData,
  [CertificateInfoActionType.FETCH_CERTIFICATE_ALL_TAB_DATA]: setAllTabData,
  [CertificateInfoActionType.FETCH_CERTIFICATE_TAB_DATA_REQUEST]: showLoader,
  [CertificateInfoActionType.FETCH_CERTIFICATE_TAB_DATA_FAILURE]: hideLoader,
}

export default createTransducer(tabInfoReducer, INITIAL_STATE)

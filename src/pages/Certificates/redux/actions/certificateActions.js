import {
  CertificateInfoActionType,
  CreateCertificateItemTypes,
} from '../actionTypes'

export const getCertificateData = (type) => {
  return {
    type: CertificateInfoActionType.FETCH_CERTIFICATE_TAB_DATA_REQUEST,
    payload: type,
  }
}

export const createCertificateItem = (payload) => {
  return {
    type: CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM,
    payload,
  }
}

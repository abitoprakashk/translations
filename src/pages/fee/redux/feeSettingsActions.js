import feeSettingsActionTypes from './feeSettingsActionTypes'

export const digitalSignatureUpdate = (data) => {
  return {
    type: feeSettingsActionTypes.UPDATE_DIGITAL_SIGNATURE,
    payload: data,
    digitalSignatureLoading: true,
  }
}

export const removeExistingSignatureImage = (data) => {
  return {
    type: feeSettingsActionTypes.REMOVE_DIGITAL_SIGNATURE_IMAGE,
    payload: data,
    digitalSignatureLoading: true,
  }
}

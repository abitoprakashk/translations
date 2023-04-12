// Reducer with initial state
import {createTransducer} from '../../../redux/helpers'
import feeSettingsActions from './feeSettingsActionTypes'

const INITIAL_STATE = {
  digitalSignatureLoading: null,
}

const setDigitalSignatureLoading = (state, payload) => {
  return {
    ...state,
    digitalSignatureLoading: payload.digitalSignatureLoading,
  }
}

const feeSettingsReducer = {
  [feeSettingsActions.UPDATE_DIGITAL_SIGNATURE]: setDigitalSignatureLoading,
  [feeSettingsActions.UPDATE_DIGITAL_SIGNATURE_SUCCEEDED]:
    setDigitalSignatureLoading,
  [feeSettingsActions.UPDATE_DIGITAL_SIGNATURE_FAIL]:
    setDigitalSignatureLoading,
  [feeSettingsActions.REMOVE_DIGITAL_SIGNATURE_IMAGE]:
    setDigitalSignatureLoading,
}

export default createTransducer(feeSettingsReducer, INITIAL_STATE)

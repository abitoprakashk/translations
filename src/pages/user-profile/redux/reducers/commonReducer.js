import {COMMON_ACTIONS} from '../actionTypes'
import {ProfileSettingsActionTypes} from '../../../ProfileSettings/actionTypes'
import {createTransducer} from '../../../../redux/helpers'
import {getInitialDynamicFieldsState} from '../../UserProfile.utils'

const signedUrlReducer = (state, {payload}) => {
  return {
    ...state,
    profilePicSignedUrl: payload,
  }
}

const signedUrlFailedReducer = (state, {payload}) => {
  return {
    ...state,
    profilePicSignedUrlFailedError: payload,
  }
}

const getInitialObjectReducer = (state, {payload}) => {
  let json = {}
  if (payload && payload.length > 0) {
    json = getInitialDynamicFieldsState(payload)
  }
  return {
    ...state,
    initialObject: json,
  }
}

const commonReducer = {
  [COMMON_ACTIONS.DISPLAY_PIC_UPLOAD_SIGNED_URL_SUCCESS]: signedUrlReducer,
  [COMMON_ACTIONS.DISPLAY_PIC_UPLOAD_SIGNED_URL_FAILED]: signedUrlFailedReducer,
  [ProfileSettingsActionTypes.GET_PERSONA_WISE_CATEGORIES]:
    getInitialObjectReducer,
}

export default createTransducer(commonReducer, {})

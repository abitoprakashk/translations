import {INSTITUTE_ACTIONS} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'

const INITIAL_STATE = {
  name: '',
  phone_number: '',
  affiliation_number: '',
  affiliated_by: '',
  school_code: '',
  email: '',
  website: '',
  address: {
    line1: '',
    line2: '',
    country: '',
    pin: '',
    state: '',
    city: '',
  },
  ins_logo: '',
}

const profileDataReducer = (state, {payload}) => {
  if (payload) return payload
  return INITIAL_STATE
}

const instituteReducer = {
  [INSTITUTE_ACTIONS.INSTITUTE_PROFILE_DATA_REQUEST]: profileDataReducer,
}

export default createTransducer(instituteReducer, INITIAL_STATE)

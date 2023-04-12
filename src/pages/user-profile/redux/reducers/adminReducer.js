import {ADMIN_ACTIONS} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'

// const setAddressObj = (address) => {
//   return {
//     line1: address.line1 || INITIAL_STATE.current_address.line1,
//     line2: address.line2 || INITIAL_STATE.current_address.line2,
//     country: address.country || INITIAL_STATE.current_address.country,
//     pin: address.pin || INITIAL_STATE.current_address.pin,
//     state: address.state || INITIAL_STATE.current_address.state,
//     city: address.city || INITIAL_STATE.current_address.city,
//   }
// }

// const getEmpId = (id, instiId) => {
//   if (id === `@${instiId}`) {
//     return ''
//   }
//   return id || INITIAL_STATE.employee_id
// }

// const setObject = (obj) => {
//   let json = {isLoading: false}
//   let empId = getEmpId(obj.employee_id, obj.institute_id)
//   json = {
//     isLoading: false,
//     imember_id: obj._id || INITIAL_STATE._id,
//     email: obj.email || INITIAL_STATE.email,
//     phoneNumber: obj.phone_number,
//     countryCode: obj.country_code || INITIAL_STATE.country_code,
//     name: obj.name,
//     middleName: obj.middle_name || INITIAL_STATE.middle_name,
//     lastName: obj.last_name || INITIAL_STATE.last_name,
//     dateOfBirth: obj.date_of_birth || INITIAL_STATE.date_of_birth,
//     gender: obj.gender || INITIAL_STATE.gender,
//     bloodGroup: obj.blood_group || INITIAL_STATE.blood_group,
//     currentAddress: setAddressObj(obj.current_address),
//     permanentAddress: setAddressObj(obj.permanent_address),
//     employeeId: empId,
//     aadharNumber: obj.aadhar_number || INITIAL_STATE.aadhar_number,
//     panNumber: obj.pan_number || INITIAL_STATE.pan_number,
//     profilePic: obj.img_url || '',
//     roles: obj.roles || obj.roles_to_assign || INITIAL_STATE.roles,
//     jobProfile: obj.job_profile || INITIAL_STATE.job_profile,
//     designation: obj.designation || INITIAL_STATE.designation,
//     employmentType: obj.employment_type || INITIAL_STATE.employment_type,
//     experience: obj.experience || INITIAL_STATE.experience,
//     dateOfAppointment:
//       obj.date_of_appointment || INITIAL_STATE.date_of_appointment,
//   }
//   return json
// }

const profileDataReducer = (state, {payload}) => {
  if (payload) return payload
  return {}
}

const loadingReducer = (state, {payload}) => {
  state.isLoading = payload
  return state
}

const afterUpdateReducer = (state, {payload}) => {
  return {...state, updated: payload}
}

const afterUpdateFailedReducer = (state, {payload}) => {
  return {...state, failed: payload}
}

const afterDPUpdate = (state) => {
  return {...state, displayPictureUpdated: true}
}

const showLoader = (state) => {
  return {...state}
}

const adminReducer = {
  [ADMIN_ACTIONS.ADMIN_PROFILE_DATA]: profileDataReducer,
  [ADMIN_ACTIONS.ADMIN_PROFILE_LOADER]: loadingReducer,
  [ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_SUCCESSFUL]: afterUpdateReducer,
  [ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_FAILED]: afterUpdateFailedReducer,
  [ADMIN_ACTIONS.ADMIN_DISPLAY_PIC_UPLOAD_SUCCESS]: afterDPUpdate,
  [ADMIN_ACTIONS.ADMIN_DISPLAY_PIC_UPLOAD_REQUEST]: showLoader,
  [ADMIN_ACTIONS.ADMIN_PROFILE_UPDATE_REQUEST]: showLoader,
  [ADMIN_ACTIONS.ADMIN_PROFILE_ADD_REQUEST]: showLoader,
}

export default createTransducer(adminReducer, {})

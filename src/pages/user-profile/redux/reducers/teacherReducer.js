import {TEACHER_ACTIONS} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'

const INITIAL_STATE = {
  _id: '',
  name: '',
  middle_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  country_code: '',
  gender: '',
  blood_group: '',
  father_name: '',
  mother_name: '',
  father_occupation: '',
  father_contact_number: '',
  mother_occupation: '',
  mother_contact_number: '',
  nationality: '',
  religion: '',
  category: '',
  right_to_education: '',
  pwd: '',
  house: '',
  admission_date: '',
  admission_class: '',
  enrollment_number: '',
  last_school_attended: '',
  last_school_affiliation: '',
  last_class_passed: '',
  department: '',
  branch: '',
  transport: '',
  sibling_status: false,
  sibling_detail: '',
  staff_child: false,
  staff_detail: '',
  army_child: false,
  guardian_name: '',
  guardian_number: '',
  date_of_birth: '',
  is_transport_required: false,
  transport_distance: 0.0,
  transport_waypoint: '',
  current_address: {
    line1: '',
    line2: '',
    country: '',
    pin: '',
    state: '',
    city: '',
  },
  permanent_address: {
    line1: '',
    line2: '',
    country: '',
    pin: '',
    state: '',
    city: '',
  },
  aadhar_number: '',
  pan_number: '',
  employee_id: '',
  job_profile: '',
  designation: '',
  employment_type: '',
  date_of_appointment: '',
  experience: '',
  qualification: '',
  isLoading: false,
}

const setAddressObj = (address) => {
  return {
    line1: address.line1 || INITIAL_STATE.current_address.line1,
    line2: address.line2 || INITIAL_STATE.current_address.line2,
    country: address.country || INITIAL_STATE.current_address.country,
    pin: address.pin || INITIAL_STATE.current_address.pin,
    state: address.state || INITIAL_STATE.current_address.state,
    city: address.city || INITIAL_STATE.current_address.city,
  }
}

const divideObject = (obj) => {
  let json = {}
  json.basicInfo = {
    imember_id: obj._id || INITIAL_STATE._id,
    email: obj.email || INITIAL_STATE.email,
    phoneNumber: obj.phone_number,
    countryCode: obj.country_code || INITIAL_STATE.country_code,
    name: obj.name,
    middleName: obj.middle_name || INITIAL_STATE.middle_name,
    lastName: obj.last_name || INITIAL_STATE.last_name,
    dateOfBirth: obj.date_of_birth || INITIAL_STATE.date_of_birth,
    gender: obj.gender || INITIAL_STATE.gender,
    bloodGroup: obj.blood_group || INITIAL_STATE.blood_group,
    currentAddress: setAddressObj(obj.current_address),
    permanentAddress: setAddressObj(obj.permanent_address),
    employeeId: obj.employee_id || INITIAL_STATE.employee_id,
    aadharNumber: obj.aadhar_number || INITIAL_STATE.aadhar_number,
    panNumber: obj.pan_number || INITIAL_STATE.pan_number,
    profilePic: obj.img_url || '',
  }
  json.employeeDetails = {
    jobProfile: obj.job_profile || INITIAL_STATE.job_profile,
    designation: obj.designation || INITIAL_STATE.designation,
    employmentType: obj.employment_type || INITIAL_STATE.employment_type,
    experience: obj.experience || INITIAL_STATE.experience,
    dateOfAppointment:
      obj.date_of_appointment || INITIAL_STATE.date_of_appointment,
    qualification: obj.qualification || INITIAL_STATE.qualification,
  }
  let academicDetails = obj._id ? obj.academic_details : null
  json.academicDetails = academicDetails
    ? Object.keys(academicDetails).map((key) => ({
        standard: key,
        subjects: academicDetails[key],
      }))
    : []
  return json
}

const profileDataReducer = (state, {payload}) => {
  if (payload) return divideObject(payload)
  return divideObject({...INITIAL_STATE, isLoading: state.isLoading})
}

const loadingReducer = (state, {payload}) => {
  state.isLoading = payload
  return state
}

const afterUpdateReducer = (state, {payload}) => {
  state.updated = payload
  return state
}

const afterUpdateFailedReducer = (state, {payload}) => {
  return {...state, failed: payload}
}

const afterDPUpdate = (state) => {
  return {...state, displayPictureUpdated: true}
}

const showLoader = (state) => {
  return {...state, isLoading: true}
}

const teacherReducer = {
  [TEACHER_ACTIONS.TEACHER_PROFILE_DATA]: profileDataReducer,
  [TEACHER_ACTIONS.TEACHER_PROFILE_LOADER]: loadingReducer,
  [TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_SUCCESSFUL]: afterUpdateReducer,
  [TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_FAILED]: afterUpdateFailedReducer,
  [TEACHER_ACTIONS.TEACHER_DISPLAY_PIC_UPLOAD_SUCCESS]: afterDPUpdate,
  [TEACHER_ACTIONS.TEACHER_DISPLAY_PIC_UPLOAD_REQUEST]: showLoader,
  [TEACHER_ACTIONS.TEACHER_PROFILE_UPDATE_REQUEST]: showLoader,
}

export default createTransducer(teacherReducer, divideObject(INITIAL_STATE))

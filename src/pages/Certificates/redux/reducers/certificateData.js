import {createTransducer} from '../../../../redux/helpers'
import {
  CertificateActions,
  CreateCertificateItemTypes,
  StudentProfileDataActions,
} from '../actionTypes'

const INITIAL_STATE = {
  selectedStudent: {},
  selectedStudentBackup: null,
  selectedType: null,
  pdfUrl: null,
  tcAndRemarks: {
    tc: {
      dob_in_word: '',
      ref_no: '',
      sl_no: '',
      date_of_admission: '',
      last_studied_class: '',
      last_class_percent: '',
      whether_failed: '',
      achievement: '',
      date_of_issue: '',
      leaving_reason: '',
      remark: '',
      extra_curricular_activity: '',
      subject: '',
      ncc_or_scout: '',
      promoted_to_class: '',
      promoted_to_class_in_words: '',
      month_due_fees: '',
      fee_concession: '',
      total_working_days: '',
      total_day_present: '',
      promoted_to_higher_class: 'Yes',
      caste: '',
    },
    remarks: {
      general_conduct: '',
      remark: '',
    },
  },
}

const setStudentData = (state, {payload}) => {
  return {
    ...state,
    selectedStudent: {...payload},
    selectedStudentBackup:
      state.selectedStudentBackup &&
      state?.selectedStudentBackup?.name &&
      state?.selectedStudent?.name == payload.name
        ? {...state.selectedStudentBackup}
        : {...payload},
  }
}

const setCertificateType = (state, {payload}) => {
  return {
    ...state,
    selectedType: payload,
    pdfUrl: '',
  }
}

const setTCData = (state, {payload}) => {
  return {
    ...state,
    tcAndRemarks: payload,
  }
}

const setPdfUrl = (state, {url}) => {
  return {
    ...state,
    pdfUrl: `${url}`,
    loading: false,
  }
}

const setLoader = (state, {loading}) => {
  return {...state, loading: loading}
}

const certificateData = {
  [CertificateActions.SET_STUDENT_INFO]: setStudentData,
  [CertificateActions.SET_CERTIFICATE_TYPE]: setCertificateType,
  [CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM_SUCCESS]: setPdfUrl, // certificate_url
  [CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM_FAILURE]: setLoader, // certificate_url
  [CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM_LOADING]: setLoader, // certificate_url
  [CertificateActions.SET_TC_INFO]: setTCData,
  [StudentProfileDataActions.FETCH_CERTIFICATE_STUDENT_DATA_FAILURE]: setLoader,
}

export default createTransducer(certificateData, INITIAL_STATE)

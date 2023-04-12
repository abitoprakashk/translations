import {REACT_APP_ADMISSION_CRM_DOMAIN} from '../../../constants'
import {onboardingFlowStepsId} from '../utils/constants'

const validateSessionData = (formData) => {
  return formData.session_id && formData.enabled_node_ids.length > 0
}

const validateLeadStagesData = (formData) => {
  return !Object.values(formData).some((stage) => stage.name === '')
}

const validateWebPageData = (formData) => {
  return (
    formData?.domain_url.replace(`.${REACT_APP_ADMISSION_CRM_DOMAIN}`, '') &&
    formData?.instructions?.heading &&
    formData?.instructions?.text
  )
}

const validateEnquiryFormData = (formData) => {
  return (
    Object.values(formData?.profile_fields).filter(
      (item) => item.enabled === true
    ).length < 16 &&
    (formData?.declaration?.display
      ? formData?.declaration?.text
      : !formData?.declaration?.display)
  )
}

const validateAdmissionFormData = () => {
  return true
}

const validateDocumentsData = () => {
  return true
  // return Object.values(formData.profile_fields).some((field) => field.required)
}

const validateFeesData = (formData, isFormFeesStep) => {
  if (isFormFeesStep && formData.form_fees_required) {
    return (
      formData.form_fees?.receipt_prefix &&
      formData.form_fees?.receipt_starting_number
    )
  } else {
    if (formData.admission_fees_required) {
      return (
        formData.admission_fees?.collect_fee_stage_id &&
        formData.admission_fees?.receipt_prefix &&
        formData.admission_fees?.receipt_starting_number
      )
    }
  }
  return true
}

export const validateCrmSettings = (type, formData, isFormFeesStep = false) => {
  switch (type) {
    case onboardingFlowStepsId.SESSION:
      return validateSessionData(formData)
    case onboardingFlowStepsId.LEAD_STAGES:
      return validateLeadStagesData(formData)
    case onboardingFlowStepsId.WEB_PAGE:
      return validateWebPageData(formData)
    case onboardingFlowStepsId.ENQUIRY_FORM:
      return validateEnquiryFormData(formData)
    case onboardingFlowStepsId.ADMISSION_FORM:
      return validateAdmissionFormData(formData)
    case onboardingFlowStepsId.DOCUMENTS:
      return validateDocumentsData(formData)
    case onboardingFlowStepsId.FEES:
      return validateFeesData(formData, isFormFeesStep)
  }
}

export const validateFeesFormData = (isFormFeesStep, formData) => {
  if (isFormFeesStep) {
    return (
      !formData.form_fees_required ||
      (formData.form_fees &&
        Object.values(formData.form_fees?.class_fees).some(
          ({fee_amount}) => fee_amount
        ))
    )
  } else {
    return (
      !formData.admission_fees_required ||
      (formData.admission_fees &&
        Object.values(formData.admission_fees?.class_fees).some(
          ({fee_amount}) => fee_amount
        ))
    )
  }
}

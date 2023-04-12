/*
 * All module level helper functions should be defined here
 */

import {t} from 'i18next'
import produce from 'immer'
import {STEPPER_CONSTANTS} from '@teachmint/krayon'
import {
  defaultOnboardingFlowStepsProgress,
  enquiryFormData,
  feesData,
  FEES_STEPPER_IDS,
  IMIS_SETTING_TYPES,
  onboardingFlowSteps,
  onboardingFlowStepsId,
  onboardingFlowStepsWeightage,
  IMIS_FILE_UPLOAD_FIELD_TYPES,
  modifiedImisFieldLabels,
} from './constants'
import {DateTime} from 'luxon'
import {getAmountFixDecimalWithCurrency} from '../../../utils/Helpers'

export const isCrmSettingsInitialized = (settings) => {
  return (
    settings?.profile_fields && Object.keys(settings.profile_fields).length > 0
  )
}

export const getOnboardingProgress = (stepsProgress) => {
  return stepsProgress
    ? Object.keys(stepsProgress).reduce(
        (sum, step) =>
          sum + (stepsProgress[step] ? onboardingFlowStepsWeightage[step] : 0),
        0
      )
    : 0
}

export const isCrmSettingsConfigured = (stepsProgress) => {
  return stepsProgress ? !Object.values(stepsProgress).includes(false) : false
}

export const setCrmSettingsProgress = (settings) => {
  let settingsProgress = {...defaultOnboardingFlowStepsProgress}
  // Check for session enabling
  if (settings?.enable_session && settings?.enable_session?.session_id) {
    settingsProgress[onboardingFlowStepsId.SESSION] = true
  }
  // Check for lead stages
  if (settings?.lead_stages && Object.keys(settings?.lead_stages).length) {
    settingsProgress[onboardingFlowStepsId.LEAD_STAGES] = true
  }
  // Check for web page
  if (settings?.enquiry_portal && settings?.enquiry_portal?.web_page_step) {
    settingsProgress[onboardingFlowStepsId.WEB_PAGE] = true
  }
  // Check for enquiry form
  if (settings?.enquiry_portal && settings?.enquiry_portal?.enq_form_step) {
    settingsProgress[onboardingFlowStepsId.ENQUIRY_FORM] = true
  }
  // Check for admission form
  if (settings?.admission_portal && settings?.admission_portal?.adm_form_step) {
    settingsProgress[onboardingFlowStepsId.ADMISSION_FORM] = true
  }
  // Check for documents
  if (
    settings?.admission_portal &&
    settings?.admission_portal?.doc_upload_step
  ) {
    settingsProgress[onboardingFlowStepsId.DOCUMENTS] = true
  }
  // Check for fees
  if (settings?.fee_settings && Object.keys(settings?.fee_settings).length) {
    settingsProgress[onboardingFlowStepsId.FEES] = true
  }
  return settingsProgress
}

export const getSequencedStages = (leadStages) => {
  return leadStages.sort((stage1, stage2) =>
    stage1.sequence_no > stage2.sequence_no
      ? 1
      : stage1.sequence_no < stage2.sequence_no
      ? -1
      : 0
  )
}

export const feesStepperOptions = (admissionCrmSettings) => {
  return {
    [FEES_STEPPER_IDS.FORM_FEE]: {
      id: FEES_STEPPER_IDS.FORM_FEE,
      status: admissionCrmSettings?.data?.fee_settings
        ? STEPPER_CONSTANTS.STATUS.COMPLETED
        : STEPPER_CONSTANTS.STATUS.IN_PROGRESS,
      title: t('feesStepperLabelFormFees'),
    },
    [FEES_STEPPER_IDS.ADMISSION_FEE]: {
      id: FEES_STEPPER_IDS.ADMISSION_FEE,
      status: admissionCrmSettings?.data?.fee_settings
        ? STEPPER_CONSTANTS.STATUS.COMPLETED
        : STEPPER_CONSTANTS.STATUS.NOT_STARTED,
      title: t('feesStepperLabelAdmissionFees'),
    },
  }
}

function getProfileFieldSettings(draft, fieldType, fieldName) {
  return {
    imis_key_id: fieldName,
    required: draft.profile_fields?.[fieldName]
      ? draft.profile_fields[fieldName].required_in.includes(fieldType)
      : false,
    enabled: draft.profile_fields?.[fieldName]
      ? draft.profile_fields[fieldName].enabled_in.includes(fieldType)
      : false,
  }
}

export const formatCrmSettingsObj = (crmSettings) => {
  return produce(crmSettings, (draft) => {
    // Modify the default label of some IMIS fields
    let imisFieldsInfo = []
    const modifiedImisFields = Object.keys(modifiedImisFieldLabels)
    draft.imis_fields_info.forEach((field) => {
      if (modifiedImisFields.includes(field.key_id)) {
        imisFieldsInfo.push({
          ...field,
          label: modifiedImisFieldLabels[field.key_id],
        })
      } else {
        imisFieldsInfo.push(field)
      }
    })
    draft.imis_fields_info = imisFieldsInfo
    // Below code might be required so commentted for later use
    // if (draft?.domain_setting) {
    //   draft.enquiry_portal.domain_url = draft.domain_setting.domain_url
    // }
    // Ignore deleted stages
    if (draft?.lead_stages) {
      let leadStages = {}
      Object.values(draft.lead_stages).forEach((stage) => {
        if (!stage.deleted) {
          leadStages[stage._id] = stage
        }
      })
      draft.lead_stages = leadStages
    }
    if (draft?.profile_fields) {
      // Rearrange the categories from imis fields data
      draft.categorizedFields = {}
      draft.imis_fields_info
        .filter((field) => field.setting_type !== IMIS_SETTING_TYPES.FIELD)
        .forEach((field) => {
          draft.categorizedFields[field._id] = {...field, fields: []}
        })

      // Rearrange the fields inside each category from imis fields data
      draft.enquiryFormFields = {
        declaration: {
          ...(draft?.enquiry_portal?.declaration ||
            enquiryFormData.defaultFormData.declaration),
        },
        profile_fields: {},
      }
      draft.admissionFormFields = {profile_fields: {}}
      draft.documentFormFields = {profile_fields: {}}
      draft.imis_fields_info
        .filter((field) => field.setting_type === IMIS_SETTING_TYPES.FIELD)
        .forEach((field) => {
          if (field.category_id) {
            const fieldName = field.key_id
            draft.categorizedFields[field.category_id].fields.push(field)
            if (IMIS_FILE_UPLOAD_FIELD_TYPES.includes(field.field_type)) {
              draft.documentFormFields.profile_fields[fieldName] =
                getProfileFieldSettings(draft, 'admission', fieldName)
            } else {
              draft.enquiryFormFields.profile_fields[fieldName] =
                getProfileFieldSettings(draft, 'enquiry', fieldName)
              draft.admissionFormFields.profile_fields[fieldName] =
                getProfileFieldSettings(draft, 'admission', fieldName)
            }
          }
        })
      if (draft?.fee_settings) {
        if (!Object.keys(draft?.fee_settings?.form_fees).length) {
          draft.fee_settings.form_fees = feesData.defaultFormData.form_fees
        }
        if (!Object.keys(draft?.fee_settings?.admission_fees).length) {
          draft.fee_settings.admission_fees =
            feesData.defaultFormData.admission_fees
        }
      }
    }
  })
}

export const checkCrmSettingsToProceed = (mandatorySteps, settingsProgress) => {
  return mandatorySteps.length > 0
    ? !mandatorySteps.every((step) => settingsProgress.data?.[step])
    : false
}

export const getCrmSettingsFormData = (selectedStep, crmSettings) => {
  if (selectedStep === onboardingFlowStepsId.WEB_PAGE) {
    const domainUrl = crmSettings?.data?.domain_setting.domain_url
    const webPageSetup =
      crmSettings?.data?.[onboardingFlowSteps[selectedStep].settingsKey]
    return {
      domain_url: domainUrl,
      instructions: webPageSetup?.web_page_step
        ? webPageSetup.instructions
        : onboardingFlowSteps[selectedStep].defaultFormData.instructions,
    }
  } else if (selectedStep === onboardingFlowStepsId.ENQUIRY_FORM) {
    return crmSettings?.data?.enquiryFormFields
  } else if (selectedStep === onboardingFlowStepsId.ADMISSION_FORM) {
    return crmSettings?.data?.admissionFormFields
  } else if (selectedStep === onboardingFlowStepsId.DOCUMENTS) {
    return crmSettings?.data?.documentFormFields
  }
  return (
    crmSettings?.data?.[onboardingFlowSteps[selectedStep].settingsKey] ||
    onboardingFlowSteps[selectedStep].defaultFormData
  )
}

export const convertDateFromIsoToSeconds = (converterDate) => {
  return DateTime.fromJSDate(converterDate).toSeconds()
}

export const getClassName = (hierarchy, classId) => {
  const departments = hierarchy?.children
  let className = ''
  departments?.find((department) => {
    const standard = department.children.find((std) => std.id === classId)
    if (standard) {
      className = standard.name
      return className
    }
  })
  return className
}

export const getSectionName = (hierarchy, sectionId) => {
  const departments = hierarchy?.children
  let sectionName = ''
  departments?.find((department) => {
    department.children.find((standard) => {
      const section = standard.children.find(
        (section) => section.id === sectionId
      )
      if (section) {
        sectionName = section.name
        return sectionName
      }
    })
  })
  return sectionName
}

export const isAdmin = (adminId, instituteAdmins) => {
  return instituteAdmins.find((admin) => admin.user_id === adminId) ?? null
}

export const getSpecificLeadData = (leads, leadId) => {
  if (Array.isArray(leads)) {
    return leads.find((lead) => lead._id === leadId)
  }
  return
}

const updateReduxList = (list, _id, data) => {
  return list.map((listItem) => {
    if (listItem._id === _id) {
      return {...listItem, ...data}
    }
    return {...listItem}
  })
}

export const sortLeadsByUpdatedTimestamp = (leads) => {
  return leads.sort((lead1, lead2) =>
    lead2.u > lead1.u ? 1 : lead2.u < lead1.u ? -1 : 0
  )
}

export const updateLeadList = (leads, leadId, leadData = {}) => {
  return sortLeadsByUpdatedTimestamp(updateReduxList(leads, leadId, leadData))
}

export const updateTransactionList = (
  transactions,
  transactionId,
  transactionData = {}
) => {
  return updateReduxList(transactions, transactionId, transactionData)
}

export const openLinkInNewTab = (link) => {
  const win = window.open(link, '_blank')
  if (win != null) {
    win.focus()
  }
}

export const calculateAmount = (
  amount,
  tax,
  withCurrency = false,
  currency
) => {
  let totalAmount = amount ?? 0
  if (amount) {
    totalAmount =
      parseFloat(amount) +
      (tax && tax <= 100 ? (parseFloat(amount) * parseFloat(tax)) / 100 : 0)
  }
  return withCurrency
    ? getAmountFixDecimalWithCurrency(totalAmount, currency)
    : totalAmount
}

export const calculateTaxAmount = (
  amount,
  tax,
  withCurrency = false,
  currency
) => {
  let totalTax = 0
  if (tax) {
    totalTax = parseFloat(
      tax <= 100 ? (parseFloat(amount) * parseFloat(tax)) / 100 : 0
    )
  }
  return withCurrency
    ? getAmountFixDecimalWithCurrency(totalTax, currency)
    : totalTax
}

import {t} from 'i18next'

const smsTemplateIds = {
  APPLICATION_FORM_TEMPLATE: 'APPLICATION_FORM_TEMPLATE',
  ADMISSION_FEE_TEMPLATE: 'ADMISSION_FEE_TEMPLATE',
}

export const sendSMSTemplate = {
  CRM_APP_FORM_REMINDER: 'CRM_APP_FORM_REMINDER',
  CRM_ADM_FEE_REMINDER: 'CRM_ADM_FEE_REMINDER',
}

export const sendSMSMapping = {
  CRM_APP_FORM_REMINDER: t('leadProfileSendSmsApplicationFormTemplate'),
  CRM_ADM_FEE_REMINDER: t('leadProfileSendSmsAdmissionFeeTemplate'),
}

export const smsTemplates = {
  APPLICATION_FORM_TEMPLATE: {
    id: smsTemplateIds.APPLICATION_FORM_TEMPLATE,
    label: t('leadProfileSendSmsApplicationFormTemplate'),
    templateId: sendSMSTemplate.CRM_APP_FORM_REMINDER,
    content: `Dear {student_name}, 

Your admission form for {school_name} is not submitted yet.
This is a reminder from admin to complete your admission form using the link below

View on Teachmint: {student_portal_link}`,
  },
  ADMISSION_FEE_TEMPLATE: {
    id: smsTemplateIds.ADMISSION_FEE_TEMPLATE,
    label: t('leadProfileSendSmsAdmissionFeeTemplate'),
    templateId: sendSMSTemplate.CRM_ADM_FEE_REMINDER,
    content: `Dear {student_name},

Congratulations! You are shortlisted for admission to {school_name}. Please complete fee payment to confirm your admission.

Link: {student_portal_link}
From {school_name} via Teachmint`,
  },
}

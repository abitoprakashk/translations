/*
 * All module level constants should be defined here
 */
import {t} from 'i18next'
import {MODAL_CONSTANTS} from '@teachmint/krayon'
import {DateTime} from 'luxon'

export const KANBAN_ITEM_TYPES = {
  STAGE: 'STAGE',
  CARD: 'CARD',
}

export const IMIS_SETTING_TYPES = {
  CATEGORY: 1,
  FIELD: 2,
  DOCUMENT: 3,
}

export const imgFormats = {
  png: 'png',
  jpg: 'jpg',
  jpeg: 'jpeg',
}

export const IMIS_FIELD_TYPES = {
  TEXT: 'TEXT',
  DROPDOWN: 'DROPDOWN',
  DATE: 'DATE',
  CHECKBOX: 'CHECKBOX',
  FILEUPLOAD: 'FILEUPLOAD',
  EMAIL: 'EMAIL',
  PHONE_NUMBER: 'PHONE_NUMBER',
  NUMBER: 'NUMBER',
  ENROLLMENT_ID: 'ENROLLMENT_ID',
  DOCUMENT: 'DOCUMENT',
  DICT: 'DICT',
  TEXT_AREA: 'TEXT_AREA',
}

export const IMIS_FILE_UPLOAD_FIELD_TYPES = [
  IMIS_FIELD_TYPES.FILEUPLOAD,
  IMIS_FIELD_TYPES.DOCUMENT,
]

export const admissionTabIds = {
  LEADS: 'leads',
  TRANSACTIONS: 'transactions',
  FOLLOWUPS: 'followups',
  SETTINGS: 'settings',
}

export const admissionTabs = [
  {
    id: admissionTabIds.LEADS,
    label: t('tabLeadList'),
  },
  {
    id: admissionTabIds.TRANSACTIONS,
    label: t('tabTransactions'),
  },
  {
    id: admissionTabIds.FOLLOWUPS,
    label: t('tabFollowups'),
  },
  {
    id: admissionTabIds.SETTINGS,
    label: t('tabSettings'),
  },
]

export const staticImisFields = {
  NAME: 'name', // Student First Name
  MIDDLE_NAME: 'middle_name', // Student Middle Name
  LAST_NAME: 'last_name', // Student Last Name
  PHONE_NUMBER: 'phone_number', // Phone Number
  EMAIL: 'email', // Student Email
  GENDER: 'gender', // Student Gender
  DATE_OF_BIRTH: 'date_of_birth', // Student Date of Birth
  FATHER_NAME: 'father_name', // Student's Father Name
  MOTHER_NAME: 'mother_name', // Student's Mother Name
  STANDARD: 'standard', // Standard/Class
  ENROLLMENT_NUMBER: 'enrollment_number', // Student Enrollment Number
  BLOOD_GROUP: 'blood_group',
  SECTION: 'section', // Student's Section
  ADMISSION_DATE: 'admission_timestamp', // Student Date of Admission
  ROLL_NUMBER: 'roll_number', // Student's Roll Number,

  ADDRESS: 'address', // Student's Address,
  TRANSPORT_WAYPOINT: 'transport_waypoint', // Transport Waypoint
  PERMANENT_ADDRESS_1: 'p_line_1', // Permanent Address 1
  PERMANENT_ADDRESS_2: 'p_line_2', // Permanent Address 2
  PERMANENT_ADDRESS_CITY: 'p_city', // Permanent Address City
  PERMANENT_ADDRESS_STATE: 'p_state', // Permanent Address State
  PERMANENT_ADDRESS_PIN: 'p_pin', // Permanent Address Pin
  PERMANENT_ADDRESS_COUNTRY: 'p_country', // Permanent Address Country,
  CURRENT_ADDRESS_1: 'c_line_1', // Current Address 1
  CURRENT_ADDRESS_2: 'c_line_2', // Current Address 2
  CURRENT_ADDRESS_CITY: 'c_city', // Current Address City
  CURRENT_ADDRESS_STATE: 'c_state', // Current Address State
  CURRENT_ADDRESS_PIN: 'c_pin', // Current Address Pin
  CURRENT_ADDRESS_COUNTRY: 'c_country', // Current Address Country,

  MOTHER_PHONE_NUMBER: 'mother_contact_number', // Mother Phone Number,
  MOTHER_EMAIL: 'mother_email', // Mother Email Id,
  MOTHER_QUALIFICATION: 'mother_qualification', // Mother Qualification,
  MOTHER_OCCUPATION: 'mother_occupation', // Mother Occupation,
  MOTHER_OFFICE_CONTACT: 'mother_work_contact', // Mother Office Contact,
  MOTHER_INCOME: 'mother_income', // Mother Annual Income,
  MOTHER_DESIGNATION: 'mother_designation', // Mother Designation,
  MOTHER_WORK_ORGANIZATION: 'mother_work_organization', // Mother Work Organization Name,
  FATHER_PHONE_NUMBER: 'father_contact_number', // Father Phone Number,
  FATHER_EMAIL: 'father_email', // Father Email Id,
  FATHER_QUALIFICATION: 'father_qualification', // Father Qualification,
  FATHER_OCCUPATION: 'father_occupation', // Father Occupation,
  FATHER_OFFICE_CONTACT: 'father_work_contact', // Father Office Contact,
  FATHER_INCOME: 'father_income', // Father Annual Income,
  FATHER_DESIGNATION: 'father_designation', // Father Designation,
  FATHER_WORK_ORGANIZATION: 'father_work_organization', // Father Work Organization Name,
  GUARDIAN_NAME: 'guardian_name', // Gaurdian Name,
  GUARDIAN_PHONE_NUMBER: 'guardian_contact_number', // Gaurdian Phone Number,
  GUARDIAN_EMAIL: 'guardian_email', // Gaurdian  Email Id,
  GUARDIAN_QUALIFICATION: 'guardian_qualification', // Gaurdian  Qualification,
  GUARDIAN_OCCUPATION: 'guardian_occupation', // Gaurdian  Occupation,
  GUARDIAN_OFFICE_CONTACT: 'guardian_work_contact', // Gaurdian  Office Contact,
  GUARDIAN_INCOME: 'guardian_income', // Gaurdian Annual Income,
  GUARDIAN_DESIGNATION: 'guardian_designation', // Gaurdian Designation,
  GUARDIAN_WORK_ORGANIZATION: 'guardian_work_organization', // Gaurdian Work Organization Name,
  GUARDIAN_RELATIONSHIP: 'guardian_relationship', // Gaurdian Relationship,
}

export const ENQUIRY_FORM_KEYS = [
  staticImisFields.NAME,
  staticImisFields.MIDDLE_NAME,
  staticImisFields.LAST_NAME,
  staticImisFields.PHONE_NUMBER,
  staticImisFields.DATE_OF_BIRTH,
  staticImisFields.GENDER,
  staticImisFields.BLOOD_GROUP,
  staticImisFields.EMAIL,
  staticImisFields.STANDARD,

  staticImisFields.FATHER_NAME,
  staticImisFields.FATHER_PHONE_NUMBER,
  staticImisFields.FATHER_EMAIL,
  staticImisFields.FATHER_QUALIFICATION,
  staticImisFields.FATHER_DESIGNATION,
  staticImisFields.FATHER_OCCUPATION,
  staticImisFields.FATHER_INCOME,
  staticImisFields.FATHER_WORK_ORGANIZATION,

  staticImisFields.MOTHER_NAME,
  staticImisFields.MOTHER_PHONE_NUMBER,
  staticImisFields.MOTHER_EMAIL,
  staticImisFields.MOTHER_QUALIFICATION,
  staticImisFields.MOTHER_DESIGNATION,
  staticImisFields.MOTHER_OCCUPATION,
  staticImisFields.MOTHER_INCOME,
  staticImisFields.MOTHER_WORK_ORGANIZATION,

  staticImisFields.CURRENT_ADDRESS_1,
  staticImisFields.CURRENT_ADDRESS_2,
  staticImisFields.CURRENT_ADDRESS_CITY,
  staticImisFields.CURRENT_ADDRESS_STATE,
  staticImisFields.CURRENT_ADDRESS_PIN,
  staticImisFields.CURRENT_ADDRESS_COUNTRY,

  staticImisFields.GUARDIAN_NAME,
  staticImisFields.GUARDIAN_PHONE_NUMBER,
  staticImisFields.GUARDIAN_EMAIL,
  staticImisFields.GUARDIAN_QUALIFICATION,
  staticImisFields.GUARDIAN_DESIGNATION,
  staticImisFields.GUARDIAN_OCCUPATION,
  staticImisFields.GUARDIAN_INCOME,
  staticImisFields.GUARDIAN_WORK_ORGANIZATION,
]

export const modifiedImisFieldLabels = {
  [staticImisFields.NAME]: t('studentFirstNameImisFieldLabel'),
  [staticImisFields.MIDDLE_NAME]: t('studentMiddleNameImisFieldLabel'),
  [staticImisFields.LAST_NAME]: t('studentLastNameImisFieldLabel'),
  [staticImisFields.STANDARD]: t('studentStandardImisFieldLabel'),

  [staticImisFields.FATHER_NAME]: t('fatherNameImisFieldLabel'),
  [staticImisFields.FATHER_PHONE_NUMBER]: t('fatherPhoneImisFieldLabel'),
  [staticImisFields.FATHER_EMAIL]: t('fatherEmailImisFieldLabel'),
  [staticImisFields.FATHER_OCCUPATION]: t('fatherOccupationImisFieldLabel'),
  [staticImisFields.FATHER_DESIGNATION]: t('fatherDesignationImisFieldLabel'),
  [staticImisFields.FATHER_INCOME]: t('fatherAnnualIncomeImisFieldLabel'),
  [staticImisFields.FATHER_QUALIFICATION]: t(
    'fatherQualificationImisFieldLabel'
  ),
  [staticImisFields.FATHER_OFFICE_CONTACT]: t(
    'fatherOfficeContactImisFieldLabel'
  ),
  [staticImisFields.FATHER_WORK_ORGANIZATION]: t(
    'fatherOrganizationNameImisFieldLabel'
  ),

  [staticImisFields.MOTHER_NAME]: t('motherNameImisFieldLabel'),
  [staticImisFields.MOTHER_PHONE_NUMBER]: t('motherPhoneImisFieldLabel'),
  [staticImisFields.MOTHER_EMAIL]: t('motherEmailImisFieldLabel'),
  [staticImisFields.MOTHER_OCCUPATION]: t('motherOccupationImisFieldLabel'),
  [staticImisFields.MOTHER_DESIGNATION]: t('motherDesignationImisFieldLabel'),
  [staticImisFields.MOTHER_INCOME]: t('motherAnnualIncomeImisFieldLabel'),
  [staticImisFields.MOTHER_QUALIFICATION]: t(
    'motherQualificationImisFieldLabel'
  ),
  [staticImisFields.MOTHER_OFFICE_CONTACT]: t(
    'motherOfficeContactImisFieldLabel'
  ),
  [staticImisFields.MOTHER_WORK_ORGANIZATION]: t(
    'motherOrganizationNameImisFieldLabel'
  ),

  [staticImisFields.GUARDIAN_NAME]: t('guardianNameImisFieldLabel'),
  [staticImisFields.GUARDIAN_PHONE_NUMBER]: t('guardianPhoneImisFieldLabel'),
  [staticImisFields.GUARDIAN_EMAIL]: t('guardianEmailImisFieldLabel'),
  [staticImisFields.GUARDIAN_OCCUPATION]: t('guardianOccupationImisFieldLabel'),
  [staticImisFields.GUARDIAN_DESIGNATION]: t(
    'guardianDesignationImisFieldLabel'
  ),
  [staticImisFields.GUARDIAN_INCOME]: t('guardianAnnualIncomeImisFieldLabel'),
  [staticImisFields.GUARDIAN_QUALIFICATION]: t(
    'guardianQualificationImisFieldLabel'
  ),
  [staticImisFields.GUARDIAN_OFFICE_CONTACT]: t(
    'guardianOfficeContactImisFieldLabel'
  ),
  [staticImisFields.GUARDIAN_WORK_ORGANIZATION]: t(
    'guardianOrganizationNameImisFieldLabel'
  ),
  [staticImisFields.GUARDIAN_RELATIONSHIP]: t(
    'guardianRelationshipImisFieldLabel'
  ),
}

export const enquiryFormFields = [
  staticImisFields.NAME,
  staticImisFields.MIDDLE_NAME,
  staticImisFields.LAST_NAME,
  staticImisFields.PHONE_NUMBER,
  staticImisFields.EMAIL,
  staticImisFields.GENDER,
  staticImisFields.DATE_OF_BIRTH,
  staticImisFields.FATHER_NAME,
  staticImisFields.MOTHER_NAME,
  staticImisFields.STANDARD,
]

export const permanentAddressFields = [
  staticImisFields.PERMANENT_ADDRESS_1,
  staticImisFields.PERMANENT_ADDRESS_2,
  staticImisFields.PERMANENT_ADDRESS_CITY,
  staticImisFields.PERMANENT_ADDRESS_STATE,
  staticImisFields.PERMANENT_ADDRESS_PIN,
  staticImisFields.PERMANENT_ADDRESS_COUNTRY,
]

export const currentAddressFields = [
  staticImisFields.CURRENT_ADDRESS_1,
  staticImisFields.CURRENT_ADDRESS_2,
  staticImisFields.CURRENT_ADDRESS_CITY,
  staticImisFields.CURRENT_ADDRESS_STATE,
  staticImisFields.CURRENT_ADDRESS_PIN,
  staticImisFields.CURRENT_ADDRESS_COUNTRY,
]

export const confirmAdmissionDisabledFields = [
  staticImisFields.PHONE_NUMBER,
  staticImisFields.STANDARD,
]

export const confirmAdmissionRequiredFields = [
  staticImisFields.ENROLLMENT_NUMBER,
  staticImisFields.ADMISSION_DATE,
  staticImisFields.SECTION,
]

export const confirmAdmissionNonvisibleFields = [
  staticImisFields.ROLL_NUMBER,
  staticImisFields.TRANSPORT_WAYPOINT,
]

export const admissionFormSettingsHiddenFields = [
  staticImisFields.ENROLLMENT_NUMBER,
  staticImisFields.ADMISSION_DATE,
  staticImisFields.SECTION,
  staticImisFields.ROLL_NUMBER,
  staticImisFields.TRANSPORT_WAYPOINT,
]

export const admissionFormDefaultFields = [
  staticImisFields.NAME,
  staticImisFields.PHONE_NUMBER,
  staticImisFields.STANDARD,
]

export const onboardingFlowStepsId = {
  SESSION: 'SESSION',
  LEAD_STAGES: 'LEAD_STAGES',
  WEB_PAGE: 'WEB_PAGE',
  ENQUIRY_FORM: 'ENQUIRY_FORM',
  ADMISSION_FORM: 'ADMISSION_FORM',
  DOCUMENTS: 'DOCUMENTS',
  FEES: 'FEES',
}

export const onboardingFlowStepsSequence = [
  onboardingFlowStepsId.SESSION,
  onboardingFlowStepsId.LEAD_STAGES,
  onboardingFlowStepsId.WEB_PAGE,
  onboardingFlowStepsId.ENQUIRY_FORM,
  onboardingFlowStepsId.ADMISSION_FORM,
  onboardingFlowStepsId.DOCUMENTS,
  onboardingFlowStepsId.FEES,
]

export const onboardingFlowStepsWeightage = {
  [onboardingFlowStepsId.SESSION]: 10,
  [onboardingFlowStepsId.LEAD_STAGES]: 10,
  [onboardingFlowStepsId.WEB_PAGE]: 30,
  [onboardingFlowStepsId.ENQUIRY_FORM]: 10,
  [onboardingFlowStepsId.ADMISSION_FORM]: 10,
  [onboardingFlowStepsId.DOCUMENTS]: 10,
  [onboardingFlowStepsId.FEES]: 20,
}

export const defaultOnboardingFlowStepsProgress = {
  [onboardingFlowStepsId.SESSION]: false,
  [onboardingFlowStepsId.LEAD_STAGES]: false,
  [onboardingFlowStepsId.WEB_PAGE]: false,
  [onboardingFlowStepsId.ENQUIRY_FORM]: false,
  [onboardingFlowStepsId.ADMISSION_FORM]: false,
  [onboardingFlowStepsId.DOCUMENTS]: false,
  [onboardingFlowStepsId.FEES]: false,
}

export const sessionData = {
  id: onboardingFlowStepsId.SESSION,
  title: t('sessionStepTitle'),
  description: t('sessionStepDescription'),
  settingsDescription: t('sessionStepDescription'),
  icon: 'calendarToday',
  className: 'session',
  mandatorySteps: [],
  size: MODAL_CONSTANTS.SIZE.MEDIUM,
  settingsKey: 'enable_session',
  defaultFormData: {
    session_id: '',
    enabled_node_ids: [],
  },
}

export const leadStageData = {
  id: onboardingFlowStepsId.LEAD_STAGES,
  title: t('leadStageStepTitle'),
  description: t('leadStageStepDescription'),
  settingsDescription: t('leadStageStepDescription'),
  icon: 'mediation',
  className: 'leadStage',
  mandatorySteps: [onboardingFlowStepsId.SESSION],
  size: MODAL_CONSTANTS.SIZE.LARGE,
  settingsKey: 'lead_stages',
  defaultFormData: {
    1: {
      name: t('enquiryStage'),
      sequence_no: 1,
    },
    2: {
      name: t('interestedStage'),
      sequence_no: 2,
    },
    3: {
      name: t('shortlistedStage'),
      sequence_no: 3,
    },
    4: {
      name: t('rejectedStage'),
      sequence_no: 4,
    },
    5: {
      name: t('confirmedStage'),
      sequence_no: 5,
    },
  },
}

export const webConfigData = {
  id: onboardingFlowStepsId.WEB_PAGE,
  title: t('webpageStepTitle'),
  description: t('webpageStepDescription'),
  settingsDescription: t('webpageSettingsPageDescription'),
  icon: 'wysiwyg',
  className: 'webpage',
  mandatorySteps: [onboardingFlowStepsId.SESSION],
  size: MODAL_CONSTANTS.SIZE.LARGE,
  settingsKey: 'enquiry_portal',
  defaultFormData: {
    domain_url: '',
    instructions: {
      heading: t('webPageInstructionsHeadingDefaultText'),
      text: t('webPageInstructionsDefaultText'),
    },
  },
}

export const enquiryFormData = {
  id: onboardingFlowStepsId.ENQUIRY_FORM,
  title: t('enquiryFormStepTitle'),
  description: t('enquiryFormStepDescription'),
  settingsDescription: t('enquiryFormSettingsPageDescription'),
  icon: 'alignLeft',
  className: 'enquiryForm',
  mandatorySteps: [onboardingFlowStepsId.SESSION],
  size: MODAL_CONSTANTS.SIZE.LARGE,
  settingsKey: 'enquiry_portal',
  defaultFormData: {
    declaration: {
      display: true,
      text: t('enquiryFormDeclarationDefaultText'),
    },
    profile_fields: {},
  },
}

export const admissionFormData = {
  id: onboardingFlowStepsId.ADMISSION_FORM,
  title: t('admissionFormStepTitle'),
  description: t('admissionFormStepDescription'),
  settingsDescription: t('admissionFormSettingsPageDescription'),
  icon: 'numberedList',
  className: 'admissionForm',
  mandatorySteps: [onboardingFlowStepsId.SESSION],
  size: MODAL_CONSTANTS.SIZE.LARGE,
  settingsKey: 'admission_portal',
  defaultFormData: {
    profile_fields: {},
  },
}

export const documentsData = {
  id: onboardingFlowStepsId.DOCUMENTS,
  title: t('documentsStepTitle'),
  description: t('documentsStepDescription'),
  settingsDescription: t('documentsStepDescription'),
  icon: 'insertFile',
  className: 'documents',
  mandatorySteps: [onboardingFlowStepsId.SESSION],
  size: MODAL_CONSTANTS.SIZE.LARGE,
  settingsKey: 'upload_documents',
  defaultFormData: {
    profile_fields: {},
  },
}

export const feesData = {
  id: onboardingFlowStepsId.FEES,
  title: t('feesStepTitle'),
  description: t('feesStepDescription'),
  settingsDescription: t('feesStepDescription'),
  icon: 'rupeeSymbol1',
  className: 'fees',
  mandatorySteps: [
    onboardingFlowStepsId.SESSION,
    onboardingFlowStepsId.LEAD_STAGES,
  ],
  size: MODAL_CONSTANTS.SIZE.X_LARGE,
  settingsKey: 'fee_settings',
  defaultFormData: {
    form_fees_required: false,
    admission_fees_required: false,
    form_fees: {
      class_fees: {},
      receipt_prefix: '',
      receipt_starting_number: '',
    },
    admission_fees: {
      collect_fee_stage_id: '',
      class_fees: {},
      receipt_prefix: '',
      receipt_starting_number: '',
    },
  },
}

export const onboardingFlowSteps = {
  [onboardingFlowStepsId.SESSION]: sessionData,
  [onboardingFlowStepsId.LEAD_STAGES]: leadStageData,
  [onboardingFlowStepsId.WEB_PAGE]: webConfigData,
  [onboardingFlowStepsId.ENQUIRY_FORM]: enquiryFormData,
  [onboardingFlowStepsId.ADMISSION_FORM]: admissionFormData,
  [onboardingFlowStepsId.DOCUMENTS]: documentsData,
  [onboardingFlowStepsId.FEES]: feesData,
}

export const FEES_STEPPER_IDS = {
  FORM_FEE: 'FORM_FEE',
  ADMISSION_FEE: 'ADMISSION_FEE',
}

export const FEES_STEPPER_SEQUENCE = [
  FEES_STEPPER_IDS.FORM_FEE,
  FEES_STEPPER_IDS.ADMISSION_FEE,
]

export const admissionFormStepIds = {
  FILL_FORM: 'FILL_FORM',
  UPLOAD_DOCUMENT: 'UPLOAD_DOCUMENT',
  RECORD_FEES: 'RECORD_FEES',
  SELECT_STAGE: 'SELECT_STAGE',
}

export const admissionFormStepSequence = [
  admissionFormStepIds.FILL_FORM,
  admissionFormStepIds.UPLOAD_DOCUMENT,
  admissionFormStepIds.RECORD_FEES,
  admissionFormStepIds.SELECT_STAGE,
]

export const admissionFormStepSequenceWithoutFees = [
  admissionFormStepIds.FILL_FORM,
  admissionFormStepIds.UPLOAD_DOCUMENT,
  admissionFormStepIds.SELECT_STAGE,
]

export const admissionFormStepSequenceProfileManagement = [
  admissionFormStepIds.FILL_FORM,
  admissionFormStepIds.UPLOAD_DOCUMENT,
  admissionFormStepIds.RECORD_FEES,
]

export const admissionFormStepSequenceProfileManagementViewForm = [
  admissionFormStepIds.FILL_FORM,
  admissionFormStepIds.UPLOAD_DOCUMENT,
]

export const defaultAdmissionFormSteps = {
  [admissionFormStepIds.FILL_FORM]: {
    id: admissionFormStepIds.FILL_FORM,
    title: t('fillForm'),
    description: '',
    status: 'IN_PROGRESS',
  },
  [admissionFormStepIds.UPLOAD_DOCUMENT]: {
    id: admissionFormStepIds.UPLOAD_DOCUMENT,
    title: t('uploadDocument'),
    description: '',
    status: 'NOT_STARTED',
  },
  [admissionFormStepIds.RECORD_FEES]: {
    id: admissionFormStepIds.RECORD_FEES,
    title: t('recordFees'),
    description: '',
    status: 'NOT_STARTED',
  },
  [admissionFormStepIds.SELECT_STAGE]: {
    id: admissionFormStepIds.SELECT_STAGE,
    title: t('selectStage'),
    description: '',
    status: 'NOT_STARTED',
  },
}

export const defaultAdmissionFormStepsWithoutFees = {
  [admissionFormStepIds.FILL_FORM]: {
    id: admissionFormStepIds.FILL_FORM,
    title: t('fillForm'),
    description: '',
    status: 'IN_PROGRESS',
  },
  [admissionFormStepIds.UPLOAD_DOCUMENT]: {
    id: admissionFormStepIds.UPLOAD_DOCUMENT,
    title: t('uploadDocument'),
    description: '',
    status: 'NOT_STARTED',
  },
  [admissionFormStepIds.SELECT_STAGE]: {
    id: admissionFormStepIds.SELECT_STAGE,
    title: t('selectStage'),
    description: '',
    status: 'NOT_STARTED',
  },
}

export const defaultAdmissionFormStepsProfileManagement = {
  [admissionFormStepIds.FILL_FORM]: {
    id: admissionFormStepIds.FILL_FORM,
    title: t('fillForm'),
    description: '',
    status: 'IN_PROGRESS',
  },
  [admissionFormStepIds.UPLOAD_DOCUMENT]: {
    id: admissionFormStepIds.UPLOAD_DOCUMENT,
    title: t('uploadDocument'),
    description: '',
    status: 'NOT_STARTED',
  },
  [admissionFormStepIds.RECORD_FEES]: {
    id: admissionFormStepIds.RECORD_FEES,
    title: t('recordFees'),
    description: '',
    status: 'NOT_STARTED',
  },
}

export const defaultAdmissionFormStepsProfileManagementViewForm = {
  [admissionFormStepIds.FILL_FORM]: {
    id: admissionFormStepIds.FILL_FORM,
    title: t('fillForm'),
    description: '',
    status: 'IN_PROGRESS',
  },
  [admissionFormStepIds.UPLOAD_DOCUMENT]: {
    id: admissionFormStepIds.UPLOAD_DOCUMENT,
    title: t('uploadDocument'),
    description: '',
    status: 'NOT_STARTED',
  },
}

export const feeTypeStatus = {
  [FEES_STEPPER_IDS.FORM_FEE]: {label: 'Form Fees', type: 'warning'},
  [FEES_STEPPER_IDS.ADMISSION_FEE]: {label: 'Admission Fees', type: 'success'},
}

export const feeTypes = {
  [FEES_STEPPER_IDS.FORM_FEE]: t('feesStepperLabelFormFees'),
  [FEES_STEPPER_IDS.ADMISSION_FEE]: t('feesStepperLabelAdmissionFees'),
}

export const feeType = {
  enquiry: FEES_STEPPER_IDS.FORM_FEE,
  admission: FEES_STEPPER_IDS.ADMISSION_FEE,
}

export const formStatus = {
  INCOMPLETE: 'INCOMPLETE',
  COMPLETE: 'COMPLETE',
}

export const paymentMode = {
  CASH: t('cash'),
  CHEQUE: t('cheque'),
  DD: t('dd'),
  ONLINE: t('online'),
  BANK_TRANSFER: t('bankTransfer'),
  UPI: t('UpiTextInCapital'),
  POS: t('POS'),
  CHALLAN: t('challan'),
  OTHERS: t('others'),
}

export const dateDurationKeys = {
  LASTWEEK: 'LASTWEEK',
  LASTMONTH: 'LASTMONTH',
  CUSTOMDATERANGE: 'CUSTOMDATERANGE',
}

export const dateDurationFilter = {
  [dateDurationKeys.LASTWEEK]: {
    id: dateDurationKeys.LASTWEEK,
    label: t('lastWeek'),
  },
  [dateDurationKeys.LASTMONTH]: {
    id: dateDurationKeys.LASTMONTH,
    label: t('lastMonth'),
  },
  [dateDurationKeys.CUSTOMDATERANGE]: {
    id: dateDurationKeys.CUSTOMDATERANGE,
    label: t('CustomDateRange'),
  },
}

export const filterLables = {
  classes: t('classes'),
  feeTypes: t('tableFieldsFeeType'),
  paymentModes: t('filterPaymentModes'),
  paymentStatus: t('admissionCrmPaymentStatus'),
}

export const filters = {
  classes: 'classes',
  feeTypes: 'feeTypes',
  paymentModes: 'paymentModes',
  paymentStatus: 'paymentStatus',
}

export const admissionCrmFormType = {
  ENQUIRY_FORM: 'ENQUIRY_FORM',
  ADMISSION_FORM: 'ADMISSION_FORM',
}

export const crmFormType = {
  ENQUIRY: 'ENQUIRY',
  ADMISSION: 'ADMISSION',
}

export const admissionCrmFormTypes = {
  [admissionCrmFormType.ENQUIRY_FORM]: {
    id: admissionCrmFormType.ENQUIRY_FORM,
    label: t('addNewLeadOptionEnquiryForm'),
  },
  [admissionCrmFormType.ADMISSION_FORM]: {
    id: admissionCrmFormType.ADMISSION_FORM,
    label: t('addNewLeadOptionAdmissionForm'),
  },
}

export const admissionCrmFieldTypes = {
  ENQUIRY_FORM: 'enquiry',
  ADMISSION_FORM: 'admission',
}

export const crmFormEnableFields = {
  ENQUIRY_FORM: admissionCrmFieldTypes.ENQUIRY_FORM,
  ADMISSION_FORM: admissionCrmFieldTypes.ADMISSION_FORM,
}

export const admissionPaymentStatus = {
  SELECT_PAYMENT_METHOD: 'select payment method',
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
  DD: 'DD',
  // ONLINE: 'Online (PG)',
  ONLINE: 'ONLINE',
  BANK_TRANSFER: 'BANK_TRANSFER',
  UPI: 'UPI',
  POS: 'POS',
  CHALLAN: 'CHALLAN',
  OTHERS: 'OTHERS',
}

export const admissionPaymentStatusLabels = [
  {
    value: admissionPaymentStatus.CASH,
    label: t('cash'),
  },
  {
    value: admissionPaymentStatus.CHEQUE,
    label: t('cheque'),
  },
  {
    value: admissionPaymentStatus.DD,
    label: t('dd'),
  },
  {
    value: admissionPaymentStatus.BANK_TRANSFER,
    label: t('bankTransferNeft'),
  },
  {
    value: admissionPaymentStatus.UPI,
    label: t('UpiTextInCapital'),
  },
  {
    value: admissionPaymentStatus.POS,
    label: t('POS'),
  },
  {
    value: admissionPaymentStatus.CHALLAN,
    label: t('challan'),
  },
  {
    value: admissionPaymentStatus.OTHERS,
    label: t('others'),
  },
]

export const admissionSimplePaymentModes = [
  admissionPaymentStatus.CASH,
  admissionPaymentStatus.BANK_TRANSFER,
  admissionPaymentStatus.UPI,
  admissionPaymentStatus.POS,
  admissionPaymentStatus.CHALLAN,
  admissionPaymentStatus.OTHERS,
]

export const admissionBankTransactionModes = {
  RECEIVED: 'RECEIVED',
  DEPOSITED: 'DEPOSITED',
  CLEARED: 'CLEARED',
  BOUNCED: 'BOUNCED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED',
}

export const admissionBankTransactionFilterModes = {
  RECEIVED: 'Received',
  DEPOSITED: 'Deposited',
  CLEARED: 'Cleared',
  BOUNCED: 'Bounced',
  RETURNED: 'Returned',
  CANCELLED: 'Cancelled',
}

export const admissionTransactionMethods = {
  PENDING: 'PENDING',
  RECEIVED: 'RECEIVED',
  CLEARED: 'CLEARED',
  APPROVED: 'APPROVED',
}

export const admissionChequeStatus = [
  {
    value: admissionTransactionMethods.RECEIVED,
    label:
      admissionBankTransactionFilterModes[admissionTransactionMethods.RECEIVED],
  },
  {
    value: admissionTransactionMethods.CLEARED,
    label:
      admissionBankTransactionFilterModes[admissionTransactionMethods.CLEARED],
  },
]

export const admissionStudentFeeStatus = {
  ALL: t('all'),
  PAID: t('paid'),
  DUE: t('due'),
}

export const buttonObject = [
  {
    prefixIcon: 'add',
    suffixIcon: 'downArrow',
    children: t('addNewLead'),
  },
]

export const admissionStepperStatus = {
  COMPLETED: 'COMPLETED',
  IN_PROGRESS: 'IN_PROGRESS',
}

export const defaultKanbanBoardFilters = {
  classes: [],
  dateRange: {
    startDate: DateTime.now().minus({months: 1}).toSeconds(),
    endDate: DateTime.now().endOf('month').toSeconds(),
  },
  enquiryType: [],
  admissionFormStatus: [],
  formFee: [],
  admissionFee: [],
}

export const kanbanBoardFilterChipsLabel = {
  classes: t('kanbanBoardFilterChipsLabelClasses'),
  dateRange: t('kanbanBoardFilterChipsLabelDateRange'),
  enquiryType: t('kanbanBoardFilterChipsLabelEnquiryType'),
  admissionFormStatus: t('kanbanBoardFilterChipsLabelAdmissionFormStatus'),
  formFee: t('kanbanBoardFilterChipsLabelFormFee'),
  admissionFee: t('kanbanBoardFilterChipsLabelAdmissionFee'),
}

export const kanbanBoardFilterTabIds = {
  CLASSES: 'CLASSES',
  OTHER_FILTERS: 'OTHER_FILTERS',
}

export const kanbanBoardFilterTabs = {
  [kanbanBoardFilterTabIds.CLASSES]: {
    id: kanbanBoardFilterTabIds.CLASSES,
    label: t('kanbanBoardFilterTabClass'),
  },
  [kanbanBoardFilterTabIds.OTHER_FILTERS]: {
    id: kanbanBoardFilterTabIds.OTHER_FILTERS,
    label: t('kanbanBoardFilterTabOtherFilters'),
  },
}

export const kanbanBoardOtherFilterOptionlabels = {
  ONLINE: t('kanbanBoardOtherFilterOptionlabelOnline'),
  OFFLINE: t('kanbanBoardOtherFilterOptionlabelOffline'),
  COMPLETE: t('kanbanBoardOtherFilterOptionlabelComplete'),
  INCOMPLETE: t('kanbanBoardOtherFilterOptionlabelIncomplete'),
  PAID: t('kanbanBoardOtherFilterOptionlabelPaid'),
  NOT_PAID: t('kanbanBoardOtherFilterOptionlabelNotPaid'),
}

export const kanbanBoardOtherFilterOptionValues = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  COMPLETED: 'COMPLETED',
  INCOMPLETE: 'INCOMPLETE',
  PAID: 'PAID',
  NOT_PAID: 'NOT_PAID',
}

export const kanbanCardLeadOptions = {
  FOLLOW_UPS: 'FOLLOW_UPS',
  SEND_SMS: 'SEND_SMS',
  CONFIRM_ADMISSION: 'CONFIRM_ADMISSION',
  DELETE_LEAD: 'DELETE_LEAD',
}

export const paymentStatusSequence = {
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
}

export const paymentStatus = {
  [paymentStatusSequence.FAILED]: t('paymentStatusFailed'),
  [paymentStatusSequence.PENDING]: t('paymentStatusPending'),
  [paymentStatusSequence.SUCCESS]: t('paymentStatusSuccess'),
}

export const feeStatus = {
  [paymentStatusSequence.FAILED]: {
    label: t('paymentStatusFailed'),
    type: 'error',
  },
  [paymentStatusSequence.PENDING]: {
    label: t('paymentStatusPending'),
    type: 'warning',
  },
  [paymentStatusSequence.SUCCESS]: {
    label: t('paymentStatusSuccess'),
    type: 'success',
  },
}

export const admissionCrmFollowupStatus = {
  COMPLETED: 'COMPLETED',
  MISSED: 'MISSED',
  PENDING: 'PENDING',
}

export const followUpsTabIds = {
  ALL: 'ALL',
  MISSED: 'MISSED',
  PLANNED: 'PLANNED',
  COMPLETED: 'COMPLETED',
}

export const followUpsTabs = {
  [followUpsTabIds.ALL]: {
    id: followUpsTabIds.ALL,
    label: t('followUpsTabsLabelAll'),
  },
  [followUpsTabIds.MISSED]: {
    id: followUpsTabIds.MISSED,
    label: t('followUpsTabsLabelMissed'),
  },
  [followUpsTabIds.PLANNED]: {
    id: followUpsTabIds.PLANNED,
    label: t('followUpsTabsLabelPlanned'),
  },
  [followUpsTabIds.COMPLETED]: {
    id: followUpsTabIds.COMPLETED,
    label: t('followUpsTabsLabelCompleted'),
  },
}

export const progressTrackerLabels = {
  ENQUIRY_STARTED: t('enquiryStarted'),
  FORM_FEE: t('formFee'),
  APPLICATION_FORM: t('admissionForm'),
  DOCUMENT_UPLOAD: t('documentUpload'),
  ADMISSION_FEE: t('admissionFee'),
  ADMITTED: t('admitted'),
}

export const feeStatusLeadProfile = {
  PAID: t('feeStatusPaid'),
  PENDING: t('feeStatusPending'),
}

export const admissionFormLeadProfileStatus = {
  COMPLETED: 'COMPLETED',
  INCOMPLETE: 'INCOMPLETE',
}

export const collectFeeModalTitle = {
  [admissionCrmFieldTypes.ENQUIRY_FORM]: t('feesStepperLabelFormFees'),
  [admissionCrmFieldTypes.ADMISSION_FORM]: t('feesStepperLabelAdmissionFees'),
}

export const recentActivityEvents = {
  // CRM_FOLLOWUP_CREATED: 'CRM:CRM_FOLLOWUP_CREATED',
  CRM_FOLLOWUP_CREATED: 'CRM:FOLLOWUP_CREATED',
  CRM_FOLLOWUP_UPDATED: 'CRM:FOLLOWUP_UPDATED',
  CRM_FOLLOWUP_COMPLETED: 'CRM:FOLLOWUP_COMPLETED',
  CRM_LEAD_ADDED: 'CRM:LEAD_ADDED',
  CRM_LEAD_ADMIN_ADDED: 'CRM:LEAD_ADMIN_ADDED',
  CRM_LEAD_LOGIN: 'CRM:LEAD_LOGIN',
  CRM_LEAD_LOGOUT: 'CRM:LEAD_LOGOUT',
  CRM_ADMISSION_CONFORMED: 'CRM:ADMISSION_CONFIRMED',
  CRM_FORM_FEE_PAID: 'CRM:ADMIN_FORM_FEE_PAID',
  CRM_ADMISSION_FEE_PAID: 'CRM:ADMIN_ADMISSION_FEE_PAID',
  CRM_FORM_FEE_FAILED: 'CRM:FORM_FEE_FAILED',
  CRM_ADMISSION_FEE_FAILED: 'CRM:ADMISSION_FEE_FAILED',
  CRM_FORM_FEE_PAID_LEAD: 'CRM:FORM_FEE_PAID',
  CRM_ADMISSION_FEE_PAID_LEAD: 'CRM:ADMISSION_FEE_PAID',
  CRM_LEAD_STAGE_UPDATED: 'CRM:LEAD_STAGE_UPDATED',
  CRM_LEAD_PROFILE_UPDATED: 'CRM:LEAD_PROFILE_UPDATED',
  CRM_ADMISSION_FORM_FILLED: 'CRM:LEAD_ADMISSION_FORM_FILLED',
  CRM_ADMISSION_SEND_SMS: 'CRM:ADMIN_SEND_SMS',
}

export const recentActivityTypes = {
  [recentActivityEvents.CRM_FOLLOWUP_CREATED]: {
    TYPE: recentActivityEvents.CRM_FOLLOWUP_CREATED,
    SENTENCE: 'leadProfileRecentActivityEventFollowupCreated',
  },
  [recentActivityEvents.CRM_FOLLOWUP_UPDATED]: {
    TYPE: recentActivityEvents.CRM_FOLLOWUP_UPDATED,
    SENTENCE: 'leadProfileRecentActivityEventFollowupUpdated',
  },
  [recentActivityEvents.CRM_FOLLOWUP_COMPLETED]: {
    TYPE: recentActivityEvents.CRM_FOLLOWUP_COMPLETED,
    SENTENCE: 'leadProfileRecentActivityEventFollowupCompleted',
  },
  [recentActivityEvents.CRM_FORM_FEE_PAID]: {
    TYPE: recentActivityEvents.CRM_FORM_FEE_PAID,
    SENTENCE: 'leadProfileRecentActivityEventFormFeeCollected',
  },
  [recentActivityEvents.CRM_ADMISSION_FEE_PAID]: {
    TYPE: recentActivityEvents.CRM_ADMISSION_FEE_PAID,
    SENTENCE: 'leadProfileRecentActivityEventAdmissionFeeCollected',
  },
  [recentActivityEvents.CRM_FORM_FEE_FAILED]: {
    TYPE: recentActivityEvents.CRM_FORM_FEE_FAILED,
    SENTENCE: 'leadProfileRecentActivityEventFormFeeFailed',
  },
  [recentActivityEvents.CRM_ADMISSION_FEE_FAILED]: {
    TYPE: recentActivityEvents.CRM_ADMISSION_FEE_FAILED,
    SENTENCE: 'leadProfileRecentActivityEventAdmissionFeeFailed',
  },
  [recentActivityEvents.CRM_FORM_FEE_PAID_LEAD]: {
    TYPE: recentActivityEvents.CRM_FORM_FEE_PAID_LEAD,
    SENTENCE: 'leadProfileRecentActivityEventFormFeePaidByStudent',
  },
  [recentActivityEvents.CRM_ADMISSION_FEE_PAID_LEAD]: {
    TYPE: recentActivityEvents.CRM_ADMISSION_FEE_PAID_LEAD,
    SENTENCE: 'leadProfileRecentActivityEventAdmissionFeePaidByStudent',
  },
  [recentActivityEvents.CRM_LEAD_ADDED]: {
    TYPE: recentActivityEvents.CRM_LEAD_ADDED,
    SENTENCE: 'leadProfileRecentActivityEventStudentCreated',
  },
  [recentActivityEvents.CRM_LEAD_ADMIN_ADDED]: {
    TYPE: recentActivityEvents.CRM_LEAD_ADMIN_ADDED,
    SENTENCE: 'leadProfileRecentActivityEventLeadCreated',
  },
  [recentActivityEvents.CRM_ADMISSION_CONFORMED]: {
    TYPE: recentActivityEvents.CRM_ADMISSION_CONFORMED,
    SENTENCE: 'leadProfileRecentActivityEventAdmissionConformed',
  },
  [recentActivityEvents.CRM_LEAD_LOGIN]: {
    TYPE: recentActivityEvents.CRM_LEAD_LOGIN,
    SENTENCE: 'leadProfileRecentActivityEventLeadLogin',
  },
  [recentActivityEvents.CRM_LEAD_LOGOUT]: {
    TYPE: recentActivityEvents.CRM_LEAD_LOGOUT,
    SENTENCE: 'leadProfileRecentActivityEventLeadLogout',
  },
  [recentActivityEvents.CRM_LEAD_STAGE_UPDATED]: {
    TYPE: recentActivityEvents.CRM_LEAD_STAGE_UPDATED,
    SENTENCE: 'leadProfileRecentActivityEventLeadStageUpdated',
  },
  [recentActivityEvents.CRM_LEAD_PROFILE_UPDATED]: {
    TYPE: recentActivityEvents.CRM_LEAD_PROFILE_UPDATED,
    SENTENCE: 'leadProfileRecentActivityEventLeadProfileUpdated',
  },
  [recentActivityEvents.CRM_ADMISSION_FORM_FILLED]: {
    TYPE: recentActivityEvents.CRM_ADMISSION_FORM_FILLED,
    SENTENCE: 'leadProfileRecentActivityEventAdmissionFormFilled',
  },
  [recentActivityEvents.CRM_ADMISSION_SEND_SMS]: {
    TYPE: recentActivityEvents.CRM_ADMISSION_SEND_SMS,
    SENTENCE: 'leadProfileRecentActivityEventSendSMS',
  },
}

export const HELP_VIDEOS = {
  ADMISSION_CRM: 'https://www.youtube.com/embed/4a7yz2zc688',
}

export const downloadReportLeadListHiddenFields = [
  staticImisFields.NAME,
  staticImisFields.MIDDLE_NAME,
  staticImisFields.LAST_NAME,
  staticImisFields.PHONE_NUMBER,
  staticImisFields.STANDARD,
  staticImisFields.ENROLLMENT_NUMBER,
  staticImisFields.ADMISSION_DATE,
  staticImisFields.SECTION,
  staticImisFields.PERMANENT_ADDRESS_1,
  staticImisFields.PERMANENT_ADDRESS_2,
  staticImisFields.PERMANENT_ADDRESS_CITY,
  staticImisFields.PERMANENT_ADDRESS_STATE,
  staticImisFields.PERMANENT_ADDRESS_PIN,
  staticImisFields.PERMANENT_ADDRESS_COUNTRY,
  staticImisFields.ROLL_NUMBER,
]

export const modifiedImisFieldLabelsForDownloadReportLeadList = {
  [staticImisFields.FATHER_NAME]: t('fatherNameImisFieldLabel'),
  [staticImisFields.FATHER_PHONE_NUMBER]: t('fatherPhoneImisFieldLabel'),
  [staticImisFields.FATHER_EMAIL]: t('fatherEmailImisFieldLabel'),
  [staticImisFields.FATHER_OCCUPATION]: t('fatherOccupationImisFieldLabel'),
  [staticImisFields.FATHER_DESIGNATION]: t('fatherDesignationImisFieldLabel'),
  [staticImisFields.FATHER_INCOME]: t('fatherAnnualIncomeImisFieldLabel'),
  [staticImisFields.FATHER_QUALIFICATION]: t(
    'fatherQualificationImisFieldLabel'
  ),
  [staticImisFields.FATHER_OFFICE_CONTACT]: t(
    'fatherOfficeContactImisFieldLabel'
  ),
  [staticImisFields.FATHER_WORK_ORGANIZATION]: t(
    'fatherOrganizationNameImisFieldLabel'
  ),

  [staticImisFields.MOTHER_NAME]: t('motherNameImisFieldLabel'),
  [staticImisFields.MOTHER_PHONE_NUMBER]: t('motherPhoneImisFieldLabel'),
  [staticImisFields.MOTHER_EMAIL]: t('motherEmailImisFieldLabel'),
  [staticImisFields.MOTHER_OCCUPATION]: t('motherOccupationImisFieldLabel'),
  [staticImisFields.MOTHER_DESIGNATION]: t('motherDesignationImisFieldLabel'),
  [staticImisFields.MOTHER_INCOME]: t('motherAnnualIncomeImisFieldLabel'),
  [staticImisFields.MOTHER_QUALIFICATION]: t(
    'motherQualificationImisFieldLabel'
  ),
  [staticImisFields.MOTHER_OFFICE_CONTACT]: t(
    'motherOfficeContactImisFieldLabel'
  ),
  [staticImisFields.MOTHER_WORK_ORGANIZATION]: t(
    'motherOrganizationNameImisFieldLabel'
  ),

  [staticImisFields.GUARDIAN_NAME]: t('guardianNameImisFieldLabel'),
  [staticImisFields.GUARDIAN_PHONE_NUMBER]: t('guardianPhoneImisFieldLabel'),
  [staticImisFields.GUARDIAN_EMAIL]: t('guardianEmailImisFieldLabel'),
  [staticImisFields.GUARDIAN_OCCUPATION]: t('guardianOccupationImisFieldLabel'),
  [staticImisFields.GUARDIAN_DESIGNATION]: t(
    'guardianDesignationImisFieldLabel'
  ),
  [staticImisFields.GUARDIAN_INCOME]: t('guardianAnnualIncomeImisFieldLabel'),
  [staticImisFields.GUARDIAN_QUALIFICATION]: t(
    'guardianQualificationImisFieldLabel'
  ),
  [staticImisFields.GUARDIAN_OFFICE_CONTACT]: t(
    'guardianOfficeContactImisFieldLabel'
  ),
  [staticImisFields.GUARDIAN_WORK_ORGANIZATION]: t(
    'guardianOrganizationNameImisFieldLabel'
  ),
  [staticImisFields.GUARDIAN_RELATIONSHIP]: t(
    'guardianRelationshipImisFieldLabel'
  ),
}

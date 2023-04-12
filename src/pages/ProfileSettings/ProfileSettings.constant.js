import {t} from 'i18next'
import {events} from '../../utils/EventsConstants'

export const PROFILE_SETTINGS_TABS = [
  {
    route: 'student',
    eventName: events.STUDENT_PROFILE_SETTING_CLICKED_TFI,
    label: t('student'),
  },
  {
    route: 'staff',
    eventName: events.STAFF_PROFILE_SETTING_CLICKED_TFI,
    label: t('staff'),
  },
]

export const INSTITUTE_TYPES_INFO = {
  NONE: 0,
  SCHOOL: 1,
  COLLEGE: 2,
  TUITION: 3,
  HOBBY: 4,
}

export const PROFILE_SETTINGS_URLS = {
  STUDENT_URL: 'student',
  STAFF_URL: 'staff',
  CATEGORY_URL: 'category',
}

export const PROFILE_SETTINGS_ALL_INFO = {
  mainTitle: 'profileSettings',
}

export const PROFILE_HEADER_INFO = {
  title: t('profileInformation'),
  subTitle: t('profileInformationCategoryDesc'),
}

export const URL_PARAMS_KEYS = {
  CATEGORY: 'category',
  USER_TYPE: 'userType',
}

export const DOCUMENT_HEADER_INFO = {
  title: t('document'),
  subTitle: t('documentInformationCategoryDesc'),
}

export const PERSONA_STATUS = {
  STUDENT: {
    id: 1,
    key: 'STUDENT',
    slug: 'student',
    label: t('student'),
    mainTitle: 'profileInformation',
    subTitle: 'studentProfileInformationCategoryDesc',
    mainDocTitle: 'document',
    subDocTitle: 'studentDocumentInformationCategoryDesc',
    profileSettingsCrumbLabel: t('profileSettings'),
    profileInformationCrumbLabel: t('profileInformation'),
    documnetCrumbLabel: t('document'),
    addCustomCategoryTitle: 'addCategoryForStudentProfile',
    profilePreviewTitle: 'studentProfilePreview',

    isValueMandatoryInfoToggleText: t('makeThisFieldMandatory'),
    isValueMandatoryInfoToolTipText: t(
      'makeThisFieldMandatoryStudentTooltipText'
    ),
    isVisibleInfoToggleText: t('makeThisFieldToVisibleToStudents'),
    isVisibleInfoToolTipText: t('makeThisFieldToVisibleToStudentsToolTipText'),
    isValueEditableInfoToggleText: t('makeThisFieldEditableByStudent'),
    isValueEditableInfoToolTipText: t(
      'makeThisFieldEditableByStudentToolTipsText'
    ),
    isInActiveInfoToggleText: t('makeThisFieldInactiveStudent'),
    isInActiveInfoToolTipText: t('makeThisFieldInactiveStudentTooltipText'),

    addDocumentCategoryTitle: 'addDocumentCategoryForStudentDocuments',
    documentPreviewTitle: 'studentDocumentPreview',

    isValueMandatoryDocToggleText: t('makeThisDocumentMandatory'),
    isValueMandatoryDocToolTipText: t(
      'makeThisFieldMandatoryStudentTooltipText'
    ),
    isVisibleDocToggleText: t('makeThisDocumentToVisibleToStudents'),
    isVisibleDocToolTipText: t(
      'makeThisDocumentToVisibleToStudentsTooltipText'
    ),
    isValueEditableDocToggleText: t('makeThisDocumentEditableByStudent'),
    isValueEditableDocToolTipText: t(
      'makeThisDocumentEditableByStudentTooltipText'
    ),
    isInActiveDocToggleText: t('makeThisDocumentInActiveStudent'),
    isInActiveDocToolTipText: t('makeThisDocumentInActiveStudentTooltipText'),
  },
  STAFF: {
    id: 2,
    key: 'STAFF',
    slug: 'staff',
    label: t('staff'),
    mainTitle: 'profileInformation',
    subTitle: 'staffProfileInformationCategoryDesc',
    mainDocTitle: 'document',
    subDocTitle: 'staffDocumentInformationCategoryDesc',
    profileSettingsCrumbLabel: t('profileSettings'),
    profileInformationCrumbLabel: t('profileInformation'),
    documnetCrumbLabel: t('document'),
    addCustomCategoryTitle: 'addCategoryForStffProfile',
    profilePreviewTitle: 'staffProfilePreview',

    isValueMandatoryInfoToggleText: t('makeThisFieldMandatory'),
    isValueMandatoryInfoToolTipText: t(
      'makeThisFieldMandatoryStaffTooltipText'
    ),
    isVisibleInfoToggleText: t('makeThisFieldToVisibleToStaff'),
    isVisibleInfoToolTipText: t('makeThisFieldToVisibleToStaffToolTipText'),
    isValueEditableInfoToggleText: t('makeThisFieldEditableByStaff'),
    isValueEditableInfoToolTipText: t(
      'makeThisFieldEditableByStaffToolTipsText'
    ),
    isInActiveInfoToggleText: t('makeThisFieldInactiveStaff'),
    isInActiveInfoToolTipText: t('makeThisFieldInactiveStaffTooltipText'),

    addDocumentCategoryTitle: 'addDocumentCategoryForStaffDocuments',
    documentPreviewTitle: 'staffDocumentPreview',

    isValueMandatoryDocToggleText: t('makeThisDocumentMandatory'),
    isValueMandatoryDocToolTipText: t(
      'makeThisDocumentMandatoryStaffTooltipText'
    ),
    isVisibleDocToggleText: t('makeThisDocumentToVisibleToStaff'),
    isVisibleDocToolTipText: t('makeThisDocumentToVisibleToStaffTooltipText'),
    isValueEditableDocToggleText: t('makeThisDocumentEditableByStaff'),
    isValueEditableDocToolTipText: t(
      'makeThisDocumentEditableByStaffTooltipText'
    ),
    isInActiveDocToggleText: t('makeThisDocumentInActiveStaff'),
    isInActiveDocToolTipText: t('makeThisDocumentInActiveStaffTooltipText'),
  },
}

export const FIELD_TYPES = {
  TEXT: {
    key: 'TEXT',
    slug: 'text',
    label: 'Text Box',
    type: 'text',
  },
  DROPDOWN: {
    key: 'DROPDOWN',
    slug: 'dropdown',
    label: 'Dropdown',
    type: 'select',
  },
  DATE: {
    key: 'DATE',
    slug: 'date',
    label: 'Date',
    type: 'date',
  },
  CHECKBOX: {
    key: 'CHECKBOX',
    slug: 'checkbox',
    label: 'Checkbox',
    type: 'checkbox',
  },
  DOCUMENT: {
    key: 'DOCUMENT',
    slug: 'document',
    label: 'File upload',
    type: 'text',
  },
  EMAIL: {
    key: 'EMAIL',
    slug: 'email',
    label: 'Email',
    type: 'email',
  },
  PHONE_NUMBER: {
    key: 'PHONE_NUMBER',
    slug: 'phone_number',
    label: 'Phone Number',
    type: 'phoneNumber',
  },
  NUMBER: {
    key: 'NUMBER',
    slug: 'number',
    label: 'Number',
    type: 'number',
  },
  ENROLLMENT_ID: {
    key: 'ENROLLMENT_ID',
    slug: 'enrollment_id',
    label: 'Enrollment Id',
    label2: 'Employee Id',
    type: 'enrollmentId',
  },
}

// Field Types Object for APIs
export const FIELD_TYPES_OBJECT = [
  {value: 'TEXT', label: 'Text Box'},
  {value: 'DROPDOWN', label: 'Dropdown'},
  {value: 'DATE', label: 'Date'},
]

// File upload format options
export const FORMAT_OPTIONS = [
  {label: 'PDF', value: 'pdf'},
  {label: 'JPG/JPEG', value: 'jpeg'},
  {label: 'PNG', value: 'png'},
]

export const CATEGORY_TABLE_FIELDS_ROWS_DATA = [
  {
    fieldName: 'Mobile Number',
    fieldType: 'Text Box',
    mandatory: true,
    visibleToStudents: true,
    editableByStudents: true,
    status: '1',
  },
  {
    fieldName: 'Last Name',
    fieldType: 'Text Box',
    mandatory: true,
    visibleToStudents: true,
    editableByStudents: true,
    status: '2',
  },
  {
    fieldName: 'Class',
    fieldType: 'Text Box',
    mandatory: true,
    visibleToStudents: true,
    editableByStudents: false,
    status: '1',
  },
  {
    fieldName: 'Section',
    fieldType: 'Text Box',
    mandatory: 'true',
    visibleToStudents: true,
    editableByStudents: false,
    status: '2',
  },
]

// Get setting types, Category for information or document
export const SETTING_TYPE = {
  CATEGORY_FOR_INFO: 1,
  CATEGORY_FOR_DOCUMENT: 3,
}

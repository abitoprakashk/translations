import {t} from 'i18next'

export const IDCARD = 'IDCARD'
export const FRONT_AND_BACK = 'FRONT_AND_BACK'
export const FRONT = 'frontTemplate'
export const BACK = 'backTemplate'
export const PREVIEW = 'PREVIEW'
export const PREVIEW_SAVE = 'PREVIEW_SAVE'
export const STUDENT = 'student'
export const STAFF = 'staff'
export const ACTIVE = 'ACTIVE'
export const INACTIVE = 'INACTIVE'
export const COMPLETED = 'COMPLETED'
export const PENDING = 'PENDING'

export const ID_DESIGN = {
  FRONT: 'FRONT',
  FRONT_BACK: FRONT_AND_BACK,
}

export const STUDENT_COLS = (institutType) => [
  {key: 'personal_info', label: t('studentName')},
  {
    key: 'details',
    label: t(institutType === 'TUITION' ? 'department' : 'classSection'),
  },
  {
    key: 'status',
    label: t('status'),
  },
  {key: 'action', label: t('action')},
]

export const STAFF_COLS = () => [
  {key: 'personal_info', label: t('employeeName')},
  {key: 'details', label: t('designation')},
  {
    key: 'status',
    label: t('status'),
  },
  {key: 'action', label: t('action')},
]

export const TABLE_COLS = {
  [STUDENT]: STUDENT_COLS,
  [STAFF]: STAFF_COLS,
}

export const idPageSizeConfig = {
  A4: {
    LANDSCAPE: {height: '1240', width: '1754', scale: 0.3},
    PORTRAIT: {
      width: '1240',
      height: '1754',
      scale: 0.2,
    },
  },
  A3: {
    LANDSCAPE: {height: '1754', width: '2480', scale: 0.2},
    PORTRAIT: {
      height: '2480',
      width: '1754',
      scale: 0.17,
    },
  },
  IDCARD: {
    PORTRAIT: {height: '508', width: '319', scale: 0.4},
    LANDSCAPE: {
      height: '318',
      width: '508',
      scale: 0.8,
    },
  },
}

export const GENERATED_ID_STUDENT_COLS = (instituteType) => [
  {key: 'personalInfo', label: t('studentName')},
  {
    key: 'class',
    label: t(instituteType === 'TUITION' ? 'department' : 'classSection'),
  },
  {key: 'type', label: t('customId.templateName')},
  {key: 'generated_by', label: t('customCertificate.generatedBy')},
  {key: 'action', label: t('action')},
]

export const GENERATED_ID_STAFF_COLS = () => [
  {key: 'personalInfo', label: t('employeeName')},
  {key: 'designation', label: t('designation')},
  {key: 'type', label: t('customId.templateName')},
  {key: 'generated_by', label: t('customCertificate.generatedBy')},
  {key: 'action', label: t('action')},
]

export const GENERATED_ID_TABLE_COLS = {
  [STUDENT]: GENERATED_ID_STUDENT_COLS,
  [STAFF]: GENERATED_ID_STAFF_COLS,
}

export const TEMPLATE_STATUS = {
  COMPLETED: COMPLETED,
  PENDING: PENDING,
}

export const PURCHASE_ORDER_STATUS = {
  ORDER_PROCESSING: 'ORDER_PROCESSING',
  IN_PRINTING: 'IN_PRINTING',
  PREPARING_FOR_DISPATCH: 'PREPARING_FOR_DISPATCH',
  DISPATCHED: 'DISPATCHED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
}

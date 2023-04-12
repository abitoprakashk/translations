import {t} from 'i18next'

export const MAX_IMAGE_COUNT = 4
export const STAFF = 'staff'
export const STUDENT = 'student'
export const DOCUMENT = 'DOCUMENT'
export const CERTIFICATE = 'CERTIFICATE'

export const TAB_OPTION = [
  {
    id: STUDENT,
    label: t('students'),
  },
  {
    id: STAFF,
    label: t('staff'),
  },
]

export const DOC_CATEGORIES = {
  DOCUMENT: {
    name: t('customCertificate.documentsTemplate'),
    pageHeader: t('customCertificate.documentsTemplates'),
    archive: t('customCertificate.documentArchive'),
    keyToCheck: 'status',
    cardsInRow: 4,
  },
  CERTIFICATE: {
    name: t('customCertificate.certificateTemplates'),
    pageHeader: t('customCertificate.certificateTemplates'),
    archive: t('customCertificate.certificateArchive'),
    keyToCheck: 'default',
    cardsInRow: 4,
  },
}

export const TEMPLATE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
}

export const STUDENT_COLS = (institutType) => [
  {key: 'personal_info', label: t('studentDetails')},
  {
    key: 'details',
    label: t(institutType === 'TUITION' ? 'department' : 'classSection'),
  },
  {key: 'action', label: t('action')},
]

export const STAFF_COLS = () => [
  {key: 'personal_info', label: t('employeeDetails')},
  {key: 'details', label: t('designation')},
  {key: 'action', label: t('action')},
]

export const TABLE_COLS = {
  [STUDENT]: STUDENT_COLS,
  [STAFF]: STAFF_COLS,
}

export const USER_TYPE = {
  TEACHER: 2,
}

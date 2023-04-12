import {t} from 'i18next'

import {STUDENT, STAFF} from '../../CustomCertificate.constants'

export const STUDENT_COLS = (instituteType) => [
  {key: 'personalInfo', label: t('studentName')},
  {
    key: 'class',
    label: t(instituteType === 'TUITION' ? 'department' : 'classSection'),
  },
  {key: 'type', label: t('customCertificate.certificateDocument')},
  {key: 'generated_by', label: t('customCertificate.generatedBy')},
  {key: 'action', label: t('action')},
]

export const STAFF_COLS = () => [
  {key: 'personalInfo', label: t('employeeName')},
  {key: 'designation', label: t('designation')},
  {key: 'type', label: t('customCertificate.certificateDocument')},
  {key: 'generated_by', label: t('customCertificate.generatedBy')},
  {key: 'action', label: t('action')},
]

export const TABLE_COLS = {
  [STUDENT]: STUDENT_COLS,
  [STAFF]: STAFF_COLS,
}

export const FILE_TYPES = {
  ZIP: 'ZIP',
  PDF: 'PDF',
}

export const PREVIEW = 'preview'
export const PREVIEW_SAVE = 'previewAndSave'
export const STATUS = 'status'

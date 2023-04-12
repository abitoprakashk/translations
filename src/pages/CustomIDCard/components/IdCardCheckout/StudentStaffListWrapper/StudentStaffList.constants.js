import {t} from 'i18next'

export const ID_STAFF_COLS = () => [
  {key: 'personalInfo', label: t('employeeName')},
  {key: 'role', label: ''},
  {key: 'missingFields', label: ''},
]

export const ID_STUDENT_COLS = () => [
  {key: 'personalInfo', label: t('studentName')},
  {key: 'class', label: t('')},
  {key: 'missingFields', label: ''},
]

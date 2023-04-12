import {t} from 'i18next'

export const STUDENT_DIRECTORY_TABLE_HEADERS = [
  {key: 'name', label: t('studentName')},
  {key: 'class', label: t('class')},
  {key: 'contact', label: t('contactSm')},
  {key: 'status', label: t('status')},
]

export const STUDENT_DIRECTORY_TABLE_HEADERS_MOBILE = [
  {key: 'name', label: t('studentName')},
  {key: 'class', label: t('class')},
]

export const statusOptions = {
  1: {label: t('joinedOnApp'), value: 1},
  2: {label: t('appNotInstalled'), value: 2},
}

export const genderOptions = {
  Male: {label: t('male'), value: 'Male'},
  Female: {label: t('female'), value: 'Female'},
  Others: {label: t('others'), value: 'Others'},
}

export const BULK_IMAGE_UPLOAD_VALIDATION_TABLE_HEADERS = [
  {key: 'imageName', label: t('imageName')},
  {key: 'errorType', label: t('errors')},
]

export const BULK_IMAGE_UPLOAD_STATUS_TABLE_HEADERS = [
  {key: 'imageName', label: t('imageName')},
  {key: 'status', label: t('status')},
]

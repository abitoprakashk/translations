import {t} from 'i18next'

export const VEHICLE_OPTIONS = [
  {
    label: t('bus'),
    value: 'BUS',
  },
  {
    label: t('van'),
    value: 'VAN',
  },
  {
    label: t('autoRickshaw'),
    value: 'AUTO',
  },
]

export const NEW_VEHICLE_DATA = {
  number: '',
  type: '',
  capacity: '',
  name: '',
  imei: '',
}

export const NEW_VEHICLE_ERROR = {
  number: '',
  type: '',
  capacity: '',
}

export const VEHICLE_DOCUMENT_OPTIONS = [
  {
    label: 'Registration Certificate',
    value: 'Registration Certificate',
  },
  {
    label: 'Pollution Certificate',
    value: 'Pollution Certificate',
  },
  {
    label: 'Insurance',
    value: 'Insurance',
  },
  {
    label: 'AIS 140 RTO Certificate',
    value: 'AIS 140 RTO Certificate',
  },
  {
    label: 'Inspection',
    value: 'Inspection',
  },
  {
    label: 'Maintenance Bills',
    value: 'Maintenance Bills',
  },
  {
    label: 'Others',
    value: 'Others',
  },
]

export const MAX_VEHICLE_DOCUMENT_SIZE = 4000000

import {t} from 'i18next'

export const STOP_TABLE_COLUMNS = [
  {key: 'name', label: t('stopName')},
  {key: 'location', label: t('location')},
  {key: 'distance', label: t('distance')},
  {key: 'passengers', label: t('passengers')},
  {key: 'managePassengers', label: ''},
  {key: 'kebabMenu', label: ''},
]

export const LATITUDE_DELTA_FOR_ADD_STOP = 0.002

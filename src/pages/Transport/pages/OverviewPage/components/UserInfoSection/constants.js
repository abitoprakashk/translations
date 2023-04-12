import {t} from 'i18next'

export const USER_INFO_TABLE_COLUMNS = [
  {key: 'passengerDetails', label: t('passengerDetails')},
  {key: 'passengerType', label: t('passengerType')},
  {key: 'stopLocation', label: t('stopDetails')},
  {key: 'assignedVehicle', label: t('assignedVehicle')},
  {key: 'routeDetails', label: t('routeDetails')},
  {key: 'kebabMenu', label: ''},
]

export const PASSENGER_FILTER_IDS = {
  STOPS: 'stops',
  ROUTES: 'routes',
}

export const PASSENGER_FILTER_OPTIONS = [
  {id: PASSENGER_FILTER_IDS.STOPS, label: t('stops')},
  {id: PASSENGER_FILTER_IDS.ROUTES, label: t('routes')},
]

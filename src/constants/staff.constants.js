// Screens
export const SCN_SLI_STAFF_ADD = 'SCN_SLI_ADD_STAFF'

// Actions
export const ACT_STAFF_ADD = 'ACT_STAFF_ADD'
export const ACT_STAFF_DELETE = 'ACT_STAFF_DELETE'

export const STAFF_TOOLTIP_OPTIONS = [
  {
    label: 'Delete',
    action: ACT_STAFF_DELETE,
    labelStyle: 'tm-cr-rd-1',
    active: true,
  },
]

export const STAFF_TYPE = [
  {label: 'Select', value: 'Select'},
  {label: 'Driver', value: 'Driver'},
  {label: 'Conductor', value: 'Conductor'},
]

export const STAFF_TABLE_HEADERS = [
  {key: 'name', label: 'NAME'},
  {key: 'phone_number', label: 'PHONE NUMBER'},
  {key: 'type', label: 'TYPE'},
  {key: 'settings', label: 'SETTINGS'},
]

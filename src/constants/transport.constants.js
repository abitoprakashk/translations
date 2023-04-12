// Screens
export const SCN_SLI_TRASNPORT_ADD_ROUTE = 'SCN_SLI_ADD_TRASNPORT_ROUTE'
export const SCN_SLI_TRASNPORT_ADD_VEHICLE = 'SCN_SLI_ADD_TRASNPORT_VEHICLE'
export const SCN_SLI_TRASNPORT_ADD_WAYPOINT = 'SCN_SLI_TRASNPORT_ADD_WAYPOINT'
export const SCN_SLI_TRASNPORT_MANAGE_WAYPOINT =
  'SCN_SLI_TRASNPORT_MANAGE_WAYPOINT'
export const SCN_SLI_TRASNPORT_WAYPOINT_MANAGE_STUDENTS =
  'SCN_SLI_TRASNPORT_WAYPOINT_MANAGE_STUDENTS'

// Actions
export const ACT_TRASNPORT_ADD_ROUTE = 'ACT_TRASNPORT_ADD_ROUTE'
export const ACT_TRASNPORT_DELETE_ROUTE = 'ACT_TRASNPORT_DELETE_ROUTE'
export const ACT_TRASNPORT_ROUTE_MANAGE_WAYPOINT =
  'ACT_TRASNPORT_ROUTE_MANAGE_WAYPOINT'

export const ACT_TRASNPORT_ADD_VEHICLE = 'ACT_TRASNPORT_ADD_VEHICLE'
export const ACT_TRASNPORT_DELETE_VEHICLE = 'ACT_TRASNPORT_DELETE_VEHICLE'

export const ACT_TRASNPORT_ADD_WAYPOINT = 'ACT_TRASNPORT_ADD_WAYPOINT'
export const ACT_TRASNPORT_DELETE_WAYPOINT = 'ACT_TRASNPORT_DELETE_WAYPOINT'
export const ACT_TRASNPORT_WAYPOINT_MANAGE_STUDENTS =
  'ACT_TRASNPORT_WAYPOINT_MANAGE_STUDENTS'

export const TRANSPORT_TABS = [
  {id: 'TRANSPORT_PICKUP_POINT_TAB', label: 'Pickup Points'},
  {id: 'TRANSPORT_VEHICLE_TAB', label: 'Vehicles'},
  {id: 'TRANSPORT_STAFF_TAB', label: 'Staff'},
  {id: 'TRANSPORT_ROUTES_TAB', label: 'Routes'},
]

export const TRANSPORT_ROUTE_TABLE_HEADERS = [
  {key: 'name', label: 'ROUTE NAME'},
  {key: 'vehicle', label: 'VEHICLE'},
  {key: 'staff', label: 'STAFF'},
  {key: 'pickupPoints', label: 'PICKUP POINTS'},
  {key: 'manageWaypoint', label: 'MANAGE PICKUP POINT'},
  {key: 'settings', label: ' '},
]

export const TRANSPORT_ROUTE_TABLE_HEADERS_MOBILE = [
  {key: 'name', label: 'ROUTE NAME'},
  {key: 'vehicle', label: 'VEHICLE'},
  {key: 'manageWaypoint', label: 'MANAGE PICKUP POINT'},
]

export const TRANSPORT_ROUTES_TOOLTIP_OPTIONS = [
  {
    label: 'Delete',
    action: ACT_TRASNPORT_DELETE_ROUTE,
    labelStyle: 'tm-cr-rd-1',
    active: true,
  },
]

export const TRANSPORT_VEHICLE_TYPE = [
  {key: 'Select', value: 'Select'},
  {key: 'Bus', value: 'Bus'},
  {key: 'Auto', value: 'Auto'},
]

export const TRANSPORT_VEHICLE_TABLE_HEADERS = [
  {key: 'name', label: 'VEHICLE NAME'},
  {key: 'number', label: 'VEHICLE NUMBER'},
  {key: 'vehicle_type', label: 'VEHICLE TYPE'},
  {key: 'settings', label: ' '},
]

export const TRANSPORT_VEHICLE_TABLE_HEADERS_MOBILE = [
  {key: 'name', label: 'VEHICLE NAME'},
  {key: 'number', label: 'VEHICLE NUMBER'},
  {key: 'vehicle_type', label: 'VEHICLE TYPE'},
]

export const TRANSPORT_VEHICLE_TOOLTIP_OPTIONS = [
  {
    label: 'Delete',
    action: ACT_TRASNPORT_DELETE_VEHICLE,
    labelStyle: 'tm-cr-rd-1',
    active: true,
  },
]

export const TRANSPORT_WAYPOINT_TABLE_HEADERS = [
  {key: 'name', label: 'NAME'},
  {key: 'distance', label: 'DISTANCE'},
  {key: 'num_students', label: 'STUDENTS'},
  {key: 'manage_students', label: 'MANAGE STUDENTS'},
  {key: 'settings', label: ' '},
]

export const TRANSPORT_WAYPOINT_TABLE_HEADERS_MOBILE = [
  {key: 'name', label: 'NAME'},
  {key: 'num_students', label: 'STUDENTS'},
  {key: 'manage_students', label: 'MANAGE STUDENTS'},
]

export const TRANSPORT_WAYPOINT_TOOLTIP_OPTIONS = [
  {
    label: 'Delete',
    action: ACT_TRASNPORT_DELETE_WAYPOINT,
    labelStyle: 'tm-cr-rd-1',
    active: true,
  },
]

export const TRANSPORT_ROUTE_WAYPOINT_TABLE_HEADERS = [
  {key: 'name', label: 'NAME'},
  {key: 'pickup_time', label: 'PICKUP TIME'},
  {key: 'drop_time', label: 'DROP TIME'},
  {key: 'settings', label: ' '},
]

import {TRANSPORT_VEHICLE_TYPE} from '../../constants/transport.constants'

export const transportRoutesFields = {
  route_name: {
    fieldType: 'text',
    title: 'Route Name*',
    placeholder: 'Enter Route Name',
    fieldName: 'route_name',
    errorString: 'Enter a valid input',
  },
}

export const defaultTransportRoutesFieldValues = {
  route_name: '',
}

export const transportVehicleFields = {
  vehicle_name: {
    fieldType: 'text',
    title: 'Vehicle Name*',
    placeholder: 'Enter name',
    fieldName: 'vehicle_name',
    errorString: 'Enter a valid input',
  },
  number: {
    fieldType: 'text',
    title: 'Vehicle number*',
    placeholder: 'Enter vehicle name',
    fieldName: 'number',
    errorString: 'Enter a valid input',
  },
  vehicle_type: {
    fieldType: 'dropdown',
    dropdownItems: TRANSPORT_VEHICLE_TYPE,
    title: 'Vehicle Type*',
    placeholder: '',
    fieldName: 'vehicle_type',
    errorString: 'Enter a valid input',
  },
}

export const defaultTransportVehicleFieldValues = {
  vehicle_name: '',
  number: '',
  vehicle_type: 'Select',
}

export const transportWaypointFields = {
  waypoint_name: {
    fieldType: 'text',
    title: 'Pickup Point Name*',
    placeholder: 'Enter name',
    fieldName: 'waypoint_name',
    errorString: 'Enter a valid input',
  },
  distance: {
    fieldType: 'text',
    title: 'Distance (in Km)',
    placeholder: 'Enter distance',
    fieldName: 'distance',
    errorString: 'Enter a valid input',
  },
}

export const defaultTransportWaypointFieldValues = {
  name: '',
  distance: '',
}

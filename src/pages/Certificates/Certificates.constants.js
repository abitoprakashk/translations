import Bonafide from './assets/bonafide.svg'
import CharacterCertificate from './assets/character.svg'
import TC from './assets/tc.svg'
import {events} from '../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../utils/permission.constants'

export const CERTIFICATE_LABELS = {
  CERTIFICATES: 'Certificates',
  GENERATE_CERTIFICATE: 'Generate Certificate',
  INSTITUTE_ADDRESS: 'Institute Address',
  INSTITUTE_LOGO: 'Institute Logo',
}

export const ALL = 'ALL'
export const BONAFIDE = 'BONAFIDE'
export const CHARACTER = 'CHARACTER'
export const TRANSFER = 'TRANSFER'
export const PENDING_REQUEST = 'PENDING_REQUEST'
export const GENERATED = 'GENERATED'
export const REJECTED = 'REJECTED'

export const certificateTypes = [
  {
    img: Bonafide,
    text: 'bonafideCertificateText',
    type: 1,
    title: 'Bonafide Certificate',
    permissionId: PERMISSION_CONSTANTS.certificateController_createRoute_create,
    eventName: events.BONAFIDE_CERTIFICATE_CLICKED_TFI,
  },
  {
    img: CharacterCertificate,
    text: 'characterCertificateText',
    type: 2,
    title: 'Character Certificate',
    permissionId: PERMISSION_CONSTANTS.certificateController_createRoute_create,
    eventName: events.CHARACTER_CERTIFICATE_CLICKED_TFI,
  },
  {
    img: TC,
    text: 'tcCertificateText',
    type: 3,
    title: 'School Leaving Certificate',
    permissionId: PERMISSION_CONSTANTS.certificateController_createRoute_create,
    eventName: events.TRANSFER_CERTIFICATE_CLICKED_TFI,
  },
]

export const certificateTypeMap = {
  1: 'Bonafide Certificate',
  2: 'Character Certificate',
  3: 'School Leaving Certificate',
}

export const TAB_OPTIONS = {
  ALL: {
    id: ALL,
    label: 'All Certificates',
    type: null,
    name: 'All',
    eventName: events.ALL_CERTIFICATE_CLICKED_TFI,
  },
  BONAFIDE: {
    id: BONAFIDE,
    label: 'Bonafide Certificate',
    type: 1,
    name: 'Bonafide',
    eventName: events.BONAFIDE_CERTIFICATE_CLICKED_TFI,
  },
  CHARACTER: {
    id: CHARACTER,
    label: 'Character Certificate',
    type: 2,
    emptyStateText: 'There are no Events & Activities!',
    name: 'Character',
    eventName: events.CHARACTER_CERTIFICATE_CLICKED_TFI,
  },
  TRANSFER: {
    id: TRANSFER,
    label: 'School Leaving Certificate',
    type: 3,
    name: 'Transfer',
    eventName: events.TRANSFER_CERTIFICATE_CLICKED_TFI,
  },
}

export const TAB_OPTIONS_ARRAY = [
  TAB_OPTIONS[ALL],
  TAB_OPTIONS[BONAFIDE],
  TAB_OPTIONS[CHARACTER],
  TAB_OPTIONS[TRANSFER],
]

export const STUDENT_DIRECTORY_COL = [
  {key: 'name', label: 'Student'},
  {
    key: 'enrollmentId',
    label: '#Enrollment',
  },
  {key: 'class', label: 'Class & Section'},
  {key: 'action', label: 'Action'},
]

export const GENERATED_CERTIFICATE_COL = [
  {key: 'name', label: 'Student'},
  {key: 'class', label: 'Class & Section'},
  {
    key: '',
    label: '',
  },
  {key: 'action', label: 'Action'},
]

export const GENERATED_CERTIFICATE_COL_ALL = [
  {key: 'name', label: 'Student'},
  {key: 'class', label: 'Class & Section'},
  {key: 'type', label: 'Certificate Type'},
  {key: 'action', label: 'Action'},
]

export const CERTIFICATE_STATUS_TYPES = {
  1: {
    label: 'Pending Request',
    value: 1,
  },
  2: {
    label: 'Generated',
    value: 2,
  },
  3: {
    label: 'Rejected',
    value: 3,
  },
}

export const CERTIFICATE_STATUS_TYPES_ARRAY = {
  1: PENDING_REQUEST,
  2: GENERATED,
  3: REJECTED,
}

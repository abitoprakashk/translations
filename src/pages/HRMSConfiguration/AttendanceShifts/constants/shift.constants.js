import {t} from 'i18next'
import {STEPPER_CONSTANTS} from '@teachmint/krayon'

export const STAFF_TYPE = {
  TEACHING: 'Teacher',
  NON_TEACHING: 'NON_TEACHING',
}

export const ATTENDANCE_TAKEN_AT = {
  CHECKIN_CHECKOUT: 'CHECKIN_CHECKOUT',
  ONLY_CHECKIN: 'ONLY_CHECKIN',
}

export const ATTENDANCE_METHOD = {
  GEOFENCE: 'GEOFENCE',
  BIOMETRIC: 'BIOMETRIC',
}

export const defaultGraceTime = 30
export const defaultGraceFrequency = 6
export const minimumGeoFenceRadius = 50
export const defaultGeoFenceRadius = 150

export const defaultLocation = {
  latitude: 0,
  longitude: 0,
  address: '',
  geofence_radius: defaultGeoFenceRadius,
}

export const defaultGrace = {
  time: defaultGraceTime,
  frequency: defaultGraceFrequency,
}

export const CREATE_SHIFT_MODEL = {
  name: '',
  setting: {
    attendance_method: ATTENDANCE_METHOD.GEOFENCE,
    attendance_taken_at: ATTENDANCE_TAKEN_AT.CHECKIN_CHECKOUT,
    location: defaultLocation,
    is_grace_allowed: true,
    intime: '08:00 AM',
    outtime: '02:00 PM',
    grace: defaultGrace,
  },
  staffs: [],
}

export const SHIFT_CONFIGURATION_STEPS = {
  SETUP_SHIFT: 'SETUP_SHIFT',
  SELECT_STAFF: 'SELECT_STAFF',
  ATTENDANCE_METHOD: 'ATTENDANCE_METHOD',
}

export const DEFAULT_CONFIGURATION_STEPS = {
  [SHIFT_CONFIGURATION_STEPS.SETUP_SHIFT]: {
    id: SHIFT_CONFIGURATION_STEPS.SETUP_SHIFT,
    title: t('setupShift'),
    status: STEPPER_CONSTANTS.STATUS.IN_PROGRESS,
    description: t('setShiftNameAndTimings'),
  },
  [SHIFT_CONFIGURATION_STEPS.SELECT_STAFF]: {
    id: SHIFT_CONFIGURATION_STEPS.SELECT_STAFF,
    title: t('selectStaff'),
    status: STEPPER_CONSTANTS.STATUS.NOT_STARTED,
    description: t('selectApplicableStaffForThisShift'),
  },
  [SHIFT_CONFIGURATION_STEPS.ATTENDANCE_METHOD]: {
    id: SHIFT_CONFIGURATION_STEPS.ATTENDANCE_METHOD,
    title: t('attendanceMethod'),
    status: STEPPER_CONSTANTS.STATUS.NOT_STARTED,
    description: t('chooseMethodForTakingAttendance'),
  },
}

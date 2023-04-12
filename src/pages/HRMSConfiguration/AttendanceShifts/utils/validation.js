import {
  ATTENDANCE_METHOD,
  ATTENDANCE_TAKEN_AT,
} from '../constants/shift.constants'
import {DateTime} from 'luxon'

export const isCheckoutDateGreaterThanCheckIn = (shiftInfo) => {
  const checkInDate = DateTime.fromFormat(
    shiftInfo.setting.intime,
    'hh:mm a'
  ).toSeconds()
  const checkoutDate = DateTime.fromFormat(
    shiftInfo.setting.outtime,
    'hh:mm a'
  ).toSeconds()
  return checkoutDate > checkInDate
}

export const getDurationInMinutes = (intime, outtime) => {
  const inTime = DateTime.fromFormat(intime, 'hh:mm a')
  const outTime = DateTime.fromFormat(outtime, 'hh:mm a')
  const shiftDuration = outTime.diff(inTime, ['minutes']).get('minutes')
  return shiftDuration
}

export const isGraceTimeValid = (shiftInfo) => {
  if (
    shiftInfo?.setting?.attendance_taken_at ===
      ATTENDANCE_TAKEN_AT.CHECKIN_CHECKOUT &&
    shiftInfo?.setting?.intime &&
    shiftInfo?.setting?.outtime &&
    shiftInfo?.setting?.grace?.time
  ) {
    const shiftDuration = getDurationInMinutes(
      shiftInfo?.setting?.intime,
      shiftInfo?.setting?.outtime
    )
    if (shiftInfo?.setting?.grace?.time > shiftDuration / 2) {
      return false
    }
  }
  return true
}

export const isGraceFrequencyValid = (shiftInfo) => {
  return shiftInfo?.setting?.grace?.frequency <= 30
}

export const validateSetupShiftStep = (shiftInfo) => {
  return Boolean(
    shiftInfo?.name &&
      shiftInfo?.setting?.intime &&
      (shiftInfo?.setting?.attendance_taken_at !==
        ATTENDANCE_TAKEN_AT.CHECKIN_CHECKOUT ||
        (shiftInfo?.setting?.outtime &&
          isCheckoutDateGreaterThanCheckIn(shiftInfo))) &&
      (!shiftInfo?.setting?.is_grace_allowed ||
        (shiftInfo?.setting?.grace?.time &&
          isGraceTimeValid(shiftInfo) &&
          shiftInfo?.setting?.grace?.frequency &&
          isGraceFrequencyValid(shiftInfo)))
  )
}

export const validateSelectStaffStep = (shiftInfo) => {
  return Boolean(shiftInfo?.staffs?.length > 0)
}

export const validateAttendanceMethodStep = (shiftInfo) => {
  return Boolean(
    shiftInfo?.setting?.attendance_method === ATTENDANCE_METHOD.BIOMETRIC ||
      (shiftInfo?.setting?.location?.latitude &&
        shiftInfo?.setting?.location?.longitude &&
        shiftInfo?.setting?.location?.geofence_radius)
  )
}

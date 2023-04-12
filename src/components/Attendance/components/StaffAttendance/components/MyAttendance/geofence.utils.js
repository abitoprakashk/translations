import {markStaffAttendance} from '../../apiService'
import {EDIT_ATTENDANCE_STATUS} from '../../StaffAttendanceConstants'
import {WEB_VIEW_EVENTS} from './MyAttendance'

const {
  ABSENT,
  HALF_DAY_PRESENT,
  ON_LEAVE_FULL_DAY,
  FULL_DAY,
  SECOND_HALF,
  FIRST_HALF,
} = EDIT_ATTENDANCE_STATUS

export const callNativeMethod = (paramString) => {
  const {app} = window
  const iOSNative = window?.iOSNative
  if (app?.callGeofenceMethods) {
    app.callGeofenceMethods(paramString)
  } else if (iOSNative?.callGeofenceMethods) {
    iOSNative.callGeofenceMethods(paramString)
  }
}

export function setGeofenceEvents(callback) {
  window.callGeofenceMethods = async (str) => {
    const data = JSON.parse(str)
    switch (data.event) {
      case WEB_VIEW_EVENTS.SEND_MARK_ATTENDANCE_REQUEST: {
        const payload = data.payload.request
        const response = await markStaffAttendance(payload)
        callNativeMethod(
          JSON.stringify({
            event: WEB_VIEW_EVENTS.SEND_MARK_ATTENDANCE_RESPONSE,
            payload: {
              request: null,
              response: {
                attendance_info: response,
              },
            },
          })
        )
        if (response?.data?.status) {
          callback()
        }
        break
      }
      case WEB_VIEW_EVENTS.CLOSE_MAP_INTERFACE: {
        break
      }
    }
  }
}

export const getMyAttendanceStatus = ({item}) => {
  let statusValue = ''
  let secondaryStatus = null
  if (item?.leave_status?.length > 0) {
    if (
      item?.leave_status?.length == 2 ||
      item?.leave_status?.[0]?.type === FULL_DAY
    ) {
      statusValue = item?.status !== '' ? ABSENT : ON_LEAVE_FULL_DAY
    } else if (
      item?.leave_status?.[0]?.type === SECOND_HALF ||
      item?.leave_status?.[0]?.type === FIRST_HALF
    ) {
      statusValue = HALF_DAY_PRESENT
    }
  } else {
    if (item?.status && item?.status !== '') {
      statusValue = item?.status
    }
  }
  if (statusValue === '') {
    if (item?.calendar && item?.calendar !== '') {
      statusValue = item?.calendar
    }
  }
  secondaryStatus =
    item?.status_type ||
    (statusValue === ABSENT && item?.leave_status?.[0]?.type === FULL_DAY
      ? ON_LEAVE_FULL_DAY
      : null)
  return {statusValue, secondaryStatus}
}

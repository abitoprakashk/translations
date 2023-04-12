import {STAFF_TYPE} from '../constants/shift.constants'
import {REACT_APP_BASE_URL} from '../../../../constants'

export const getStaffGroups = (staffList) => {
  return staffList?.reduce((acc, staff) => {
    if (staff.roles === STAFF_TYPE.TEACHING) {
      acc[STAFF_TYPE.TEACHING] = [
        ...(acc[STAFF_TYPE.TEACHING] ? acc[STAFF_TYPE.TEACHING] : []),
        staff,
      ]
    } else {
      acc[STAFF_TYPE.NON_TEACHING] = [
        ...(acc[STAFF_TYPE.NON_TEACHING] ? acc[STAFF_TYPE.NON_TEACHING] : []),
        staff,
      ]
    }
    return acc
  }, {})
}

export const getQRCodeUrl = (institute_id, session_id) => {
  const url = new URL(`${REACT_APP_BASE_URL}geofence`)
  url.searchParams.append('institute_id', institute_id)
  url.searchParams.append('session_id', session_id)
  return url.href
}

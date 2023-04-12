import classNames from 'classnames'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import AttendanceSection from './components/AttendanceSection/AttendanceSection'
import styles from './StaffAttendance.module.css'
import {STAFF_ATTENDANCE_ROUTES} from './StaffAttendanceConstants'
import MyAttendance from './components/MyAttendance/MyAttendance'
import {Switch, Route, Redirect} from 'react-router-dom'
import AttendanceRequests from './components/AttendanceRequests/AttendanceRequests'
import ShiftDetails from './components/ShiftDetails/ShiftDetails'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

export default function StaffAttendance() {
  const permissions =
    useSelector(
      (state) => state.globalData?.userRolePermission?.data?.permission_ids
    ) || []
  const [canViewStaffAttendance, setViewStaffAttendance] = useState(null)

  useEffect(() => {
    if (permissions?.length > 0) {
      setViewStaffAttendance(
        permissions.includes(
          PERMISSION_CONSTANTS.staffAttendanceController_get_read
        )
      )
    }
  }, [permissions])

  return (
    <div
      className={classNames(
        styles.staffAttendanceSection,
        styles.minHeightFull
      )}
    >
      {/* if user is owner/admin/hr-manager */}
      {canViewStaffAttendance !== null ? (
        canViewStaffAttendance ? (
          <Switch>
            <Route
              exact
              path={STAFF_ATTENDANCE_ROUTES.STAFF_ATTENDANCE}
              component={AttendanceSection}
            />
            <Route
              exact
              path={STAFF_ATTENDANCE_ROUTES.MY_ATTENDANCE}
              component={MyAttendance}
            />
            <Route
              exact
              path={STAFF_ATTENDANCE_ROUTES.ATTENDANCE_REQUESTS}
              component={AttendanceRequests}
            />
            <Route
              exact
              path={STAFF_ATTENDANCE_ROUTES.SHIFT_DETAILS}
              component={ShiftDetails}
            />
            <Redirect to={STAFF_ATTENDANCE_ROUTES.STAFF_ATTENDANCE} />
          </Switch>
        ) : (
          // view for rest of the roles
          <Switch>
            <Route
              exact
              path={STAFF_ATTENDANCE_ROUTES.MY_ATTENDANCE}
              component={MyAttendance}
            />
            <Route
              exact
              path={STAFF_ATTENDANCE_ROUTES.SHIFT_DETAILS}
              component={ShiftDetails}
            />
            <Redirect to={STAFF_ATTENDANCE_ROUTES.MY_ATTENDANCE} />
          </Switch>
        )
      ) : null}
    </div>
  )
}

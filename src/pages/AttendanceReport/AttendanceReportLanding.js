import React, {lazy, Suspense} from 'react'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import AttendanceReportRoutes from './AttendanceReport.routes'
import Loader from '../../components/Common/Loader/Loader'
import styles from './AttendanceReportLanding.module.css'
const DateWiseAttendance = lazy(() =>
  import('./pages/DateWiseAttendance/DateWiseAttendance')
)
const StudentWiseAttendance = lazy(() =>
  import('./pages/StudentWiseAttendance/StudentWiseAttendance')
)
const ClassWiseAttendance = lazy(() =>
  import('./pages/ClassWiseAttendance/ClassWiseAttendance')
)
const TodaysDetailedReport = lazy(() =>
  import('./pages/TodaysDetailedReport/TodaysDetailedReport')
)
const AttendanceReport = lazy(() => import('./pages/Overview/Overview'))

function AttendanceReportLanding() {
  let {path} = useRouteMatch()
  const url = (link) => `${path}/${link}`
  return (
    <div className={styles.interFont}>
      <Suspense fallback={<Loader show />}>
        <Switch>
          <Route
            exact
            path={url(AttendanceReportRoutes.overview.route)}
            component={AttendanceReport}
          />
          <Route
            exact
            path={url(AttendanceReportRoutes.studentAttendance.route)}
            component={StudentWiseAttendance}
          />
          <Route
            exact
            path={url(AttendanceReportRoutes.classAttendance.route)}
            component={ClassWiseAttendance}
          />
          <Route
            exact
            path={url(AttendanceReportRoutes.dateAttendance.route)}
            component={DateWiseAttendance}
          />
          <Route
            exact
            path={url(AttendanceReportRoutes.todaysDetailedReport.route)}
            component={TodaysDetailedReport}
          />
          <Route
            exact
            path={url(AttendanceReportRoutes.specificDateClassAttendance.route)}
            component={TodaysDetailedReport}
          />
          <Route
            exact
            path={url(AttendanceReportRoutes.specificDateAttendance.route)}
            component={ClassWiseAttendance}
          />
          <Redirect to={url(AttendanceReportRoutes.overview.route)} />
        </Switch>
      </Suspense>
    </div>
  )
}

export default AttendanceReportLanding

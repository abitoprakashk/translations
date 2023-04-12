import React from 'react'
import {Switch, Route} from 'react-router-dom'
import StudentDirectory from './pages/StudentDirectory/StudentDirectory'
import SingleStudentPageRouting, {
  SINGLE_STUDENT_PROFILE_ROUTE,
} from './pages/SingleStudentPageRouting/SingleStudentPageRouting'
import {sidebarData} from '../../utils/SidebarItems'

export default function RouteMapping() {
  return (
    <Switch>
      <Route
        path={sidebarData.STUDENT_DIRECTORY.route}
        component={StudentDirectory}
        exact
      />
      <Route
        path={SINGLE_STUDENT_PROFILE_ROUTE}
        component={SingleStudentPageRouting}
      />

      {/* <Route path={url(TRANSPORT_TABLIST.stops.route)} component={StopsPage} /> */}
    </Switch>
  )
}

import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom'
import OverviewPage from './AttendanceShifts/components/OverviewPage/OverviewPage'
import BiometricUsers from './BiometricAttendance/pages/users/BiometricUsers'
import BiometricMachines from './BiometricAttendance/pages/machines/BiometricMachines'
import BiometricOverviewPage from './BiometricAttendance/pages/overview/BiometricOverviewPage'
import {t} from 'i18next'

export const hrmsRoutesList = {
  attendanceShifts: '/institute/dashboard/hrms-configuration/attendance-shifts',
  biometricConfiguration:
    '/institute/dashboard/hrms-configuration/biometric-configuration',
}

export const hrmsConfigurationTablist = {
  attendanceShifts: {
    id: 1,
    route: hrmsRoutesList.attendanceShifts,
    label: t('attendanceShifts'),
  },
  biometricConfiguration: {
    id: 2,
    route: hrmsRoutesList.biometricConfiguration,
    label: t('biometricConfiguration'),
  },
}

export default function HRMSConfigurationRouteMapping() {
  let {path} = useRouteMatch()
  const url = (subRoute) => `${path}/${subRoute}`
  return (
    <Switch>
      <Route exact path={url('')}>
        <Redirect to={url('attendance-shifts')} />
      </Route>
      <Route path={url('attendance-shifts')} component={OverviewPage} />
      <Route
        path={url('biometric-configuration')}
        component={BiometricOverviewPage}
      />
    </Switch>
  )
}

export function BiometricConfigurationRouteMapping() {
  let {path} = useRouteMatch()
  const url = (subRoute) => `${path}/${subRoute}`
  return (
    <Switch>
      <Route path={url('biometric-users')} component={BiometricUsers} />
      <Route path={url('biometric-machines')} component={BiometricMachines} />
    </Switch>
  )
}

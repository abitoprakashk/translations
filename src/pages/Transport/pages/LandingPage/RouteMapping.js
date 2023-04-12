import {t} from 'i18next'
import React from 'react'
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom'
import OverviewPage from '../OverviewPage/OverviewPage'
import StaffPage from '../StaffPage/StaffPage'
import StopsPage from '../StopsPage/StopsPage'
import TransportRoutePage from '../TransportRoutePage/TransportRoutePage'
import VehiclesPage from '../VehiclesPage/VehiclesPage'

export const TRANSPORT_TABLIST = {
  overview: {
    route: 'overview',
    label: t('overview'),
  },
  stops: {
    route: 'stops',
    label: t('stops'),
  },
  vehicles: {
    route: 'vehicles',
    label: t('vehicles'),
  },
  staff: {
    route: 'staff',
    label: t('staff'),
  },
  transportRoute: {
    route: 'routes',
    label: t('routes'),
  },
}

export default function RouteMapping() {
  let {path} = useRouteMatch()
  const url = (subRoute) => `${path}/${subRoute}`
  return (
    <Switch>
      <Route exact path={url('')}>
        <Redirect to={url(TRANSPORT_TABLIST.overview.route)} />
      </Route>
      <Route
        path={url(TRANSPORT_TABLIST.overview.route)}
        component={OverviewPage}
      />
      <Route path={url(TRANSPORT_TABLIST.stops.route)} component={StopsPage} />
      <Route
        path={url(TRANSPORT_TABLIST.vehicles.route)}
        component={VehiclesPage}
      />
      <Route path={url(TRANSPORT_TABLIST.staff.route)} component={StaffPage} />
      <Route
        path={url(TRANSPORT_TABLIST.transportRoute.route)}
        component={TransportRoutePage}
      />
    </Switch>
  )
}

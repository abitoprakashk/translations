import {t} from 'i18next'
import React from 'react'
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom'
import CumulativeView from './CumulativeView/CumulativeView'
import ComparativeView from './ComparativeView/ComparativeView'

export const TABLIST = {
  cumulative: {
    route: 'cumulative',
    label: t('cumulativeView'),
    icon: 'viewHeadline',
  },
  comparative: {
    route: 'comparative',
    label: t('comparativeView'),
    icon: 'leaderboard',
  },
}

export default function RouteMapping() {
  let {path} = useRouteMatch()
  const url = (subRoute) => `${path}/${subRoute}`
  return (
    <Switch>
      <Route exact path={url('')}>
        <Redirect to={url(TABLIST.cumulative.route)} />
      </Route>
      <Route path={url(TABLIST.cumulative.route)} component={CumulativeView} />
      <Route
        path={url(TABLIST.comparative.route)}
        component={ComparativeView}
      />
    </Switch>
  )
}

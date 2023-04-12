import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {useRouteMatch} from 'react-router-dom'
import OverviewWrapper from '../Overview/components/OverviewWrapper'
import Stores from '../Stores/components/Stores'
import PurchaseOrder from '../PurchaseOrders/components/PurchaseOrder'
import CategoryWrapper from '../Categories/components/CategoriesLandingPage'
import {events} from '../../../../utils/EventsConstants'

export default function RouteMapping() {
  let {path} = useRouteMatch()
  const url = (subRoute) => `${path}/${subRoute}`
  return (
    <Switch>
      <Route exact path={url('')}>
        <Redirect to={url('overview')} />
      </Route>
      <Route path={url('overview')} component={OverviewWrapper} />
      <Route path={url('orders')} component={PurchaseOrder} />
      <Route path={url('stores')} component={Stores} />
      <Route path={url('categories')} component={CategoryWrapper} />
    </Switch>
  )
}

export const TABLIST = [
  {
    route: 'overview',
    label: 'Inventory Overview',
    event: events.IM_INVENTORY_OVERVIEW_TAB_CLICKED,
  },
  {
    route: 'orders',
    label: 'Purchase Order',
    event: events.IM_PURCHASE_ORDER_TAB_CLICKED_TFI,
  },
  {
    route: 'categories',
    label: 'Item Category',
    event: events.IM_ITEM_CATEGORY_TAB_SELECTED_TFI,
  },
  {
    route: 'stores',
    label: 'Room',
    event: events.IM_ITEM_STORE_TAB_CLICKED_TFI,
  },
]

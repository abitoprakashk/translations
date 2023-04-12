import React, {useState} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {useRouteMatch} from 'react-router-dom'
import {events} from '../../../../utils/EventsConstants'
import OverviewCategories from './components/Category/OverviewCategories'
import OverviewItems from './components/Items/OverviewItems'

export default function RouteMapping() {
  let {path} = useRouteMatch()
  const url = (subRoute) => `${path}/${subRoute}`
  const [inputValue, setInputValue] = useState('')
  return (
    <Switch>
      <Route exact path={url('')}>
        <Redirect to={url('categories')} />
      </Route>
      <Route path={url('categories')} render={() => <OverviewCategories />} />
      <Route
        path={url('items')}
        render={() => (
          <OverviewItems
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        )}
      />
    </Switch>
  )
}

export const TABLIST = [
  {
    route: 'categories',
    label: 'Category Overview',
    event: events.IM_CATEGORY_OVERVIEW_SUBTAB_CLICKED_TFI,
  },
  {
    route: 'items',
    label: 'Item Overview',
    event: events.IM_ITEM_OVERVIEW_SUBTAB_CLICKED_TFI,
  },
]

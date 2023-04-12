import React, {useEffect} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import axios from 'axios'
import * as Sentry from '@sentry/react'
import Home from './containers/Home/Home'
import Pricing from './containers/Pricing/Pricing'
import SWW from './components/Common/SWW/SWW'
import Signup from './containers/Signup/Signup'
import EventManager from './utils/EventManager'
import {useDispatch, useSelector} from 'react-redux'
import {eventManagerAction} from './redux/actions/EventManagerAction'
import {
  PRICING,
  DASHBOARD,
  ERROR,
  LOGIN,
  INSTITUTE,
  REDIRECT_ROUTES,
} from './utils/SidebarItems'
import NotFoundPage from './pages/NotFound/NotFound'
import {REACT_APP_ENABLE_SENTRY, REACT_ENV_TYPE} from './constants'
import AppToastStack from './components/AppToastStack/AppToastStack'
import {
  addAxiosRequestInterceptor,
  addAxiosResponseInterceptor,
} from './utils/apis.utils'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import './components/Verloop/Verloop.css'
import styles from './App.module.css'
import useLogUserTime from './hooks/useLogUserTime'
import useIsMobileReduxUpdate from './hooks/useIsMobileReduxUpdate'
import GridLoader from './components/Common/Loader/GridLoader'

axios.defaults.withCredentials = true
addAxiosRequestInterceptor()
addAxiosResponseInterceptor()

function App(_props) {
  // Add Event Manager if not added
  const {eventManager} = useSelector((state) => state)
  useLogUserTime()
  useIsMobileReduxUpdate()
  if (!eventManager) {
    let eventManagerBeforeLogin = new EventManager(null, window.location.href)
    eventManagerBeforeLogin.getConfig()
    const dispatch = useDispatch()
    dispatch(eventManagerAction(eventManagerBeforeLogin))
  }
  const handleLoad = () => {
    // Remove auto reload on file not found (logic in index.html)
    localStorage.removeItem('retryCount')
  }

  useEffect(() => {
    window.addEventListener('load', handleLoad)
    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [])
  const NON_PROD_REDIRECTIONS = ['/', INSTITUTE]
  return (
    <div className={styles.wrapper}>
      <GridLoader />
      <ErrorBoundary>
        <AppToastStack />
      </ErrorBoundary>
      <ErrorBoundary>
        <Switch>
          {REACT_ENV_TYPE !== 'PROD' &&
            NON_PROD_REDIRECTIONS.map((path) => (
              <Route key={path} path={path} exact>
                <Redirect to={LOGIN} />
              </Route>
            ))}
          <Redirect from="/institute/login" to={LOGIN} />
          <Redirect
            exact
            from={REDIRECT_ROUTES.FEE_TRANSACTION_BANK.from}
            to={REDIRECT_ROUTES.FEE_TRANSACTION_BANK.to}
          />
          <Redirect
            exact
            from={REDIRECT_ROUTES.FEE_TRANSACTION_CHEQUE.from}
            to={REDIRECT_ROUTES.FEE_TRANSACTION_CHEQUE.to}
          />
          <Route path={LOGIN} exact component={Signup} />
          <Route path={PRICING} exact component={Pricing} />
          <Route path={DASHBOARD} component={Home} />
          <Route path={ERROR} component={SWW} />
          <Route component={NotFoundPage} />
        </Switch>
      </ErrorBoundary>
    </div>
  )
}

export default +REACT_APP_ENABLE_SENTRY ? Sentry.withProfiler(App) : App

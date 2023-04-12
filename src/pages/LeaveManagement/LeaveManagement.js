import React, {lazy, Suspense, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  getLeaveBalance,
  resetData,
} from './redux/actions/leaveManagement.actions'
import Loader from '../../components/Common/Loader/Loader'
import Dashboard from './components/Dashboard/Dashboard'
import styles from './LeaveManagement.module.css'
import {useTranslation} from 'react-i18next'
import {Redirect, Route, Switch} from 'react-router-dom'
import LEAVE_MANAGEMENT_ROUTES, {
  LEAVE_MANAGEMENT_BASE_ROUTE,
} from './LeaveManagement.routes'
import RoleFilter from '../../components/RoleFilter'
import {IS_MOBILE} from '../../constants'
const LeaveBalanceConfirm = lazy(() =>
  import('./components/LeaveBalanceConfirm/LeaveBalanceConfirm')
)

function LeaveManagement() {
  const {loading, data} = useSelector(
    (state) => state.leaveManagement.yearlyLeavesOfInstitute
  )

  const {t} = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    // only fetch current leave balance if limit is not set
    if (data?.default === false) dispatch(getLeaveBalance())
    return () => {
      dispatch(resetData())
    }
  }, [])

  return (
    <>
      {loading ? (
        <Loader show={loading} />
      ) : (
        <div className={styles.wrapper}>
          {!IS_MOBILE && (
            <div className={styles.text}>{t('leaveManagement')}</div>
          )}
          <Suspense fallback="Loading...">
            <RoleFilter>
              <Switch>
                {data?.default && (
                  <Route
                    path={LEAVE_MANAGEMENT_ROUTES.SET_LEAVE_LIMIT}
                    exact
                    component={LeaveBalanceConfirm}
                  />
                )}
                {/* if default is true means redirect to set leave limit. this is one time job
                    else redirect admin to base route if limit is already set */}
                {data?.default ? (
                  <Redirect to={LEAVE_MANAGEMENT_ROUTES.SET_LEAVE_LIMIT} />
                ) : (
                  <Redirect
                    from={LEAVE_MANAGEMENT_ROUTES.SET_LEAVE_LIMIT}
                    to={LEAVE_MANAGEMENT_BASE_ROUTE}
                  />
                )}

                <Route path={LEAVE_MANAGEMENT_BASE_ROUTE} exact>
                  <Redirect to={LEAVE_MANAGEMENT_ROUTES.MANAGE_LEAVES} />
                </Route>

                <Route
                  path={[
                    LEAVE_MANAGEMENT_ROUTES.MY_LEAVES,
                    LEAVE_MANAGEMENT_ROUTES.MANAGE_LEAVES,
                  ]}
                  exact
                >
                  <Dashboard />
                </Route>

                <Redirect to={LEAVE_MANAGEMENT_BASE_ROUTE} />
              </Switch>
            </RoleFilter>

            <RoleFilter exclude>
              <Switch>
                {/* only staff needed to redirect to /my-leaves */}
                <Route path={LEAVE_MANAGEMENT_BASE_ROUTE} exact>
                  <Redirect to={LEAVE_MANAGEMENT_ROUTES.MY_LEAVES} />
                </Route>

                <Route path={LEAVE_MANAGEMENT_ROUTES.MY_LEAVES} exact>
                  <Dashboard />
                </Route>

                <Redirect to={LEAVE_MANAGEMENT_BASE_ROUTE} />
              </Switch>
            </RoleFilter>
          </Suspense>
        </div>
      )}
    </>
  )
}

export default LeaveManagement

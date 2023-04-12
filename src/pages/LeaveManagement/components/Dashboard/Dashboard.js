import React, {lazy, Suspense} from 'react'
import {useSelector} from 'react-redux'
import {t} from 'i18next'

import AddLeave from './LeaveTable/components/AddLeave/AddLeave'
import styles from './Dashboard.module.css'
import RoleFilter from '../../../../components/RoleFilter'

import {Link, Route, Switch, useRouteMatch} from 'react-router-dom'
import LEAVE_MANAGEMENT_ROUTES from '../../LeaveManagement.routes'
import LinearTabOptions from '../../../../components/Common/LinearTabOptions/LinearTabOptions'
import {IS_MOBILE} from '../../../../constants'
const StaffHistoryPopup = lazy(() =>
  import('./LeaveTable/components/StaffHistoryPopup/StaffHistoryPopup')
)
const StaffHistoryList = lazy(() =>
  import('./LeaveTable/components/StaffHistoryPopup/StaffHistoryList')
)

const ManageLeaves = lazy(() => import('./ManageLeaves'))
const MyLeaves = lazy(() => import('./MyLeaves'))
const LeaveBalanceUpdate = lazy(() =>
  import('../LeaveBalanceConfirm/LeaveBalanceUpdate')
)

const MANAGE_LEAVE_ID = 'manage-leaves'
const MY_LEAVE_ID = 'my-leaves'
const tabOptions = [
  {
    id: MANAGE_LEAVE_ID,
    label: (
      <Link to={LEAVE_MANAGEMENT_ROUTES.MANAGE_LEAVES}>{t('staffLeaves')}</Link>
    ),
  },
  {
    id: MY_LEAVE_ID,
    label: <Link to={LEAVE_MANAGEMENT_ROUTES.MY_LEAVES}>{t('myLeaves')}</Link>,
  },
]

function Dashboard() {
  const {
    addLeave: {showAddLeavePopup},
    staffHistory: {showPopup},
  } = useSelector((state) => state.leaveManagement)

  const userType = useSelector((state) => state.currentAdminInfo.type)
  const myLeave = useRouteMatch(LEAVE_MANAGEMENT_ROUTES.MY_LEAVES)

  return (
    <>
      <RoleFilter>
        <LinearTabOptions
          options={userType === 7 ? tabOptions.slice(0, 1) : tabOptions}
          selected={myLeave == null ? MANAGE_LEAVE_ID : MY_LEAVE_ID}
          className={styles.tabs}
          shouldTranslation={false}
        />
      </RoleFilter>

      <Suspense fallback="Loading...">
        <Switch>
          <Route path={LEAVE_MANAGEMENT_ROUTES.MANAGE_LEAVES} exact>
            <ManageLeaves />
          </Route>
          <Route path={LEAVE_MANAGEMENT_ROUTES.MY_LEAVES} exact>
            <MyLeaves />
          </Route>
        </Switch>
      </Suspense>

      {showAddLeavePopup ? <AddLeave /> : null}
      {showPopup && (IS_MOBILE ? <StaffHistoryList /> : <StaffHistoryPopup />)}

      <RoleFilter>
        <LeaveBalanceUpdate />
      </RoleFilter>
    </>
  )
}

export default Dashboard

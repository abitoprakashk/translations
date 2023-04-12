import React, {useEffect, useState} from 'react'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import {useSelector} from 'react-redux'
import AppDownloadNudge from '../../Dashboard/AppDownloadNudge/AppDownloadNudge'
import {isMobile} from '@teachmint/common'
import YearlyCalendarBanner from '../../../pages/YearlyCalendar/components/YearlyCalendarBanner/YearlyCalendarBanner'
import {EmptyState, Para} from '@teachmint/krayon'
import {t} from 'i18next'
import history from '../../../history'
import PendingTasks from '../../Dashboard/PendingTask/PendingTasks'
import {DASHBOARD} from '../../../utils/SidebarItems'
import CommunicationWidget from '../../Dashboard/CommunicationWidget/Communication'
import {pendingTasksPermissionList} from './constants'
import {actionsList} from '../../Dashboard/QuickActions/utils'
import styles from '../FullDashboard/FullDashboard.module.css'
import FeeWidget from '../../Dashboard/FeeWidget/FeeWidget'
import LeaveWidget from '../../Dashboard/LeaveWidget/LeaveWidget'
import SetupWidget from '../../Dashboard/SetupWidget/SetupWidget'
import {StaggeredGrid, StaggeredGridItem} from 'react-staggered-grid'
import {getScreenWidth} from '../../../utils/Helpers'
import DashboardFooterMsg from '../../Dashboard/DashboardFooterMsg/DashboardFooterMsg'
import {useCheckPermission} from '../../../utils/Permssions'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {INSTITUTE_TYPES} from '../../../constants/institute.constants'
import AttendanceWidget from '../../Dashboard/AttendanceWidget/AttendanceWidget'

export default function FullDashboard() {
  let isMobileView = isMobile()
  let viewTypeApp = window?.navigator?.userAgent === 'TeachmintAppWebView'
  let deviceTypeAndroid = navigator?.userAgent?.includes('Android')
  const {sidebar, instituteInfo} = useSelector((state) => state)
  const isDashboardAllowed = sidebar?.allowedMenus?.has('DASHBOARD')
  const userRolePermission = useSelector(
    (state) => state.globalData?.userRolePermission
  )
  const [hasPendingTasksPermissionId, setHasPendingTasksPermissionId] =
    useState(false)
  let allWidgets = []

  const hasPendingTasksPermission = () => {
    pendingTasksPermissionList.map((permission) => {
      if (
        userRolePermission?.data?.permission_ids?.includes(permission) &&
        !hasPendingTasksPermissionId
      ) {
        setHasPendingTasksPermissionId(true)
      }
    })
    actionsList.map((action) => {
      if (
        userRolePermission?.data?.permission_ids?.includes(action.permission) &&
        !hasPendingTasksPermissionId
      ) {
        setHasPendingTasksPermissionId(true)
      }
    })
  }

  const hasLeaveWidgetPermission = useCheckPermission(
    PERMISSION_CONSTANTS.adminLeaveController_getUserList_read
  )

  const hasAttendanceWidgetPermission =
    instituteInfo?.institute_type === INSTITUTE_TYPES.SCHOOL &&
    sidebar?.allowedMenus?.has('ATTENDANCE_REPORTS')

  const hasFeeWidgetPermission = sidebar?.allowedMenus?.has('FEE_CONFIGURATION')

  const hasCommunicationWidgetPermission =
    sidebar?.allowedMenus?.has('ANNOUNCEMENTS')

  const hasSetupWidgetPermision =
    sidebar?.allowedMenus?.has('SCHOOL_SETUP') &&
    sidebar?.allowedMenus?.has('TEACHER_DIRECTORY') &&
    sidebar?.allowedMenus?.has('STUDENT_DIRECTORY')

  const allPermissions = [
    {permission: hasLeaveWidgetPermission, component: <LeaveWidget />},
    {permission: hasFeeWidgetPermission, component: <FeeWidget />},
    {
      permission: hasCommunicationWidgetPermission,
      component: <CommunicationWidget />,
    },
    {permission: hasSetupWidgetPermision, component: <SetupWidget />},
    {
      permission: hasAttendanceWidgetPermission,
      component: <AttendanceWidget />,
    },
  ]

  allWidgets = allPermissions
    .filter(({permission, component}) => permission && component)
    .map(({component}) => component)

  useEffect(() => {
    if (sidebar?.homePageRoute && sidebar?.homePageRoute !== DASHBOARD) {
      history.push(sidebar?.homePageRoute) // if users dont have access to Dashboard redirect to first allowed menu
    }
  }, [sidebar])

  useEffect(() => {
    hasPendingTasksPermission()
  }, [userRolePermission])

  hasPendingTasksPermission()
  return isDashboardAllowed ? (
    <div className={styles.fullDashboard}>
      <div
        className={
          hasPendingTasksPermissionId
            ? styles.fullDashboardContentAreaMinWidth
            : styles.fullDashboardContentAreaMaxWidth
        }
      >
        <ErrorBoundary>
          {isMobileView && deviceTypeAndroid && !viewTypeApp && (
            <AppDownloadNudge />
          )}
          <ErrorBoundary>
            {sidebar?.allowedMenus?.has('YEARLY_CALENDAR') ? (
              <YearlyCalendarBanner />
            ) : null}
          </ErrorBoundary>
          <div className="lg:hidden">
            {hasPendingTasksPermissionId && (
              <div className={styles.sideContainer}>
                <PendingTasks />
              </div>
            )}
          </div>
          <div className={styles.dashboardContentArea}>
            <StaggeredGrid
              columns={getScreenWidth() > 767 ? 2 : 1}
              style={{width: '100%'}}
              useElementWidth={true}
              horizontalGap={20}
              verticalGap={20}
            >
              {allWidgets?.map((widget, index) => (
                <StaggeredGridItem
                  key={index}
                  index={index}
                  spans={1}
                  className={styles.widgetContainer}
                >
                  {widget}
                </StaggeredGridItem>
              ))}
            </StaggeredGrid>
          </div>
        </ErrorBoundary>
        <DashboardFooterMsg />
      </div>
      <div
        className={
          hasPendingTasksPermissionId
            ? styles.pendingTasksContainerMaxWidth
            : styles.pendingTasksContainerMinWidth
        }
      >
        <ErrorBoundary>
          {hasPendingTasksPermissionId && (
            <div className={styles.sideContainer}>
              <PendingTasks />
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  ) : (
    <EmptyState
      iconName="lock"
      button={null}
      content={
        <Para>
          {t('noPermission')}
          <br />
          {t('contactAdmin')}
        </Para>
      }
      classes={{wrapper: styles.emptyStateWrapper}}
    />
  )
}

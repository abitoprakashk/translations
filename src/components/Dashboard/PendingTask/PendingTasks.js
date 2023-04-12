import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Divider, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {t} from 'i18next'
import QuickActions from '../QuickActions/QuickActions'
import StaffAttendance from './StaffAttendance/StaffAttendance'
import StaffLeaves from './StaffLeaves/StaffLeaves'
import {ATTENDANCE_DAY_STATS} from '../../Attendance/components/StaffAttendance/StaffAttendanceConstants'
import {fetchStaffAttendanceListRequestAction} from '../../Attendance/components/StaffAttendance/redux/actions/StaffAttendanceActions'
import {getPendingLeaves} from '../../../pages/LeaveManagement/redux/actions/leaveManagement.actions'
import styles from './PendingTasks.module.css'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {checkSubscriptionType} from '../../../utils/Helpers'
import {quickActionsActionTypes} from '../../../redux/actionTypes'
import {FEE_REPORTS_TEMPLATES} from '../../../pages/fee/fees.constants'
import {DateTime} from 'luxon'

const PendingTasks = () => {
  const dispatch = useDispatch()
  const {globalData, instituteInfo} = useSelector((state) => state)
  const {isLoading} = useSelector(() => globalData.getDashboardPreference)
  const pendingTasksContainerRef = useRef(null)

  const {selectedDateUTCTimestamp, todayStatus} = useSelector(
    (state) => state?.staffAttendance
  )
  const {data: pendingLeavesData} = useSelector(
    (state) => state.leaveManagement.pendingLeaves
  )
  const instituteActiveAcademicSessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )

  const userRolePermission = useSelector(
    (state) => state.globalData?.userRolePermission
  )
  const usersPermission = useSelector(
    (state) => state?.globalData?.userRolePermission?.data?.permission_ids
  )

  const todayTimestamp = DateTime.now()
  const isPremium = checkSubscriptionType(instituteInfo)

  const hasMarkStaffAttendancePermission =
    userRolePermission?.data?.permission_ids?.includes(
      PERMISSION_CONSTANTS.staffAttendanceController_markAttendance_create
    )

  const hasMarkStaffLeavePermission =
    userRolePermission?.data?.permission_ids?.includes(
      PERMISSION_CONSTANTS.adminLeaveController_updateStatus_update
    )
  let pendingTasksLength
  let pendingLeavesLength
  const getPendingTasksLength = () => {
    pendingLeavesLength = hasMarkStaffLeavePermission
      ? pendingLeavesData?.length
      : 0
    let staffAttendanceTask =
      !(todayStatus === ATTENDANCE_DAY_STATS.MARKED_THIS_DAY.value) &&
      hasMarkStaffAttendancePermission
        ? 1
        : 0
    pendingTasksLength = pendingLeavesLength + staffAttendanceTask
    return pendingTasksLength
  }
  const checkPermission = (permissionId) => {
    const isPremium = checkSubscriptionType(instituteInfo)
    return usersPermission?.includes(permissionId) && isPremium ? true : false
  }
  useEffect(() => {
    if (isPremium && usersPermission) {
      if (
        checkPermission(
          PERMISSION_CONSTANTS.FeeModuleController_reportDownloadRequest_read
        )
      ) {
        let data = {}
        data.report_type =
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value
        data.meta = {
          report_name: '',
          date_range: {
            start_date: todayTimestamp.startOf('day').toSeconds(),
            end_date: todayTimestamp.endOf('day').toSeconds(),
          },
        }
        dispatch({
          type: quickActionsActionTypes.TODAY_COLLECTED_FEE_REQUEST,
          payload: data,
        })
      }
    }
    const parmsData = {
      from_date: selectedDateUTCTimestamp,
      to_date: selectedDateUTCTimestamp,
    }
    if (isPremium && hasMarkStaffAttendancePermission) {
      dispatch(fetchStaffAttendanceListRequestAction(parmsData))
    }
    if (isPremium && hasMarkStaffLeavePermission) {
      dispatch(
        getPendingLeaves({
          count: 100,
        })
      )
    }
  }, [
    selectedDateUTCTimestamp,
    instituteActiveAcademicSessionId,
    hasMarkStaffLeavePermission,
    hasMarkStaffAttendancePermission,
  ])

  return (
    <div className={`${styles.pendingTasksContainer}  show-scrollbar`}>
      <div
        ref={pendingTasksContainerRef}
        className={styles.pendingTasksQuickActionContainer}
      >
        <QuickActions />
        <Divider spacing="0px" className={styles.sideContainerDivider} />
      </div>
      <div className={styles.PendingTasksMainContainer}>
        <div className={styles.PendingTasksMainContainerTitle}>
          {`${t('PendingTasks')} (${getPendingTasksLength() || 0})`}
        </div>
        {isLoading || pendingTasksLength > 0 ? (
          <>
            {hasMarkStaffAttendancePermission &&
              (isLoading ? (
                <>
                  <div className={styles.staffAttendanceContainerTitle}>
                    {t('staffAttendance')}
                  </div>
                  <div className={styles.StaffAttendanceShimmner}></div>
                </>
              ) : (
                todayStatus !== ATTENDANCE_DAY_STATS.MARKED_THIS_DAY.value && (
                  <StaffAttendance />
                )
              ))}

            {hasMarkStaffLeavePermission &&
              (isLoading ? (
                <>
                  <div className={styles.staffLeavesContainerTitle}>
                    {t('staffLeaves')}
                  </div>
                  <div className={styles.StaffLeaveShimmner}>
                    <div className={styles.StaffLeaveShimmnerLeaveType}></div>
                    <div className={styles.StaffLeaveShimmnerName}></div>
                    <div className={styles.StaffLeaveShimmnerDays}></div>
                    <div className={styles.StaffLeaveShimmnerRole}></div>
                  </div>
                </>
              ) : pendingLeavesLength > 0 ? (
                <StaffLeaves
                  pendingLeavesLength={pendingLeavesLength}
                  pendingTasksContainerRef={pendingTasksContainerRef}
                />
              ) : (
                ''
              ))}
          </>
        ) : (
          <div className={styles.PendingTasksEmptyContainer}>
            <div className={styles.PendingTasksEmptyBox}>
              <Icon
                name="addCheck"
                type={ICON_CONSTANTS.TYPES.INVERTED}
                size={ICON_CONSTANTS.SIZES.SMALL}
              />
            </div>

            <div className={styles.PendingTasksEmptyText}>
              {t('pendingTasksEmptyText')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PendingTasks

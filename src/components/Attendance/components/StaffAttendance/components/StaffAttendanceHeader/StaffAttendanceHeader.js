import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
import {useHistory} from 'react-router-dom'
import {
  HeaderTemplate,
  IconFrame,
  ICON_FRAME_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import {IS_MOBILE} from '../../../../../../constants'
import DownloadReport from '../Buttons/DownloadReport'
import StaffAttendanceTabs from '../StaffAttendanceTabs/StaffAttendanceTabs'
import styles from './StaffAttendanceHeader.module.css'
import SetupCard from '../../../../../Common/SetupCard/SetupCard'
import {events} from '../../../../../../utils/EventsConstants'
import {sidebarData} from '../../../../../../utils/SidebarItems'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {STAFF_ATTENDANCE_ROUTES} from '../../StaffAttendanceConstants'
import {ATTENDANCE_REQUEST_STATUS} from '../AttendanceRequests/AttendanceRequests'
import classNames from 'classnames'

export default function StaffAttendanceHeader({
  showAttendanceTabs,
  showDownloadReport,
  showShiftSetupBanner,
  showAttendanceRequestBanner,
}) {
  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)
  const shiftList = useSelector((state) => state.globalData?.shiftList?.data)
  const attendanceRequests = useSelector(
    (state) => state.globalData?.attendanceRequests?.data
  )
  const {staffListData} = useSelector((state) => state.staffAttendance)
  const [pendingAttendanceCount, setPendingAttendanceCount] = useState(0)

  useEffect(() => {
    if (showAttendanceRequestBanner && attendanceRequests && staffListData) {
      let count = 0
      for (const timestamp in attendanceRequests) {
        const dayRecords = attendanceRequests[timestamp]
        for (const iid in dayRecords) {
          const staff = staffListData.find((staff) => staff._id === iid)
          if (staff) {
            const requestItem = dayRecords[iid]
            for (const type in requestItem) {
              const item = requestItem[type]
              if (item.request_status === ATTENDANCE_REQUEST_STATUS.PENDING) {
                count++
              }
            }
          }
        }
      }
      setPendingAttendanceCount(count)
    }
  }, [attendanceRequests, staffListData])

  const goToAttendanceRequests = () => {
    eventManager.send_event(events.HRMS_VIEW_ATTENDANCE_REQUESTS_CLICKED_TFI)
    history.push(STAFF_ATTENDANCE_ROUTES.ATTENDANCE_REQUESTS)
  }

  return (
    <div>
      {!IS_MOBILE && (
        <HeaderTemplate
          showBreadcrumb={false}
          mainHeading={t('staffAttendance')}
          classes={{divider: styles.noBottomPadding}}
          {...{
            headerTemplateRightElement: (
              <div className={styles.headerTemplateRightElement}>
                {showAttendanceRequestBanner && (
                  <Button
                    type={BUTTON_CONSTANTS.TYPE.TEXT}
                    onClick={goToAttendanceRequests}
                  >
                    {t('attendanceRequestLogs')}
                  </Button>
                )}
                {showDownloadReport && <DownloadReport />}
              </div>
            ),
          }}
        />
      )}
      {showShiftSetupBanner && !IS_MOBILE && shiftList?.length === 0 && (
        <SetupCard
          heading={t('setupAutomatedAttendance')}
          text={t('setupSchoolTimings')}
          actionBtn={t('setupNow')}
          onClick={() => {
            eventManager.send_event(
              events.SETUP_AUTOMATED_ATTENDANCE_CLICKED_TFI,
              {screen_name: 'staff_attendance'}
            )
            history.push({
              pathname: sidebarData.HRMS_CONFIGURATION.subRoutes[0], //go to attendance shifts
              state: {
                showCreateShiftModal: true,
              },
            })
          }}
          permissionId={
            PERMISSION_CONSTANTS.InstituteShiftController_update_route_create
          }
          classes={{wrapper: styles.setupCardWrapper}}
        />
      )}
      {showAttendanceRequestBanner && attendanceRequests ? (
        pendingAttendanceCount > 0 ? (
          <SetupCard
            heading={
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.X_SMALL}
                className={styles.attendanceRequest}
              >
                {t('attendanceRequests')} <span>{pendingAttendanceCount}</span>
              </Para>
            }
            icon={
              <IconFrame
                type={ICON_FRAME_CONSTANTS.TYPES.BASIC}
                size={ICON_FRAME_CONSTANTS.SIZES.X_LARGE}
              >
                <Icon
                  name="people2"
                  type={ICON_CONSTANTS.TYPES.INVERTED}
                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                  version={ICON_CONSTANTS.VERSION.FILLED}
                />
              </IconFrame>
            }
            text={t('youHavePendingRequestsFromStaff')}
            actionBtn={t('viewRequests')}
            onClick={goToAttendanceRequests}
            permissionId={
              PERMISSION_CONSTANTS.geofenceStaffAttendanceController_get_requests_read
            }
            classes={{wrapper: styles.setupCardWrapper}}
          />
        ) : IS_MOBILE && Object.values(attendanceRequests)?.length === 0 ? (
          <SetupCard
            heading={
              <div className={styles.setupHeading}>
                <Para
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                >
                  {t('clickHereToSee')}
                </Para>
                <Para
                  type={PARA_CONSTANTS.TYPE.PRIMARY}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                  className={styles.headerText}
                  onClick={goToAttendanceRequests}
                >
                  {t('attendanceRequestLogs')}
                </Para>
              </div>
            }
            actionBtn={
              <span onClick={goToAttendanceRequests}>
                <Icon
                  name="forwardArrow"
                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
              </span>
            }
            classes={{
              wrapper: classNames(
                styles.setupCardWrapper,
                styles.whiteBgWrapper
              ),
            }}
            permissionId={
              PERMISSION_CONSTANTS.geofenceStaffAttendanceController_get_requests_read
            }
          />
        ) : null
      ) : null}
      {showAttendanceTabs && <StaffAttendanceTabs />}
    </div>
  )
}

import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import classNames from 'classnames'
import {t} from 'i18next'
import styles from './MyAttendance.module.css'
import {
  Alert,
  ALERT_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  PlainCard,
  Button,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Tooltip,
  TOOLTIP_CONSTANTS,
  isAndroidWebview,
  isIOSWebview,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {IS_MOBILE} from '../../../../../../constants'
import ViewCalendar from './ViewCalendar/ViewCalendar'
import StaffAttendanceHeader from '../StaffAttendanceHeader/StaffAttendanceHeader'
import globalActions from '../../../../../../redux/actions/global.actions'
import Loader from '../../../../../Common/Loader/Loader'
import {STAFF_ATTENDANCE_ROUTES} from '../../StaffAttendanceConstants'
import {
  ATTENDANCE_METHOD,
  ATTENDANCE_TAKEN_AT,
} from '../../../../../../pages/HRMSConfiguration/AttendanceShifts/constants/shift.constants'
import {getFromSessionStorage} from '../../../../../../utils/Helpers'
import {BROWSER_STORAGE_KEYS} from '../../../../../../constants/institute.constants'
import {DateTime} from 'luxon'
import SetupCard from '../../../../../Common/SetupCard/SetupCard'
import {
  callNativeMethod,
  getMyAttendanceStatus,
  setGeofenceEvents,
} from './geofence.utils'
import {events} from '../../../../../../utils/EventsConstants'
import {useCheckPermission} from '../../../../../../utils/Permssions'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {debounce} from '../../../../../../utils/Helpers'

export const WEB_VIEW_EVENTS = {
  OPEN_MAP_INTERFACE: 'OPEN_MAP_INTERFACE',
  SEND_MARK_ATTENDANCE_REQUEST: 'SEND_MARK_ATTENDANCE_REQUEST',
  SEND_MARK_ATTENDANCE_RESPONSE: 'SEND_MARK_ATTENDANCE_RESPONSE',
  CLOSE_MAP_INTERFACE: 'CLOSE_MAP_INTERFACE',
}
const currentAcademicSessionAttendanceSummary = {
  totalPresent: {
    id: 'totalPresent',
    label: t('totalPresent'),
    value: 0,
    type: 'success',
    tooltip: '',
  },
  totalAbsent: {
    id: 'totalAbsent',
    label: t('totalAbsent'),
    value: 0,
    type: 'error',
    tooltip: '',
  },
  totalLateAndLeftEarly: {
    id: 'totalLateAndLeftEarly',
    label: t('totalLateAndLeftEarly'),
    value: 0,
    type: 'primary',
    tooltip: t('arrivedLateOrLeftEarlyTooltip'),
  },
  overallAttendance: {
    id: 'overallAttendance',
    label: t('overallAttendance'),
    value: 0,
    type: 'secondary',
    tooltip: '',
  },
}

export default function MyAttendance() {
  const dispatch = useDispatch()
  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)
  const canViewStaffAttendance = useCheckPermission(
    PERMISSION_CONSTANTS.staffAttendanceController_get_read
  )
  const checkIsWebview = () => !!(isAndroidWebview() || isIOSWebview())

  const {
    currentAdminInfo,
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
    instituteInfo,
  } = useSelector((state) => state)

  const currentSession = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )

  const {data: shiftInfo, isLoading: isShiftInfoLoading} = useSelector(
    (state) => state.globalData?.shiftInfo
  )
  const {
    data: staffAttendanceSummary,
    isLoading: isStaffAttendanceSummaryLoading,
  } = useSelector((state) => state.globalData?.staffAttendanceSummary)
  const {data: myAttendance, isLoading: isNonTeachingStaffAttendanceLoading} =
    useSelector((state) => state.globalData?.nonTeachingStaffAttendance)
  const {
    data: todayAttendanceInfo,
    isLoading: isTodayNonTeachingStaffAttendanceLoading,
  } = useSelector((state) => state.globalData?.todayNonTeachingStaffAttendance)

  const attendanceForCalendarView = {}
  myAttendance?.data.map((item) => {
    const {statusValue, secondaryStatus} = getMyAttendanceStatus({item})
    if (statusValue && statusValue !== '') {
      attendanceForCalendarView[item.date] = {
        primary: statusValue,
        secondary: secondaryStatus,
      }
    }
  })
  if (
    !(
      DateTime.utc().startOf('day').toUnixInteger() in attendanceForCalendarView
    )
  ) {
    attendanceForCalendarView[DateTime.utc().startOf('day').toUnixInteger()] = {
      primary: 'TODAYS_DATE',
      secondary: null,
    }
  }

  const isWebview = checkIsWebview()
  const [sessionSummary, setSessionSummary] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(DateTime.now().month)
  const [isMarkAttendanceBtnEnabled, setIsMarkAttendanceBtnEnabled] =
    useState(false)
  const [openMap, setOpenMap] = useState(false)

  const getTodayAttendance = () => {
    const todayUTCtimestanmp = DateTime.utc().startOf('day').toUnixInteger()
    dispatch(
      globalActions?.fetchTodayNonTeachingStaffAttendance?.request({
        from_date: todayUTCtimestanmp,
        to_date: todayUTCtimestanmp,
      })
    )
  }

  const openMapInterface = () => {
    const userAuthId = getFromSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID)
    const {NODE_ENV} = process.env
    callNativeMethod(
      JSON.stringify({
        event: WEB_VIEW_EVENTS.OPEN_MAP_INTERFACE,
        payload: {
          request: null,
          response: {
            shift: shiftInfo,
            attendance_info: todayAttendanceInfo,
            timezone: instituteInfo.timezone,
            session_id: instituteActiveAcademicSessionId,
            institute_id: instituteInfo._id,
            user_auth_id: userAuthId,
            env: NODE_ENV,
          },
        },
      })
    )
  }

  const goToShiftDetails = () => {
    history.push(STAFF_ATTENDANCE_ROUTES.SHIFT_DETAILS)
  }

  const onClickMarkAttendance = async () => {
    eventManager.send_event(events.GEOFENCE_MARK_ATTENDANCE_CLICKED)
    setOpenMap(true)
  }

  const debouncedClickMarkAttendance = debounce(onClickMarkAttendance, 500)

  const onSelectMonth = (direction) => {
    let month
    if (direction === 'prev') {
      month = DateTime.now().set({month: selectedMonth}).minus({month: 1}).month
    } else if (direction === 'next') {
      month = DateTime.now().set({month: selectedMonth}).plus({month: 1}).month
    }
    setSelectedMonth(month)
  }

  const getSelectedMonthAttendance = () => {
    const monthStartDate = DateTime.utc()
      .set({month: selectedMonth})
      .startOf('month')
      .toUnixInteger()
    const monthEndDate = DateTime.utc()
      .set({month: selectedMonth})
      .endOf('month')
      .toUnixInteger()
    dispatch(
      globalActions.fetchNonTeachingStaffAttendance.request({
        from_date: monthStartDate,
        to_date: monthEndDate,
      })
    )
  }

  const refreshMyAttendanceInfo = () => {
    getTodayAttendance()
    getSelectedMonthAttendance()
    dispatch(globalActions.fetchStaffAttendanceSummary.request())
  }

  useEffect(() => {
    getSelectedMonthAttendance()
  }, [selectedMonth])

  useEffect(() => {
    dispatch(
      globalActions.fetchShiftInfo.request({
        iid: currentAdminInfo.imember_id,
      })
    )
  }, [currentAdminInfo])

  useEffect(() => {
    if (isWebview) {
      setGeofenceEvents(refreshMyAttendanceInfo)
    }
    getTodayAttendance()
    dispatch(globalActions.fetchStaffAttendanceSummary.request())
  }, [])

  useEffect(() => {
    if (todayAttendanceInfo && shiftInfo) {
      const attendanceData = todayAttendanceInfo?.data
      const isMarkingComplete =
        shiftInfo?.setting?.attendance_taken_at ===
        ATTENDANCE_TAKEN_AT.ONLY_CHECKIN
          ? Boolean(attendanceData.find((item) => item.checkin))
          : Boolean(attendanceData.find((item) => item.checkout))

      const isInGeofenceShift =
        shiftInfo?.setting?.attendance_method === ATTENDANCE_METHOD.GEOFENCE

      const isSessionNotExpired =
        currentSession.start_time < DateTime.now().toMillis() &&
        DateTime.now().toMillis() < currentSession.end_time

      setIsMarkAttendanceBtnEnabled(
        isInGeofenceShift && isSessionNotExpired && !isMarkingComplete
      )
      if (openMap) {
        setOpenMap(false)
        openMapInterface()
      }
    }
  }, [todayAttendanceInfo, shiftInfo])

  useEffect(() => {
    if (staffAttendanceSummary) {
      const updatedSessionSummary = {...currentAcademicSessionAttendanceSummary}
      updatedSessionSummary.totalPresent.value = staffAttendanceSummary.present
      updatedSessionSummary.totalAbsent.value = staffAttendanceSummary.absent
      updatedSessionSummary.overallAttendance.value = `${staffAttendanceSummary.overall_percentage} %`
      updatedSessionSummary.totalLateAndLeftEarly.value =
        staffAttendanceSummary.arrive_late + staffAttendanceSummary.left_early
      setSessionSummary(Object.values(updatedSessionSummary))
    }
  }, [staffAttendanceSummary])

  useEffect(() => {
    if (openMap) {
      getTodayAttendance()
    }
  }, [openMap])

  return (
    <>
      <StaffAttendanceHeader showAttendanceTabs={canViewStaffAttendance} />
      <div className={styles.myAttendanceWrapper}>
        <Loader
          show={
            isTodayNonTeachingStaffAttendanceLoading ||
            isShiftInfoLoading ||
            isStaffAttendanceSummaryLoading ||
            isNonTeachingStaffAttendanceLoading
          }
        />
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
          {t('myAttendanceOverviewCurrentAcademicSession')}
        </Heading>
        <div className={styles.summaryCardWrapper}>
          {sessionSummary.map((item) => {
            return (
              <PlainCard
                key={item.id}
                className={classNames(styles.summaryCard, styles[item.type])}
              >
                <div className={styles.summaryValueWrapper}>
                  <Heading className={styles.summaryValue}>
                    {t(item.value)}
                  </Heading>
                  {item.tooltip && (
                    <span
                      data-tip
                      data-for={item.id}
                      className={styles.tooltipWrapper}
                    >
                      <Icon
                        name="info"
                        type={ICON_CONSTANTS.TYPES.SECONDARY}
                        size={ICON_CONSTANTS.SIZES.XX_SMALL}
                        version={ICON_CONSTANTS.VERSION.OUTLINED}
                      />
                      <Tooltip
                        toolTipId={item.id}
                        toolTipBody={
                          <div className={styles.toolTipBody}>
                            {item.tooltip}
                          </div>
                        }
                        place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.TOP}
                        effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
                      />
                    </span>
                  )}
                </div>
                <Heading
                  type={HEADING_CONSTANTS.TYPE.TEXT_SECONDARY}
                  className={styles.summaryLabel}
                >
                  {t(item.label)}
                </Heading>
              </PlainCard>
            )
          })}
        </div>
        {!IS_MOBILE && (
          <Alert
            type={ALERT_CONSTANTS.TYPE.WARNING}
            content={t('pleaseUsePhoneToMarkAttendance')}
            className={styles.alert}
            hideClose
          />
        )}
        {IS_MOBILE && shiftInfo?._id && (
          <SetupCard
            heading={
              <div className={styles.shiftDetailsText}>
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
                  onClick={goToShiftDetails}
                >
                  {t('shiftDetails')}
                </Para>
              </div>
            }
            permissionId={''}
            actionBtn={
              <span onClick={goToShiftDetails}>
                <Icon
                  name="forwardArrow"
                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
              </span>
            }
            classes={{
              wrapper: styles.setupCardWrapper,
            }}
          />
        )}
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}
          className={styles.heading}
        >
          {t('monthlyAttendance')}
        </Heading>
        <ViewCalendar
          attendanceData={attendanceForCalendarView}
          handleRangeChange={onSelectMonth}
          selectedMonth={selectedMonth}
        />
        {isWebview && (
          <div className={styles.footer}>
            <Button
              type={BUTTON_CONSTANTS.TYPE.FILLED}
              category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
              width={BUTTON_CONSTANTS.WIDTH.FULL}
              onClick={debouncedClickMarkAttendance}
              isDisabled={!isMarkAttendanceBtnEnabled}
            >
              {t('markAttendance')}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

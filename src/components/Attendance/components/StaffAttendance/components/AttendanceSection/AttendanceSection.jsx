import React, {useState, useEffect, useMemo, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ErrorBoundary} from '@teachmint/common'
import classNames from 'classnames'
import Loader from '../../../../../Common/Loader/Loader'
import {
  editAttendance,
  fetchStaffAttendanceDates,
  fetchStaffAttendanceListRequestAction,
  fetchStaffListRequestAction,
  fetchUTCTimestamp,
  selectedTabAction,
  storeStaffAttendanceSearchTerm,
} from '../../redux/actions/StaffAttendanceActions'
import globalActions from '../../../../../../redux/actions/global.actions'

import {
  ATTENDANCE_DAY_STATS,
  ATTENDANCE_VIEW_TYPE,
  dateFromFormat,
  STAFF_ATTENDANCE_EMPTY_STATUS,
  STAFF_ATTENDANCE_STATUS,
  STAFF_ATTENDANCE_USERS_STATUS_TABS,
} from '../../StaffAttendanceConstants'
import styles from './AttendanceSection.module.css'
import AttendanceDayStats from '../AttendanceDayStats'
import {DAY_SELECTOR_CONSTANTS} from '@teachmint/krayon'
import AttendanceViewTypeFilter from '../AttendanceViewTypeFilter'
import AttendanceList from '../AttendanceList'
import AttendanceFooter, {ATTENDANCE_FOOTER_ACTION} from '../AttendanceFooter'
import {diffChecker} from './AttendanceSection.utils'
import useAttendanceCount from '../../hooks/useAttendanceCount'
import useViewFilter from '../../hooks/useViewFilter'
import useSearchFilter from '../../../../../../hooks/useSearchFilter'
import EmptyAttendance from '../EmptyAttendance'
import {DateTime} from 'luxon'
import AttendanceCalendar, {LEGEND_MAP} from '../AttendanceCalendar'
import {useCallback} from 'react'
import {getUTCTimeStamp} from '../../commonFunctions'
import {events} from '../../../../../../utils/EventsConstants'
import AttendanceSearch from '../AttendanceSearch'
import EditAttendanceButton from '../Buttons/EditAttendanceButton'
import {IS_MOBILE} from '../../../../../../constants'
import StaffAttendanceHeader from '../StaffAttendanceHeader/StaffAttendanceHeader'
import DownloadReport from '../Buttons/DownloadReport'

const selectVal = (item) => item.status || STAFF_ATTENDANCE_STATUS.NOT_MARKED

export default function AttendanceSection() {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const [session, setSession] = useState({
    startDate: null,
    endDate: null,
  })
  const [activeViewType, setActiveViewType] = useState(
    ATTENDANCE_VIEW_TYPE.TOTAL_STAFF
  )
  const [selectAll, setSelectAll] = useState(false)
  const [daysStats, setDaysStats] = useState({})
  const [dateObj, setDateObj] = useState(new Date())
  const footerRef = useRef()

  const instituteActiveAcademicSessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )

  const {start_time, end_time} = useSelector((state) =>
    state.instituteAcademicSessionInfo.find(
      ({_id}) => _id === instituteActiveAcademicSessionId
    )
  )

  const {
    staffAttendanceSelectedDate: selectedDate,
    selectedDateUTCTimestamp,
    staffListData,
    isStaffListLoading,
    info: attendanceInfo,
    commitedInfo: commitedAttendanceInfo,
    todayStatus,
    editing,
  } = useSelector((state) => state.staffAttendance)

  const {data: shiftList, isLoading: isShiftListLoading} = useSelector(
    (state) => state.globalData?.shiftList
  )
  useEffect(() => {
    if (!shiftList) {
      dispatch(globalActions?.fetchShiftList?.request())
    }
    const startDateStr = DateTime.fromMillis(Number(start_time)).toFormat(
      dateFromFormat.yyyy_LL_dd
    )
    const endDateStr = DateTime.fromMillis(Number(end_time)).toFormat(
      dateFromFormat.yyyy_LL_dd
    )
    dispatch(
      globalActions.fetchAttendanceRequests.request({
        from_date: DateTime.fromFormat(
          startDateStr,
          dateFromFormat.yyyy_LL_dd,
          {
            zone: 'utc',
          }
        )
          .startOf('day')
          .toUnixInteger(),
        to_date: DateTime.fromFormat(endDateStr, dateFromFormat.yyyy_LL_dd, {
          zone: 'utc',
        })
          .endOf('day')
          .toUnixInteger(),
      })
    )
  }, [])

  useEffect(() => {
    setDateObj(new Date(selectedDate))
    setActiveViewType(ATTENDANCE_VIEW_TYPE.TOTAL_STAFF)
  }, [selectedDate])

  useEffect(() => {
    const startDate = DateTime.fromMillis(Number(start_time))
    const endDate = DateTime.min(
      DateTime.local(),
      DateTime.fromMillis(Number(end_time))
    )

    setSession({
      startDate: startDate.toJSDate(),
      endDate: endDate.toJSDate(),
    })

    if (dateObj > endDate) {
      setDateObj(endDate.toJSDate())
      handleCalendarChange(endDate.toFormat('yyyy-MM-dd'))
    }
  }, [start_time, end_time])

  useEffect(() => {
    if (
      todayStatus === ATTENDANCE_DAY_STATS.MARKED_THIS_DAY.value &&
      daysStats[selectedDateUTCTimestamp] ===
        ATTENDANCE_DAY_STATS.NOT_MARKED_THIS_DAY.value
    ) {
      setDaysStats((stats) => ({
        ...stats,
        [selectedDateUTCTimestamp]: ATTENDANCE_DAY_STATS.MARKED_THIS_DAY.value,
      }))
    }
  }, [todayStatus])

  // Fetch Staff List
  useEffect(() => {
    dispatch(fetchStaffListRequestAction())
    const text = ''
    dispatch(storeStaffAttendanceSearchTerm(text))
    dispatch(selectedTabAction(STAFF_ATTENDANCE_USERS_STATUS_TABS[0].id))
  }, [selectedDate, instituteActiveAcademicSessionId])

  // Fetch Staff Attendance Data
  useEffect(() => {
    const parmsData = {
      from_date: selectedDateUTCTimestamp,
      to_date: selectedDateUTCTimestamp,
    }
    dispatch(fetchStaffAttendanceListRequestAction(parmsData))
  }, [selectedDateUTCTimestamp, instituteActiveAcademicSessionId])

  useEffect(() => {
    dispatch(editAttendance(false))
  }, [selectedDate, instituteActiveAcademicSessionId])

  const {changes, hasChanged} = useMemo(
    () => diffChecker(commitedAttendanceInfo, attendanceInfo, selectVal),
    [attendanceInfo]
  )

  const viewFilteredList = useViewFilter({
    staffList: staffListData || [],
    attendanceInfo: commitedAttendanceInfo,
    viewType: activeViewType,
  })

  const {
    query,
    setQuery,
    filteredList: searchFilteredList,
  } = useSearchFilter({
    list: viewFilteredList || [],
  })

  const isSearchActive = query?.trim().length > 0

  useEffect(() => {
    setActiveViewType(ATTENDANCE_VIEW_TYPE.TOTAL_STAFF)
  }, [isSearchActive])

  const attendanceCounts = useAttendanceCount({
    staffList: (isSearchActive ? searchFilteredList : staffListData) || [],
    attendanceInfo: commitedAttendanceInfo,
  })

  const handleCalendarChange = useCallback(
    (formattedDate) => {
      if (changes && footerRef.current) {
        footerRef.current.showWarning((type) => {
          if (
            ATTENDANCE_FOOTER_ACTION.SAVE === type ||
            ATTENDANCE_FOOTER_ACTION.EXIT === type
          ) {
            // Set UTC DateTime Stamp
            dispatch(fetchStaffAttendanceDates(formattedDate))
            const getTimeStampValue = getUTCTimeStamp(formattedDate)
            dispatch(fetchUTCTimestamp(getTimeStampValue))
            eventManager.send_event(events.STAFF_ATTENDANCE_DATE_CLICKED_TFI, {
              attendance_date: formattedDate,
              screen_name: 'staff_attendance',
            })
          }
        })
        return false
      } else {
        // Set UTC DateTime Stamp
        dispatch(fetchStaffAttendanceDates(formattedDate))
        const getTimeStampValue = getUTCTimeStamp(formattedDate)
        dispatch(fetchUTCTimestamp(getTimeStampValue))
        eventManager.send_event(events.STAFF_ATTENDANCE_DATE_CLICKED_TFI, {
          attendance_date: formattedDate,
          screen_name: 'staff_attendance',
        })
      }
    },
    [selectedDate]
  )

  useEffect(() => {
    if (hasChanged && !editing) dispatch(editAttendance(true))
  }, [hasChanged, editing])

  useEffect(() => {
    if (!hasChanged) setSelectAll(false)
  }, [hasChanged])

  const attendanceStatusType = useMemo(() => {
    const {HOLIDAY, WEEKLY_OFF} = DAY_SELECTOR_CONSTANTS.LEGEND
    if (
      [HOLIDAY, WEEKLY_OFF].includes(
        LEGEND_MAP[daysStats[selectedDateUTCTimestamp]].value
      )
    )
      return daysStats[selectedDateUTCTimestamp]
    return todayStatus
  }, [todayStatus, daysStats[selectedDateUTCTimestamp]])

  const showEditButton = editing ? (hasChanged ? false : true) : true

  return (
    <>
      <StaffAttendanceHeader
        showAttendanceTabs
        showShiftSetupBanner
        showDownloadReport
        showAttendanceRequestBanner
      />
      <div className={classNames(styles.attendanceMainBlock)}>
        <Loader show={isStaffListLoading || isShiftListLoading} />
        {IS_MOBILE ? (
          <div
            className={classNames(
              styles.flex,
              styles.spaceBetween,
              styles.alignCenter
            )}
          >
            {/* Intensefully I didn't remove that. Keep this comment for now
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
                {t('staffAttendance')}
              </Heading>
            */}
            {session.startDate && (
              <ErrorBoundary>
                <AttendanceCalendar
                  session={session}
                  selectedDate={dateObj}
                  daysStats={daysStats}
                  setDaysStats={setDaysStats}
                  handleCalendarChange={handleCalendarChange}
                />
              </ErrorBoundary>
            )}
            <DownloadReport />
          </div>
        ) : (
          session.startDate && (
            <ErrorBoundary>
              <AttendanceCalendar
                session={session}
                selectedDate={dateObj}
                daysStats={daysStats}
                setDaysStats={setDaysStats}
                handleCalendarChange={handleCalendarChange}
              />
            </ErrorBoundary>
          )
        )}

        {todayStatus && <AttendanceDayStats status={attendanceStatusType} />}

        <div
          className={classNames(
            styles.flex,
            styles.spaceBetween,
            styles.alignCenter,
            {[styles.mwebGap]: IS_MOBILE}
          )}
        >
          <AttendanceSearch
            value={query}
            onChange={({value}) => setQuery(value)}
          />
          {IS_MOBILE && <EditAttendanceButton editing={editing} />}
          {/* <DownloadReport /> */}
        </div>

        <ErrorBoundary>
          <AttendanceViewTypeFilter
            active={activeViewType}
            onClick={setActiveViewType}
            counts={attendanceCounts}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            showEditButton={showEditButton}
            editing={editing}
            isFilterActive={isSearchActive}
          />
        </ErrorBoundary>

        {(viewFilteredList.length == 0 || searchFilteredList.length == 0) && (
          <ErrorBoundary>
            <EmptyAttendance
              status={
                isSearchActive
                  ? STAFF_ATTENDANCE_EMPTY_STATUS.FILTER_EMPTY_RESULT.value
                  : todayStatus === ATTENDANCE_DAY_STATS.MARKED_THIS_DAY.value
                  ? STAFF_ATTENDANCE_EMPTY_STATUS[
                      activeViewType === ATTENDANCE_VIEW_TYPE.NOT_MARKED
                        ? STAFF_ATTENDANCE_EMPTY_STATUS.ALL_MARKED.value
                        : activeViewType
                    ]?.value
                  : STAFF_ATTENDANCE_EMPTY_STATUS.NOT_MARKED.value
              }
            />
          </ErrorBoundary>
        )}

        <ErrorBoundary>
          <AttendanceList
            list={searchFilteredList || []}
            className={classNames({[styles.bottomPadding]: hasChanged})}
            editing={editing}
            changed={hasChanged}
          />
        </ErrorBoundary>

        {hasChanged && <AttendanceFooter changes={changes} ref={footerRef} />}
      </div>
    </>
  )
}

import React, {useEffect, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import AttendanceTrendFilter from './components/AttendanceTrendFilter/AttendanceTrendFilter'
import AttendanceTrendView from './components/AttendanceTrendView/AttendanceTrendView'
import styles from './AttendanceTrend.module.css'
import RetryOverlay from '../../../../components/RetryOverlay/RetryOverlay'
import AttendanceTrendViewShimmer from './components/AttendanceTrendView/AttendanceTrendViewShimmer'
import useAttendanceTrendFilter from '../../hooks/useAttendanceTrendFilter'
import useAttendanceTrendData from '../../hooks/useAttendanceTrendData'
import {TREND_FILTER} from './AttendanceTrend.constant'
import {DateTime} from 'luxon'
import {Link} from 'react-router-dom'
import AttendanceReportRoutes from '../../../../AttendanceReport.routes'
import {DATE_FILTER} from '../../../../AttendanceReport.constant'
import useSendEvent from '../../../../hooks/useSendEvent'
import {STUDENT_ATTENDANCE_VIEW_DATEWISE_DETAILED_REPORTS} from '../../../../AttendanceReport.events.constant'

function AttendanceTrend() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const sendEvent = useSendEvent()
  const [selectedFilter, onFilterChange] = useAttendanceTrendFilter()
  // const dateRange = useGetDateRange(selectedFilter)
  const {isLoading, loaded, data, error} =
    useAttendanceTrendData(selectedFilter)
  const {instituteInfo} = useSelector((state) => state)

  const getData = () => {
    const dateRange = getDateRange(selectedFilter)

    dispatch(
      globalActions.attendanceTrend.request({
        selectedFilter,
        dateRange,
      })
    )
  }

  useEffect(() => {
    if (selectedFilter) {
      getData()
    }
  }, [selectedFilter])

  const filterValue = useMemo(() => {
    if (selectedFilter === TREND_FILTER.MONTHLY) {
      return DATE_FILTER.THIS_MONTH.value
    } else if (selectedFilter === TREND_FILTER.DAILY) {
      return DATE_FILTER.THIS_WEEK.value
    }
  }, [selectedFilter])

  const renderView = () => {
    if (error) {
      return (
        <div className={styles.errorWrapper}>
          <RetryOverlay onretry={getData} />
        </div>
      )
    }
    if (isLoading) {
      return (
        <div className={styles.shimmerWrapper}>
          <AttendanceTrendViewShimmer />
          <AttendanceTrendViewShimmer />
        </div>
      )
    }
    if (data && loaded) {
      return (
        <>
          <div className={styles.filterWrapper}>
            <AttendanceTrendFilter
              selectedFilter={selectedFilter}
              onFilterChange={onFilterChange}
            />
            <Link
              onClick={() =>
                sendEvent(STUDENT_ATTENDANCE_VIEW_DATEWISE_DETAILED_REPORTS, {
                  selectedFilter,
                })
              }
              className={styles.link}
              to={`${AttendanceReportRoutes.dateAttendance.fullPath}?filter=${filterValue}`}
            >
              <div className={styles.link}>{t('viewDetailedReport')}</div>
            </Link>
          </div>
          <AttendanceTrendView data={data} />
        </>
      )
    }
  }

  const getDateRange = (selectedFilter) => {
    let dateRange
    const curr = new Date(
      new Date().toLocaleString('en-EU', {
        timeZone: instituteInfo.timezone,
      })
    ) // get current date
    if (selectedFilter === TREND_FILTER.MONTHLY) {
      const date = curr
      const firstDay = curr
      const lastDay = new Date(date.getFullYear(), date.getMonth() - 7, 1)
      dateRange = {
        from: DateTime.fromJSDate(lastDay).toFormat('yyyy-MM-dd'),
        to: DateTime.fromJSDate(firstDay).toFormat('yyyy-MM-dd'),
      }
    } else {
      const firstDay = curr
      let lastDay = new Date(
        new Date().toLocaleString('en-EU', {
          timeZone: instituteInfo.timezone,
        })
      )
      lastDay.setDate(lastDay.getDate() - 6)
      dateRange = {
        from: DateTime.fromJSDate(lastDay).toFormat('yyyy-MM-dd'),
        to: DateTime.fromJSDate(firstDay).toFormat('yyyy-MM-dd'),
      }
    }
    return dateRange
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{t('attendanceTrend')}</div>
      {renderView()}
    </div>
  )
}

export default AttendanceTrend

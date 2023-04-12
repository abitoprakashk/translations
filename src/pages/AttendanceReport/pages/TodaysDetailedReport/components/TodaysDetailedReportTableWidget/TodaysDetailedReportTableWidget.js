import {DateTime} from 'luxon'
import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {useParams} from 'react-router-dom'
import globalActions from '../../../../../../redux/actions/global.actions'
import {
  DEFAULT_SLIDER_VALUE,
  DATE_FILTER,
} from '../../../../AttendanceReport.constant'
import FilterList from '../../../../components/FilterList/FilterList'
import SearchNFilter from '../../../../components/SearchNFilter/SearchNFilter'
import useGetDateFilterRange from '../../../../hooks/useGetDateFilterRange'
import {
  setAttendanceFilter,
  setDateFilter,
  setFilterData,
  setTableSearch,
} from '../../../../redux/AttendanceReport.actions'
import {AttendanceReportReducerKey} from '../../../../redux/AttendanceReportReducer'
import useTodayDetailedAttendanceTableData from '../../hooks/useTodayDetailedAttendanceTableData'
import TodayDetailedReportTable from '../TodayDetailedReportTable/TodayDetailedReportTable'
import styles from './TodaysDetailedReportTableWidget.module.css'

function TodaysDetailedReportTableWidget({selectedDateObj}) {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const dateRange = useGetDateFilterRange({
    reducerKey: AttendanceReportReducerKey.TODAY_ATTENDANCE,
  })
  const {classId} = useParams()
  const {rows, isLoading} = useTodayDetailedAttendanceTableData()
  const getData = () => {
    dispatch(globalActions.attendanceInsights.request(dateRange))
  }
  useEffect(() => {
    // reset on unmount to avoid api call
    return () => {
      dispatch(
        setDateFilter({
          data: null,
          key: AttendanceReportReducerKey.TODAY_ATTENDANCE,
        })
      )
    }
  }, [])

  useEffect(() => {
    const date = selectedDateObj ? selectedDateObj : new Date()
    dispatch(
      setDateFilter({
        data: {
          dropDownConstant: DATE_FILTER.CUSTOM,
          value: `${DateTime.fromJSDate(date).toFormat('dd LLL')}
                `,
          meta: {
            startDate: date,
            endDate: date,
            key: 'selection',
          },
        },
        key: AttendanceReportReducerKey.TODAY_ATTENDANCE,
      })
    )
  }, [selectedDateObj])

  useEffect(() => {
    dateRange && getData()
  }, [dateRange])

  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <SearchNFilter
            hideClassNSection={classId}
            selectedClass={classId}
            hideDateFilter={classId}
            showDatePicker
            download={{disableDownload: isLoading || !rows?.length}}
            maxDate={new Date()}
            setAttendance
            actions={{
              setFilterData: (payload) =>
                setFilterData({
                  key: AttendanceReportReducerKey.TODAY_ATTENDANCE,
                  data: payload,
                }),
              setTableSearch: (payload) =>
                setTableSearch({
                  key: AttendanceReportReducerKey.TODAY_ATTENDANCE,
                  data: payload,
                }),
              setDateFilter: (payload) =>
                setDateFilter({
                  key: AttendanceReportReducerKey.TODAY_ATTENDANCE,
                  data: payload,
                }),
              setAttendanceFilter: (payload) =>
                setAttendanceFilter({
                  key: AttendanceReportReducerKey.TODAY_ATTENDANCE,
                  data: payload,
                }),
            }}
            reducerKey={AttendanceReportReducerKey.TODAY_ATTENDANCE}
            defaultMarkFilter={{
              MARKED: {
                title: t('marked'),
                id: 'MARKED',
                isSelected: false,
                sliderValue: DEFAULT_SLIDER_VALUE,
              },
              NOT_MARKED: {
                title: t('notMarkedSentenceCase'),
                id: 'NOT_MARKED',
              },
            }}
          />
          <FilterList
            hideDateChip
            reducerKey={AttendanceReportReducerKey.TODAY_ATTENDANCE}
          />
        </div>
      </div>
      <TodayDetailedReportTable />
    </div>
  )
}

export default TodaysDetailedReportTableWidget

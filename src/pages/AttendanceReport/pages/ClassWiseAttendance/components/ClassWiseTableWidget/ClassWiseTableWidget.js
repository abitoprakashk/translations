import {DateTime} from 'luxon'
import React, {useEffect, useLayoutEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {
  REPORT_DEFAULT_SLIDER_VALUE,
  DATE_FILTER,
} from '../../../../AttendanceReport.constant'
import SearchNFilter from '../../../../components/SearchNFilter/SearchNFilter'
import useGetDateFilterRange from '../../../../hooks/useGetDateFilterRange'
import {
  setDateFilter,
  setFilterData,
  setTableSearch,
} from '../../../../redux/AttendanceReport.actions'
import {AttendanceReportReducerKey} from '../../../../redux/AttendanceReportReducer'
import useClassWiseTableData from '../../hooks/useClassWiseTableData'
import ClassWiseTable from '../ClassWiseTable/ClassWiseTable'
import styles from './ClassWiseTableWidget.module.css'

function ClassWiseTableWidget({selectedDateObj, hideDateFilter}) {
  const dispatch = useDispatch()
  const dateRange = useGetDateFilterRange({
    reducerKey: AttendanceReportReducerKey.CLASS_WISE,
  })
  const {rows, isLoading} = useClassWiseTableData()
  const {t} = useTranslation()
  const getData = () => {
    dispatch(globalActions.attendanceRegister.request(dateRange))
  }
  useLayoutEffect(() => {
    const fromDate = new Date()
    const toDate = new Date()
    dispatch(
      setDateFilter({
        data: {
          dropDownConstant: DATE_FILTER.CUSTOM,
          value: `${DateTime.fromJSDate(fromDate).toFormat('dd LLL')}
                `,
          meta: {
            startDate: selectedDateObj ? selectedDateObj : fromDate,
            endDate: selectedDateObj ? selectedDateObj : toDate,
            key: 'selection',
          },
        },
        key: AttendanceReportReducerKey.CLASS_WISE,
      })
    )
    // reset on unmount to avoid api call
    return () => {
      dispatch(
        setDateFilter({
          data: null,
          key: AttendanceReportReducerKey.CLASS_WISE,
        })
      )
    }
  }, [])
  useEffect(() => {
    dateRange && getData()
  }, [dateRange])
  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <SearchNFilter
            download={{disableDownload: isLoading || !rows?.length}}
            reducerKey={AttendanceReportReducerKey.CLASS_WISE}
            maxDate={new Date()}
            hideDateFilter={!!hideDateFilter}
            hidemarkFilter
            showDatePicker
            actions={{
              setFilterData: (payload) =>
                setFilterData({
                  key: AttendanceReportReducerKey.CLASS_WISE,
                  data: payload,
                }),
              setTableSearch: (payload) =>
                setTableSearch({
                  key: AttendanceReportReducerKey.CLASS_WISE,
                  data: payload,
                }),
              setDateFilter: (payload) =>
                setDateFilter({
                  key: AttendanceReportReducerKey.CLASS_WISE,
                  data: payload,
                }),
            }}
            defaultMarkFilter={{
              MARKED: {
                title: t('marked'),
                id: 'MARKED',
                isSelected: true,
                sliderValue: REPORT_DEFAULT_SLIDER_VALUE,
              },
              NOT_MARKED: {
                title: t('notMarkedSentenceCase'),
                id: 'NOT_MARKED',
              },
            }}
          />
        </div>
      </div>
      <ClassWiseTable getData={getData} />
    </div>
  )
}

export default ClassWiseTableWidget

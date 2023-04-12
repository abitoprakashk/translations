import {DateTime} from 'luxon'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom'
import globalActions from '../../../../../../redux/actions/global.actions'
import {DATE_FILTER} from '../../../../AttendanceReport.constant'
import SearchNFilter from '../../../../components/SearchNFilter/SearchNFilter'
import useGetDateFilterRange from '../../../../hooks/useGetDateFilterRange'
import {
  setDateFilter,
  setFilterData,
  setTableSearch,
} from '../../../../redux/AttendanceReport.actions'
import {AttendanceReportReducerKey} from '../../../../redux/AttendanceReportReducer'
import {getDateRange} from '../../../Overview/utils/dateRange.util'
import DateWiseTable from '../DateWiseTable/DateWiseTable'
import styles from './DateWisetableWidget.module.css'

function DateWiseTableWidget() {
  const [date, setdate] = useState(null)
  const dispatch = useDispatch()
  const {instituteInfo} = useSelector((state) => state)
  const search = useLocation().search
  const filter =
    new URLSearchParams(search)?.get('filter') || DATE_FILTER.THIS_MONTH.value
  // to call API
  const dateRange = useGetDateFilterRange({
    reducerKey: AttendanceReportReducerKey.DATE_WISE,
  })

  useEffect(() => {
    setdate(getDateRange({instituteInfo, filter}))
  }, [filter])

  useEffect(() => {
    if (date) {
      const fromDate = new Date(date.from)
      const toDate = new Date(date.to)
      dispatch(
        setDateFilter({
          data: {
            dropDownConstant: DATE_FILTER.CUSTOM,
            value: `${DateTime.fromJSDate(fromDate).toFormat('dd LLL')} -
                  ${DateTime.fromJSDate(toDate).toFormat('dd LLL')}
                `,
            meta: {
              startDate: fromDate,
              endDate: toDate,
              key: 'selection',
            },
          },
          key: AttendanceReportReducerKey.DATE_WISE,
        })
      )
    }
  }, [date])

  const getData = () => {
    dispatch(globalActions.dateWiseAttendance.request(dateRange))
  }

  useEffect(() => {
    dateRange && getData()
  }, [dateRange])

  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <SearchNFilter
            maxDate={new Date()}
            download={{hideDownload: true}}
            onlyCustomRange
            hideFilter
            hideSearch
            actions={{
              setFilterData: (payload) =>
                setFilterData({
                  key: AttendanceReportReducerKey.DATE_WISE,
                  data: payload,
                }),
              setTableSearch: (payload) =>
                setTableSearch({
                  key: AttendanceReportReducerKey.DATE_WISE,
                  data: payload,
                }),
              setDateFilter: (payload) =>
                setDateFilter({
                  key: AttendanceReportReducerKey.DATE_WISE,
                  data: payload,
                }),
            }}
            reducerKey={AttendanceReportReducerKey.DATE_WISE}
          />
        </div>
      </div>
      <DateWiseTable />
    </div>
  )
}

export default DateWiseTableWidget

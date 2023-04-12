import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import FilterList from '../../../../components/FilterList/FilterList'
import SearchNFilter from '../../../../components/SearchNFilter/SearchNFilter'
import StudentWiseTable from '../StudentWiseTable/StudentWiseTable'
import styles from './StudentWiseTableWidget.module.css'
import {
  setDateFilter,
  setFilterData,
  setTableSearch,
} from '../../../../redux/AttendanceReport.actions'
import {AttendanceReportReducerKey} from '../../../../redux/AttendanceReportReducer'
import useGetDateFilterRange from '../../../../hooks/useGetDateFilterRange'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'react-router-dom'
import {
  INSIGHT_FILTER,
  REPORT_DEFAULT_SLIDER_VALUE,
  DATE_FILTER,
} from '../../../../AttendanceReport.constant'
import useStudentWiseTableData from '../../hooks/useStudentWiseTableData'

function StudentWiseTableWidget() {
  const dispatch = useDispatch()
  const dateRange = useGetDateFilterRange({reducerKey: 'studentWise'})
  const {t} = useTranslation()
  const search = useLocation().search
  const sliderValue = new URLSearchParams(search)?.get('sliderValue')
  const {rows, isLoading} = useStudentWiseTableData()

  const getData = () => {
    dispatch(globalActions.attendanceInsights.request(dateRange))
  }

  useEffect(() => {
    dateRange && getData()
  }, [dateRange])

  //  handle pre selected filter from query param
  useEffect(() => {
    let payload
    const dateFilter = new URLSearchParams(search)?.get('dateFilter')

    if (dateFilter === INSIGHT_FILTER.SESSION) {
      payload = {
        dropDownConstant: DATE_FILTER.THIS_SESSION,
        value: DATE_FILTER.THIS_SESSION.label,
      }
    } else {
      payload = {
        dropDownConstant: DATE_FILTER.THIS_MONTH,
        value: DATE_FILTER.THIS_MONTH.label,
      }
    }

    dispatch(
      setDateFilter({
        key: AttendanceReportReducerKey.STUDENT_WISE,
        data: payload,
      })
    )

    // slider value
    // SET in searchNFilter
  }, [])

  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <SearchNFilter
            download={{disableDownload: isLoading || !rows?.length}}
            maxDate={new Date()}
            actions={{
              setFilterData: (payload) =>
                setFilterData({
                  key: AttendanceReportReducerKey.STUDENT_WISE,
                  data: payload,
                }),
              setTableSearch: (payload) =>
                setTableSearch({
                  key: AttendanceReportReducerKey.STUDENT_WISE,
                  data: payload,
                }),
              setDateFilter: (payload) =>
                setDateFilter({
                  key: AttendanceReportReducerKey.STUDENT_WISE,
                  data: payload,
                }),
            }}
            defaultMarkFilter={{
              MARKED: {
                title: t('marked'),
                id: 'MARKED',
                isSelected: true,
                sliderValue: +sliderValue || REPORT_DEFAULT_SLIDER_VALUE,
              },
              NOT_MARKED: {
                title: t('notMarkedSentenceCase'),
                id: 'NOT_MARKED',
              },
            }}
            reducerKey={AttendanceReportReducerKey.STUDENT_WISE}
          />
          <FilterList reducerKey={AttendanceReportReducerKey.STUDENT_WISE} />
        </div>
      </div>
      <StudentWiseTable getData={getData} />
    </div>
  )
}

export default StudentWiseTableWidget

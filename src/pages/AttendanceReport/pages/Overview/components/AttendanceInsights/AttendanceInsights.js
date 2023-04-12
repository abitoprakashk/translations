import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {DEFAULT_SLIDER_VALUE} from '../../../../AttendanceReport.constant'
import RetryOverlay from '../../../../components/RetryOverlay/RetryOverlay'
import useGetDateRange from '../../../../hooks/useGetDateRange'
import useAttendanceInsightData from '../../hooks/useAttendanceInsightData'
import useAttendanceInsightFilter from '../../hooks/useAttendanceInsightFilter'
import styles from './AttendanceInsights.module.css'
import AttendanceInsightFilter from './components/AttendanceInsightFilter/AttendanceInsightFilter'
import AttendanceInsightShimmer from './components/InsightView/AttendanceInsightShimmer'
import InsightView from './components/InsightView/InsightView'
import NoData from './components/NoData/NoData'

function AttendanceInsights() {
  const {t} = useTranslation()
  const [selectedFilter, onFilterChange] = useAttendanceInsightFilter()
  const {data, loaded, error, isLoading} = useAttendanceInsightData()

  const [sliderValue, setsliderValue] = useState(DEFAULT_SLIDER_VALUE)
  const dateRange = useGetDateRange(selectedFilter)
  const dispatch = useDispatch()

  const getData = () => {
    dispatch(globalActions.attendanceInsights.request(dateRange))
  }

  useEffect(() => {
    if (selectedFilter && dateRange) {
      getData()
    }
  }, [dateRange])

  const renderView = () => {
    if (error) {
      return (
        <div className={styles.errorWrapper}>
          <RetryOverlay onretry={getData} />
        </div>
      )
    }
    if (isLoading) return <AttendanceInsightShimmer />
    if (!data) {
      return <NoData />
    }
    if (loaded && data) {
      return (
        <>
          <AttendanceInsightFilter
            selectedFilter={selectedFilter}
            onFilterChange={onFilterChange}
          />
          <InsightView
            sliderValue={sliderValue}
            setsliderValue={setsliderValue}
            selectedFilter={selectedFilter}
            data={data}
          />
        </>
      )
    }
    return <AttendanceInsightShimmer />
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{t('attendanceInsights')}</div>
      {renderView()}
    </div>
  )
}

export default AttendanceInsights

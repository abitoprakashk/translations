import React, {useEffect, useMemo} from 'react'
import styles from './TodayAttendanceChart.module.css'
import {Doughnut} from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Legend from '../Legend/Legend'
import TodayAttendanceChartShimmer from './TodayAttendanceChartShimmer'
import {useDispatch} from 'react-redux'
import globalActions from '../../../../../../../../redux/actions/global.actions'
import RetryOverlay from '../../../../../../components/RetryOverlay/RetryOverlay'
import useAttendanceChartData from '../../../../hooks/useAttendanceChartData'
import {useTranslation} from 'react-i18next'
import useGetDateRange from '../../../../../../hooks/useGetDateRange'
import {DATE_RANGE} from '../../../../../../AttendanceReport.constant'
import NoChartData from './components/NoChartData'
import useInstituteAssignedStudents from '../../../../../StudentWiseAttendance/hooks/useInstituteAssignedStudents'

function TodayAttendanceChart() {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {loaded, data, error, isLoading} = useAttendanceChartData()
  const activeStudentList = useInstituteAssignedStudents()
  const dateRange = useGetDateRange(DATE_RANGE.DAILY)

  const legends = useMemo(
    () => [
      {
        label: t('present'),
        color: '#A8D793',
      },
      {
        label: t('absent'),
        color: '#F19A8E',
      },
      {
        label: t('notMarkedSentenceCase'),
        color: '#CCCCCC',
      },
    ],
    [t]
  )

  useEffect(() => {
    dateRange && getData()
  }, [dateRange])

  const getData = () => {
    dispatch(globalActions.todayAttendance.request(dateRange))
  }

  const renderView = () => {
    if (error) {
      return (
        <div className={styles.errorWrapper}>
          <RetryOverlay onretry={getData} />
        </div>
      )
    }
    if (!activeStudentList?.length) {
      return <NoChartData />
    }
    if (!loaded || isLoading) {
      return (
        <div className={styles.chartWrapper}>
          <TodayAttendanceChartShimmer />
        </div>
      )
    }
    if (loaded && data) {
      return (
        <div className={styles.chartWrapper}>
          <Doughnut options={options} data={data} plugins={[ChartDataLabels]} />
          <Legend data={legends} />
          {!data?.metaData?.A && !data?.metaData?.P ? (
            data?.metaData?.NM ? (
              <div className={styles.notMarkedText}>
                {t('attendanceNotMarked')}
              </div>
            ) : null
          ) : null}
        </div>
      )
    }
  }

  return <div className={styles.wrapper}>{renderView()}</div>
}

export default TodayAttendanceChart

const options = {
  events: [],
  plugins: {
    borderWidth: 10,
    hoverBorderColor: 'transparent',
    datalabels: {
      color: '#212427',
      fontWeight: 700,
      font: {
        weight: 'bold',
      },
      formatter: function (value, context) {
        return context.chart.data.labels[context.dataIndex]
      },
    },
    legend: {
      display: false,
    },
  },
}

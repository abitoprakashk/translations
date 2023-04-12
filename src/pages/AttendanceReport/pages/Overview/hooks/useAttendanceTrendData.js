import {DateTime} from 'luxon'
import {useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {TREND_FILTER} from '../../../AttendanceReport.constant'
import useInstituteAssignedStudents from '../../StudentWiseAttendance/hooks/useInstituteAssignedStudents'

function useAttendanceTrendData(selectedFilter) {
  const {
    attendanceTrend: {isLoading, loaded, data: initData, error},
  } = useSelector((state) => state.globalData)
  const {instituteInfo} = useSelector((state) => state)
  const [data, setData] = useState(initData)
  const activeStudentList = useInstituteAssignedStudents()

  useLayoutEffect(() => {
    if (initData) {
      if (selectedFilter === TREND_FILTER.DAILY) {
        normaliseDailyTrend()
      } else {
        normaliseMonthlyTrend()
      }
    }
  }, [
    isLoading,
    loaded,
    initData,
    error,
    selectedFilter,
    instituteInfo,
    activeStudentList,
  ])

  const normaliseDailyTrend = () => {
    let lastSevenDays = []

    let date = new Date(
      new Date().toLocaleString('en-EU', {
        timeZone: instituteInfo.timezone,
      })
    )
    //  will not get notMarked data for today
    Array(7)
      .fill()
      .forEach((_, i) => {
        lastSevenDays.push({
          day: DateTime.fromJSDate(date).toFormat('yyyy-MM-dd'),
          title: DateTime.fromJSDate(date).toFormat('dd LLL'),
          subTitle: DateTime.fromJSDate(date).toFormat('ccc'),
          weeklyOff: i !== 0,
          notMarked: i === 0,
          today: i === 0,
        })
        date.setDate(date.getDate() - 1)
      })

    let normalisedData = lastSevenDays
    initData.map(({P: present, A: absent, NM: notMarked, day}) => {
      //
      normalisedData.some((normalisedDay) => {
        if (normalisedDay.today) {
          notMarked = activeStudentList?.length - (present + absent) || 0
        }
        if (normalisedDay.day === day) {
          normalisedDay.value = Math.round(
            (present / (absent + notMarked + present)) * 100
          )
          if (!present && !absent) {
            normalisedDay.notMarked = true
          } else {
            normalisedDay.notMarked = false
          }
          normalisedDay.weeklyOff = false
          return true
        }
      })
    })
    setData(normalisedData)
  }

  const normaliseMonthlyTrend = () => {
    let lastSevenMonths = []
    let date = new Date(
      new Date().toLocaleString('en-EU', {
        timeZone: instituteInfo.timezone,
      })
    )
    date.setDate(1)
    Array(7)
      .fill()
      .forEach(() => {
        lastSevenMonths.push({
          month: DateTime.fromJSDate(date).toFormat('yyyy-MM-dd'),
          title: DateTime.fromJSDate(date).toFormat('LLL'),
          subTitle: DateTime.fromJSDate(date).toFormat('yyyy'),
          notMarked: true,
        })
        date.setMonth(date.getMonth() - 1)
      })
    let normalisedData = lastSevenMonths

    initData.map(({P: present, A: absent, NM: notMarked, month}) => {
      //
      normalisedData.some((normalisedDay) => {
        if (normalisedDay.month === month) {
          normalisedDay.value = Math.round(
            (present / (absent + notMarked + present)) * 100
          )
          normalisedDay.notMarked = false
          return true
        }
      })
    })
    setData(normalisedData)
  }

  return {isLoading, loaded, data, error}
}

export default useAttendanceTrendData

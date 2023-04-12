import {DateTime} from 'luxon'
import {useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {DATE_FORMAT, SORT_TYPE} from '../../../AttendanceReport.constant'
import {basicSort, dateSort} from '../../Overview/utils/utils'

function useDateWiseData() {
  const {
    dateWiseAttendance: {isLoading, loaded, data: initData, error},
  } = useSelector((state) => state.globalData)
  const {
    instituteInfo,
    attendanceReportReducer: {
      dateWise: {dateFilter},
    },
  } = useSelector((state) => state)

  const {meta} = dateFilter || {}
  const [data, setData] = useState(null)
  const [sort, setsort] = useState({
    key: 'student',
    type: SORT_TYPE.ASC,
  })

  const getDateRange = () => {
    const {startDate, endDate} = meta
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
    let today = new Date(
      new Date(new Date()).toLocaleString('en-EU', {
        timeZone: instituteInfo.timezone,
      })
    )
    today.setHours(0, 0, 0, 0)

    const dates = []
    let date = new Date(
      new Date(+endDate > +today ? today : endDate).toLocaleString('en-EU', {
        timeZone: instituteInfo.timezone,
      })
    )
    date.setHours(0, 0, 0, 0)

    for (;;) {
      dates.push(DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd'))
      if (+date === +startDate) {
        break
      }
      date.setDate(date.getDate() - 1)
    }
    return dates
  }

  const handleSort = (data) => {
    if (!sort) return data
    let newData = data
    if (sort.key === 'dateString') {
      newData = dateSort({
        data: data,
        key: 'day',
        type: sort.type,
      })
    } else if (sort.key === 'attendancePercentage') {
      newData = basicSort({
        data: data,
        key: 'percentage',
        type: sort.type,
      })
    } else if (sort.key === 'markedClasses') {
      newData = basicSort({
        data: data,
        key: 'marked',
        type: sort.type,
      })
    } else if (sort.key === 'notMarkedClasses') {
      newData = basicSort({
        data: data,
        key: 'not_marked',
        type: sort.type,
      })
    }
    return newData
  }

  useLayoutEffect(() => {
    if (meta) {
      const dates = getDateRange()
      let normalisedData = []
      dates.map((date) => {
        const jsDate = new Date(date)
        const [matchedDate] = initData?.filter((row) => row.day === date) || []
        const _row = {
          day: date,
          P: 0,
          A: 0,
          NM: 0,
          formattedDate: DateTime.fromJSDate(jsDate).toFormat(DATE_FORMAT),
          ...(matchedDate ? {...matchedDate} : {marked: 0, not_marked: 0}),
        }
        _row.percentage = Math.round(
          (_row.P / (_row.A + _row.NM + _row.P)) * 100
        )
        normalisedData.push(_row || 0)
      })
      //sort
      normalisedData = handleSort(normalisedData)
      setData(normalisedData)
    }
  }, [meta, initData, sort])

  return {isLoading, loaded, data, error, sort, setsort}
}

export default useDateWiseData

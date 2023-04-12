import {DateTime} from 'luxon'
import {useCallback, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {DATE_RANGE} from '../AttendanceReport.constant'

function useGetDateRange(type) {
  const [date, setdate] = useState(null)
  const {
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
    instituteInfo,
  } = useSelector((state) => state)

  const getDateRange = useCallback(() => {
    if (type === DATE_RANGE.MONTH) {
      const date = new Date(
        new Date().toLocaleString('en-EU', {
          timeZone: instituteInfo.timezone,
        })
      ) // get current date
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      setdate({
        from: DateTime.fromJSDate(firstDay).toFormat('yyyy-MM-dd'),
        to: DateTime.fromJSDate(lastDay).toFormat('yyyy-MM-dd'),
      })
    } else if (type === DATE_RANGE.DAILY) {
      const curr = new Date(
        new Date().toLocaleString('en-EU', {
          timeZone: instituteInfo.timezone,
        })
      ) // get current date
      const today = DateTime.fromJSDate(curr).toFormat('yyyy-MM-dd')
      let tomorrow = curr
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow = DateTime.fromJSDate(tomorrow).toFormat('yyyy-MM-dd')
      setdate({
        from: today,
        to: tomorrow,
      })
    } else if (type === DATE_RANGE.SESSION) {
      instituteAcademicSessionInfo?.map((session) => {
        if (session._id === instituteActiveAcademicSessionId) {
          setdate({
            from: DateTime.fromJSDate(new Date(+session.start_time)).toFormat(
              'yyyy-MM-dd'
            ),
            to: DateTime.fromJSDate(new Date(+session.end_time)).toFormat(
              'yyyy-MM-dd'
            ),
          })
        }
      })
    }
  }, [type])

  useEffect(() => {
    getDateRange()
  }, [type])

  return date
}

export default useGetDateRange

import {DateTime} from 'luxon'
import {useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {DATE_FILTER} from '../AttendanceReport.constant'
const TIMEZONE = 'en-EU'
const DATE_FORMAT = 'yyyy-MM-dd'
function useGetDateFilterRange({reducerKey}) {
  const [date, setdate] = useState(null)
  const {dateFilter} = useSelector(
    (state) => state.attendanceReportReducer[reducerKey]
  )
  const {
    instituteInfo,
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
  } = useSelector((state) => state)
  const _curr = new Date(
    new Date().toLocaleString(TIMEZONE, {
      timeZone: instituteInfo.timezone,
    })
  )

  const getDateRange = () => {
    if (dateFilter?.dropDownConstant?.value === DATE_FILTER.THIS_WEEK.value) {
      //
      const curr = new Date(_curr) // get current date
      const _first = new Date(_curr)
      const _last = new Date(_curr)
      const first = curr.getDate() - curr.getDay() + 1 // First day is the day of the month - the day of the week
      const last = first + 6 // last day is the first day + 6
      const firstday = new Date(_first.setDate(first))
      const lastday = new Date(_last.setDate(last))
      setdate({
        from: DateTime.fromJSDate(firstday).toFormat(DATE_FORMAT),
        to: DateTime.fromJSDate(lastday).toFormat(DATE_FORMAT),
      })
    } else if (
      dateFilter?.dropDownConstant?.value === DATE_FILTER.THIS_MONTH.value
    ) {
      //
      const date = new Date(_curr) // get current date
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      setdate({
        from: DateTime.fromJSDate(firstDay).toFormat(DATE_FORMAT),
        to: DateTime.fromJSDate(lastDay).toFormat(DATE_FORMAT),
      })
    } else if (
      dateFilter?.dropDownConstant?.value === DATE_FILTER.LAST_MONTH.value
    ) {
      //
      const date = new Date(_curr) // get current date
      const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1)
      const lastDay = new Date(date.getFullYear(), date.getMonth(), 0)
      setdate({
        from: DateTime.fromJSDate(firstDay).toFormat(DATE_FORMAT),
        to: DateTime.fromJSDate(lastDay).toFormat(DATE_FORMAT),
      })
    } else if (
      dateFilter?.dropDownConstant?.value === DATE_FILTER.LAST_WEEK.value
    ) {
      //
      const curr = new Date(_curr) // get current date
      const _first = new Date(_curr)
      const _last = new Date(_curr)
      const last = curr.getDate() - curr.getDay() // First day is the day of the month - the day of the week
      const first = last - 6 // last day is the first day + 6
      const firstday = new Date(_first.setDate(first))
      const lastday = new Date(_last.setDate(last))
      setdate({
        from: DateTime.fromJSDate(firstday).toFormat(DATE_FORMAT),
        to: DateTime.fromJSDate(lastday).toFormat(DATE_FORMAT),
      })
    } else if (
      dateFilter?.dropDownConstant?.value === DATE_FILTER.THIS_SESSION.value
    ) {
      //
      instituteAcademicSessionInfo?.map((session) => {
        if (session._id === instituteActiveAcademicSessionId) {
          setdate({
            from: DateTime.fromJSDate(new Date(+session.start_time)).toFormat(
              DATE_FORMAT
            ),
            to: DateTime.fromJSDate(new Date(+session.end_time)).toFormat(
              DATE_FORMAT
            ),
          })
        }
      })
    } else if (
      dateFilter?.dropDownConstant?.value === DATE_FILTER.CUSTOM.value
    ) {
      //
      const firstday = new Date(dateFilter?.meta.startDate)
      const lastday = new Date(dateFilter?.meta.endDate)
      setdate({
        from: DateTime.fromJSDate(firstday).toFormat(DATE_FORMAT),
        to: DateTime.fromJSDate(lastday).toFormat(DATE_FORMAT),
      })
    }
  }

  useLayoutEffect(() => {
    getDateRange()
  }, [dateFilter])
  return date
}

export default useGetDateFilterRange

import {DateTime} from 'luxon'
import {useLayoutEffect, useMemo, useState} from 'react'
import {useSelector} from 'react-redux'

const TIMEZONE = 'en-EU'
const DATE_FORMAT = 'yyyy-MM-dd'

export const DATE_FILTER = {
  TODAY: {
    value: 'TODAY',
    label: 'today',
  },
  THIS_WEEK: {
    value: 'THIS_WEEK',
    label: 'thisWeekSentenceCase',
  },
  THIS_MONTH: {
    value: 'THIS_MONTH',
    label: 'thisMonthSentenceCase',
  },
  LAST_WEEK: {
    value: 'LAST_WEEK',
    label: 'lastWeek',
  },
  LAST_MONTH: {
    value: 'LAST_MONTH',
    label: 'lastMonthSentenceCase',
  },
  THIS_SESSION: {
    value: 'THIS_SESSION',
    label: 'thisSessionSentenceCase',
  },
  CUSTOM: {
    value: 'CUSTOM',
    label: 'customDateRange',
    meta: {}, // used to store js Date of selected range
  },
}
export const DATE_FILTER_API_REQUEST = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  LAST_WEEK: 'last_week',
  LAST_MONTH: 'last_month',
  THIS_SESSION: 'this_session',
  CUSTOM: 'custom',
}

export const DATE_FILTER_API_RESPONSE = {
  today: 'TODAY',
  this_week: 'THIS_WEEK',
  this_month: 'THIS_MONTH',
  last_week: 'LAST_WEEK',
  last_month: 'LAST_MONTH',
  this_session: 'THIS_SESSION',
  custom: 'CUSTOM',
}

function useGetDateFilterRange({defaultDate, dateFormat = DATE_FORMAT} = {}) {
  const [date, setdate] = useState(null)
  const {
    instituteInfo,
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
  } = useSelector((state) => state)
  const _curr = useMemo(
    () =>
      new Date(
        new Date().toLocaleString(TIMEZONE, {
          timeZone: instituteInfo.timezone,
        })
      ),
    [TIMEZONE, instituteInfo]
  )

  const getDateRange = () => {
    if (defaultDate?.value === DATE_FILTER.TODAY.value) {
      const curr = new Date(_curr)
      setdate({
        type: DATE_FILTER_API_REQUEST[defaultDate.value],
        from: DateTime.fromJSDate(curr).toFormat(dateFormat),
        to: DateTime.fromJSDate(curr).toFormat(dateFormat),
      })
    } else if (defaultDate?.value === DATE_FILTER.THIS_WEEK.value) {
      const curr = new Date(_curr) // get current date
      const _first = new Date(_curr)
      const _last = new Date(_curr)
      const first = curr.getDate() - curr.getDay() + 1 // First day is the day of the month - the day of the week
      const last = first + 6 // last day is the first day + 6
      const firstday = new Date(_first.setDate(first))
      const lastday = new Date(_last.setDate(last))
      setdate({
        type: DATE_FILTER_API_REQUEST[defaultDate.value],
        from: DateTime.fromJSDate(firstday).toFormat(dateFormat),
        to: DateTime.fromJSDate(lastday).toFormat(dateFormat),
      })
    } else if (defaultDate?.value === DATE_FILTER.THIS_MONTH.value) {
      //
      const date = new Date(_curr) // get current date
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      setdate({
        type: DATE_FILTER_API_REQUEST[defaultDate.value],
        from: DateTime.fromJSDate(firstDay).toFormat(dateFormat),
        to: DateTime.fromJSDate(lastDay).toFormat(dateFormat),
      })
    } else if (defaultDate?.value === DATE_FILTER.LAST_MONTH.value) {
      //
      const date = new Date(_curr) // get current date
      const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1)
      const lastDay = new Date(date.getFullYear(), date.getMonth(), 0)
      setdate({
        type: DATE_FILTER_API_REQUEST[defaultDate.value],
        from: DateTime.fromJSDate(firstDay).toFormat(dateFormat),
        to: DateTime.fromJSDate(lastDay).toFormat(dateFormat),
      })
    } else if (defaultDate?.value === DATE_FILTER.LAST_WEEK.value) {
      //
      const curr = new Date(_curr) // get current date
      const _first = new Date(_curr)
      const _last = new Date(_curr)
      const last = curr.getDate() - curr.getDay() // First day is the day of the month - the day of the week
      const first = last - 6 // last day is the first day + 6
      const firstday = new Date(_first.setDate(first))
      const lastday = new Date(_last.setDate(last))
      setdate({
        type: DATE_FILTER_API_REQUEST[defaultDate.value],
        from: DateTime.fromJSDate(firstday).toFormat(dateFormat),
        to: DateTime.fromJSDate(lastday).toFormat(dateFormat),
      })
    } else if (defaultDate?.value === DATE_FILTER.THIS_SESSION.value) {
      //
      instituteAcademicSessionInfo?.map((session) => {
        if (session._id === instituteActiveAcademicSessionId) {
          setdate({
            type: DATE_FILTER_API_REQUEST[defaultDate.value],
            from: DateTime.fromJSDate(new Date(+session.start_time)).toFormat(
              dateFormat
            ),
            to: DateTime.fromJSDate(new Date(+session.end_time)).toFormat(
              dateFormat
            ),
          })
        }
      })
    } else if (
      defaultDate?.value === DATE_FILTER.CUSTOM.value &&
      defaultDate?.meta?.startDate
    ) {
      //
      const firstday = new Date(defaultDate?.meta.startDate)
      const lastday = new Date(defaultDate?.meta.endDate)
      setdate({
        type: DATE_FILTER_API_REQUEST[defaultDate.value],
        from: DateTime.fromJSDate(firstday).toFormat(dateFormat),
        to: DateTime.fromJSDate(lastday).toFormat(dateFormat),
      })
    }
  }

  useLayoutEffect(() => {
    getDateRange()
  }, [defaultDate])
  return date
}

export default useGetDateFilterRange

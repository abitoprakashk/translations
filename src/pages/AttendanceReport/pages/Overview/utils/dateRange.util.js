import {DateTime} from 'luxon'
import {DATE_FILTER} from '../../../AttendanceReport.constant'

export const getDateRange = ({filter, instituteInfo}) => {
  if (filter === DATE_FILTER.THIS_MONTH.value) {
    const date = new Date(
      new Date().toLocaleString('en-EU', {
        timeZone: instituteInfo.timezone,
      })
    ) // get current date
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return {
      from: DateTime.fromJSDate(firstDay).toFormat('yyyy-MM-dd'),
      to: DateTime.fromJSDate(lastDay).toFormat('yyyy-MM-dd'),
    }
  }
  if (filter === DATE_FILTER.THIS_WEEK.value) {
    const curr = new Date(
      new Date().toLocaleString('en-EU', {
        timeZone: instituteInfo.timezone,
      })
    ) // get current date
    const _first = new Date(
      new Date().toLocaleString('en-EU', {
        timeZone: instituteInfo.timezone,
      })
    )
    const _last = new Date(
      new Date().toLocaleString('en-EU', {
        timeZone: instituteInfo.timezone,
      })
    )
    const first = curr.getDate() - curr.getDay() // First day is the day of the month - the day of the week
    const last = first + 6 // last day is the first day + 6
    const firstday = new Date(_first.setDate(first))
    const lastday = new Date(_last.setDate(last))
    return {
      from: DateTime.fromJSDate(firstday).toFormat('yyyy-MM-dd'),
      to: DateTime.fromJSDate(lastday).toFormat('yyyy-MM-dd'),
    }
  }
}

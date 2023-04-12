import {t} from 'i18next'
import {DateTime} from 'luxon'
import {getOrdinalNum} from '../YearlyCalendar/commonFunctions'

const STANDARD_LEAVE_DATE_FORMAT = 'dd LLL yyyy'

export const parseFrequency = (item) => {
  const options = [
    {
      name: 'Mon',
      value: 1,
      fullname: 'Monday',
    },
    {
      name: 'Tue',
      value: 2,
      fullname: 'Tuesday',
    },
    {
      name: 'Wed',
      value: 3,
      fullname: 'Wednesday',
    },
    {
      name: 'Thu',
      value: 4,
      fullname: 'Thursday',
    },
    {
      name: 'Fri',
      value: 5,
      fullname: 'Friday',
    },
    {
      name: 'Sat',
      value: 6,
      fullname: 'Saturday',
    },
    {
      name: 'Sun',
      value: 7,
      fullname: 'Sunday',
    },
  ]
  const multiplier = 24 * 60 * 60
  const count = item?.start_duration_time?.length
  if (count == 5) return `All ${item.event_name}s`
  return (
    item.start_duration_time?.reduce((acc, elem, index) => {
      const calculated = elem / multiplier / 7
      const isSunday = !((elem / multiplier) % 7)
      if (acc)
        return `${acc} ${index + 1 == count ? ' & ' : ', '} ${getOrdinalNum(
          parseInt(isSunday ? calculated - 1 : calculated)
        )}`
      else
        return getOrdinalNum(parseInt(isSunday ? calculated - 1 : calculated))
    }, '') +
    ` ${
      options[
        parseInt((item?.start_duration_time[0] / multiplier) % 7) !== 0
          ? parseInt((item?.start_duration_time[0] / multiplier) % 7) - 1
          : 6
      ]?.fullname
    } of the month`
  )
}

export const getActiveSessionId = () => {
  let adminUUID = window.sessionStorage.getItem('ADMIN_UUID')
  const localdata = JSON.parse(localStorage.ADMINS_GLOBAL)
  if (localdata) {
    return JSON.parse(localStorage.ADMINS_GLOBAL)[adminUUID]
      ?.ACTIVE_ACADEMIC_SESSION_ID
  }
  return null
}
export const normalizePendingLeaves = (pendingLeaves, rolesList) => {
  if (pendingLeaves?.length) {
    return pendingLeaves.map((leave) => {
      const normalizedLeave = {
        ...leave,
        from: leave.from_date * 1000,
        to: leave.to_date * 1000,
        status_date: leave.status_date * 1000,
      }
      const fromLuxon = DateTime.fromMillis(normalizedLeave.from)
      const toLuxon = DateTime.fromMillis(normalizedLeave.to)
      const sameDay =
        fromLuxon.toFormat('ddLLyyyy') === toLuxon.toFormat('ddLLyyyy')
      const fromLeave = fromLuxon.toFormat(STANDARD_LEAVE_DATE_FORMAT)
      const toLeave = sameDay
        ? ''
        : toLuxon.toFormat(STANDARD_LEAVE_DATE_FORMAT)
      normalizedLeave.leaveDates = {
        from: fromLeave,
        to: toLeave,
        count: leave.no_of_days,
      }
      normalizedLeave.no_of_days = leave.no_of_days
      normalizedLeave.requestedOn = DateTime.fromMillis(
        normalizedLeave.c * 1000
      ).toFormat(STANDARD_LEAVE_DATE_FORMAT)

      if (normalizedLeave.edited_at) {
        normalizedLeave.updatedOn = DateTime.fromMillis(
          normalizedLeave.edited_at * 1000
        ).toFormat(STANDARD_LEAVE_DATE_FORMAT)
      }

      let rollName = normalizedLeave.role_name
      if (!rollName) {
        rollName = getRoleNames(
          normalizedLeave.roles,
          normalizedLeave.roles_to_assign,
          rolesList
        )
      }
      normalizedLeave.rollName = rollName
      normalizedLeave.statusBackup = normalizedLeave.status
      return normalizedLeave
    })
  }
  return pendingLeaves
}

export const getRoleNames = (roles, roles_to_assign, rolesList) => {
  let roleNameArr = []
  let roleIds = roles?.length > 0 ? roles : roles_to_assign
  let role = rolesList?.find((r) => roleIds?.includes(r._id))

  if (role?.name)
    roleNameArr.length >= 1
      ? roleNameArr.push(<span>&#44;&nbsp;{role.name}</span>)
      : roleNameArr.push(<span>{role.name}</span>)
  return role?.name || <span>{t('teacher')}</span>
}

const dateDiffFromToday = (
  date,
  {format = STANDARD_LEAVE_DATE_FORMAT, diffFormat = 'days'} = {}
) => {
  const today = DateTime.now().set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
  const targetDate =
    date instanceof DateTime ? date : DateTime.fromFormat(date, format)
  const result = targetDate.diff(today, diffFormat)
  return result.values[diffFormat]
}

export const isFutureDate = (
  date,
  {format = STANDARD_LEAVE_DATE_FORMAT} = {}
) => {
  if (!date) return false

  const result = dateDiffFromToday(date, {format, diffFormat: 'days'})
  return result >= 1
}

export const dayDiffFromToday = (
  date,
  {format = STANDARD_LEAVE_DATE_FORMAT} = {}
) => {
  if (!date) return false

  return dateDiffFromToday(date, {format, diffFormat: 'days'})
}

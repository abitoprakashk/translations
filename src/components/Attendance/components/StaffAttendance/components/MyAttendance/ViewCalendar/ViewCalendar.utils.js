import {DateTime} from 'luxon'
import classNames from 'classnames'
import styles from './ViewCalendar.module.css'
import {EDIT_ATTENDANCE_STATUS} from '../../../StaffAttendanceConstants'

const {
  ABSENT,
  HALF_DAY_PRESENT,
  WEEKLY_OFF,
  HOLIDAY,
  PRESENT,
  ON_LEAVE_FULL_DAY,
  LEFT_EARLY,
  ARRIVE_LATE,
  ARRIVE_LATE_LEFT_EARLY,
} = EDIT_ATTENDANCE_STATUS

const validStatus = [
  ABSENT,
  HALF_DAY_PRESENT,
  WEEKLY_OFF,
  HOLIDAY,
  PRESENT,
  ON_LEAVE_FULL_DAY,
  LEFT_EARLY,
  ARRIVE_LATE,
  ARRIVE_LATE_LEFT_EARLY,
  'TODAYS_DATE',
]

export const getUTCDateTimeStamp = ({year, month, day}) => {
  const utcTimeStamp = Date.UTC.apply(null, [year, month, day]) / 1000
  return utcTimeStamp
}

export const tsConstantMap = {
  TODAYS_DATE: {
    classname: 'cstTodaysDate',
    value: 'TODAYS_DATE',
  },
  [WEEKLY_OFF]: {
    classname: 'cstHoliday',
    label: 'Weekly off',
    value: WEEKLY_OFF,
  },
  [HOLIDAY]: {
    classname: 'cstHoliday',
    label: 'Holiday',
    value: HOLIDAY,
  },
  [ON_LEAVE_FULL_DAY]: {
    classname: 'cstFullDayLeave',
    label: 'Attendance not marked',
    value: ON_LEAVE_FULL_DAY,
  },
  [ABSENT]: {
    classname: 'cstAbsent',
    label: 'Attendance not marked',
    value: ABSENT,
  },
  [PRESENT]: {
    classname: 'cstPresent',
    label: 'Attendance not marked',
    value: PRESENT,
  },
  [HALF_DAY_PRESENT]: {
    classname: 'cstHalfDayLeave',
    label: 'Attendance not marked',
    value: HALF_DAY_PRESENT,
  },
  [ARRIVE_LATE]: {
    classname: 'cstLateEarly',
    label: 'Attendance not marked',
    value: ARRIVE_LATE,
  },
  [LEFT_EARLY]: {
    classname: 'cstLateEarly',
    label: 'Attendance not marked',
    value: LEFT_EARLY,
  },
  [ARRIVE_LATE_LEFT_EARLY]: {
    classname: 'cstLateEarly',
    label: 'Attendance not marked',
    value: LEFT_EARLY,
  },
}

export const getDateRangeUTCTimeStamp = (selectedDate) => {
  const passUTCTimeStampParams = {
    year: DateTime.fromJSDate(selectedDate).toFormat('yyyy'),
    month: DateTime.fromJSDate(selectedDate).toFormat('MM') - 1,
    day: DateTime.fromJSDate(selectedDate).toFormat('dd'),
  }
  const getTimeStampValue = getUTCDateTimeStamp(passUTCTimeStampParams)
  return getTimeStampValue
}

export const getCustomHTMLRender = (day, monthTSCollection) => {
  let dateBlockHTML = null
  const UTCDate = getDateRangeUTCTimeStamp(day)

  Object.keys(monthTSCollection)?.forEach((timeStampKey) => {
    if (UTCDate == timeStampKey) {
      if (
        monthTSCollection?.[timeStampKey]?.primary &&
        tsConstantMap?.[monthTSCollection?.[timeStampKey]?.primary]
      ) {
        const primary = tsConstantMap[monthTSCollection[timeStampKey].primary]
        const secondary =
          tsConstantMap[monthTSCollection[timeStampKey].secondary]
        if (!validStatus.includes(monthTSCollection[timeStampKey].primary)) {
          dateBlockHTML = (
            <span className={classNames(styles.normalDay)}>
              {day.getDate()}
            </span>
          )
        } else {
          dateBlockHTML = (
            <span
              className={classNames(
                styles.dateNumber,
                {[styles[secondary?.classname]]: secondary},
                {[styles[primary?.classname]]: primary}
              )}
            >
              {day.getDate()}
            </span>
          )
        }
      } else {
        dateBlockHTML = (
          <span className={classNames(styles.normalDay)}>{day.getDate()}</span>
        )
      }
    }
  })
  return dateBlockHTML
}

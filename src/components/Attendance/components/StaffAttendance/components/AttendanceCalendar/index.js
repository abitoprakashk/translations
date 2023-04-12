import React from 'react'
import {DaySelector, DAY_SELECTOR_CONSTANTS, Legend} from '@teachmint/krayon'
import {IS_MOBILE} from '../../../../../../constants'
import {DateTime} from 'luxon'
import {getUTCTimeStamp} from '../../commonFunctions'
import {getStaffAttendanceDayInfo} from '../../apiService'
import {ATTENDANCE_DAY_STATS} from '../../StaffAttendanceConstants'

import styles from './styles.module.css'
import classNames from 'classnames'

const {MARKED_THIS_DAY, NOT_MARKED_THIS_DAY, WEEKLY_OFF, HOLIDAY} =
  ATTENDANCE_DAY_STATS

export const LEGEND_MAP = new Proxy(
  {
    [NOT_MARKED_THIS_DAY.value]: {
      value: DAY_SELECTOR_CONSTANTS.LEGEND.ATTENDANCE_NOT_MARKED,
      label: 'Attendance not marked',
    },
    [WEEKLY_OFF.value]: {
      value: DAY_SELECTOR_CONSTANTS.LEGEND.WEEKLY_OFF,
      label: 'Weekly off',
    },
    [HOLIDAY.value]: {
      value: DAY_SELECTOR_CONSTANTS.LEGEND.HOLIDAY,
      label: 'Holiday',
    },
    [MARKED_THIS_DAY.value]: {value: null, label: ''},
  },
  {
    get(target, prop) {
      if (target[prop] === undefined) {
        return {value: DAY_SELECTOR_CONSTANTS.LEGEND.EVENT, label: prop}
      }
      return Reflect.get(...arguments)
    },
  }
)

const legendList = [
  {
    type: DAY_SELECTOR_CONSTANTS.LEGEND.HOLIDAY,
    label: 'Holiday / Weekly off',
  },
  {
    type: DAY_SELECTOR_CONSTANTS.LEGEND.EVENT,
    label: 'Event',
  },
  {
    type: DAY_SELECTOR_CONSTANTS.LEGEND.ATTENDANCE_NOT_MARKED,
    label: 'Attendance not marked',
  },
]

const dateFormat = 'yyyy-MM-dd'

const AttendanceCalendar = React.memo(
  ({session, selectedDate, setDaysStats, daysStats, handleCalendarChange}) => {
    return (
      <div
        className={classNames(styles.calendarWrapper, {
          [styles.mobile]: IS_MOBILE,
        })}
      >
        <DaySelector
          variant={
            IS_MOBILE
              ? DAY_SELECTOR_CONSTANTS.VARIANTS.MINI
              : DAY_SELECTOR_CONSTANTS.VARIANTS.DEFAULT
          }
          minDate={session.startDate}
          maxDate={session.endDate}
          value={selectedDate}
          onChange={(date) => {
            const formattedDate = DateTime.fromJSDate(date).toFormat(dateFormat)
            handleCalendarChange(formattedDate)
          }}
          onIntervalChange={(startDate, endDate) => {
            const getStartTimeStampValue = getUTCTimeStamp(
              DateTime.fromJSDate(startDate).toFormat(dateFormat)
            )
            const getEndTimeStampValue = getUTCTimeStamp(
              DateTime.fromJSDate(endDate).toFormat(dateFormat)
            )
            getStaffAttendanceDayInfo({
              from_date: getStartTimeStampValue,
              to_date: getEndTimeStampValue,
            })
              .then((res) => {
                if (res.status)
                  setDaysStats((stats) => ({...stats, ...res.obj}))
              })
              .catch(() => {})
          }}
          legend={(timestamp) => {
            const utcTimestamp = getUTCTimeStamp(
              DateTime.fromMillis(timestamp).toFormat(dateFormat)
            )

            if (
              daysStats[utcTimestamp] &&
              LEGEND_MAP[daysStats[utcTimestamp]]?.value
            ) {
              return (
                <Legend
                  type={
                    LEGEND_MAP[daysStats[utcTimestamp]].value ||
                    LEGEND_MAP.EVENT.value
                  }
                  title={
                    LEGEND_MAP[daysStats[utcTimestamp]].label ||
                    daysStats[utcTimestamp]
                  }
                />
              )
            }
            return null
          }}
          legendList={legendList}
        />
      </div>
    )
  }
)

AttendanceCalendar.displayName = 'AttendanceCalendar'

export default AttendanceCalendar

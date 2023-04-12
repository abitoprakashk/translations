import React from 'react'
import {DaySelector, DAY_SELECTOR_CONSTANTS} from '@teachmint/krayon'
import {IS_MOBILE} from '../../../../../../../constants'
import {DateTime} from 'luxon'
import styles from './attendanceLogs.module.css'
import classNames from 'classnames'

const AttendanceLogs = React.memo(
  ({session, selectedDate, handleCalendarChange}) => {
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
            const formattedDate =
              DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')
            handleCalendarChange(formattedDate)
          }}
        />
      </div>
    )
  }
)

AttendanceLogs.displayName = 'AttendanceLogs'

export default AttendanceLogs

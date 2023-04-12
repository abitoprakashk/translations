import React, {useMemo} from 'react'
import {Alert} from '@teachmint/krayon'
import {Trans, useTranslation} from 'react-i18next'
import {ATTENDANCE_DAY_STATS} from '../../StaffAttendanceConstants'

import styles from './styles.module.css'
import useWeeklyOff from '../../../../../../pages/LeaveManagement/components/LeaveBalanceConfirm/hooks/useWeeklyOff'

const unique = (arr) =>
  Object.keys(
    arr.reduce((acc, curr) => {
      acc[curr] = true
      return acc
    }, {})
  )

const AttendanceDayStats = React.memo(({status}) => {
  const {t} = useTranslation()

  // eslint-disable-next-line no-unused-vars
  const [_, weeklyOffDays] = useWeeklyOff()

  const weeklyoffNames = weeklyOffDays.map(({event_name}) => event_name)
  const weeklyoff = useMemo(() => {
    const uniqueWeeklyOffs = unique(weeklyoffNames)
    return [
      uniqueWeeklyOffs.slice(0, -1).join(', '),
      uniqueWeeklyOffs.slice(-1),
    ]
      .filter((item) => item)
      .join(' & ')
  }, [weeklyoffNames])

  if (
    !ATTENDANCE_DAY_STATS[status] ||
    status === ATTENDANCE_DAY_STATS.MARKED_THIS_DAY.value
  ) {
    return null
  }

  const {label, type, value} = ATTENDANCE_DAY_STATS[status]

  return (
    <div className={styles.alertWrapper}>
      <Alert
        content={
          value === ATTENDANCE_DAY_STATS.WEEKLY_OFF.value ? (
            <Trans i18nKey={label}>Weekly off is set as {{weeklyoff}}</Trans>
          ) : (
            t(label)
          )
        }
        type={type}
        className={styles.fullWidth}
        hideClose
      />
    </div>
  )
})

AttendanceDayStats.displayName = 'AttendanceDayStats'

export default AttendanceDayStats

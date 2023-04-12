import React from 'react'
import styles from './TodaysAttendance.module.css'
import classNames from 'classnames'
import {Card} from '@teachmint/common'
import {useTranslation} from 'react-i18next'

export default function TodaysAttendance({
  totalStaff,
  totalPresent,
  totalAbsent,
}) {
  const {t} = useTranslation()
  const attendanceStats = [
    {
      title: t('totalStaff'),
      value: totalStaff ? totalStaff : '-',
      styleClass: '',
    },
    {
      title: t('totalPresent'),
      value: totalPresent && totalPresent > 0 ? totalPresent : '-',
      styleClass: styles.totalPresentCard,
    },
    {
      title: t('totalAbsent'),
      value: totalAbsent && totalAbsent > 0 ? totalAbsent : '-',
      styleClass: styles.totalAbsentCard,
    },
    {
      title: t('notMarked'),
      value:
        totalStaff &&
        (totalPresent || totalAbsent) &&
        totalStaff - (totalPresent + totalAbsent) > 0
          ? `${totalStaff - (totalPresent + totalAbsent)}`
          : '-',
      styleClass: styles.totalNotMarked,
    },
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.overviewWrapper}>
        <div className={styles.statsCon}>
          {attendanceStats.map(({title, value, styleClass}, index) => (
            <div key={index} className={styles.todayAttendanceMainBlock}>
              <Card className={classNames(styles.todayAttendanceCard)}>
                <div className={styles.statsItem}>
                  <div className={styles.cardAttendanceTitle}>{title}</div>
                  <div
                    className={classNames(
                      styles.cardAttendanceCount,
                      styleClass,
                      styles.statsItemValue
                    )}
                  >
                    {value}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

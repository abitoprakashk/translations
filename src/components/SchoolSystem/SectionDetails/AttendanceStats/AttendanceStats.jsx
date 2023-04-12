import React from 'react'
import styles from './AttendanceStats.module.css'
import classNames from 'classnames'
import {t} from 'i18next'

export default function AttendanceStats({
  totalStudents,
  totalPresent,
  totalAbsent,
  isAttendanceAvailable,
}) {
  const attendanceStats = [
    {
      title: t('totalStudents'),
      value: totalStudents,
      styleClass: '',
    },
    {
      title: t('totalPresent'),
      value: isAttendanceAvailable ? totalPresent : '-',
      styleClass: 'tm-cr-gr-1',
    },
    {
      title: t('totalAbsent'),
      value: isAttendanceAvailable ? totalAbsent : '-',
      styleClass: 'tm-cr-rd-1',
    },
    {
      title: t('overallAttendance'),
      value: isAttendanceAvailable
        ? `${(
            (totalPresent / Math.max(totalPresent + totalAbsent, 1)) *
            100
          ).toFixed(0)}%`
        : '-',
      styleClass: '',
    },
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.overviewWrapper}>
        <div className={styles.statsCon}>
          {attendanceStats.map(({title, value, styleClass}, index) => (
            <div key={index} className={styles.statsItem}>
              <div className="tm-para tm-para-14">{title}</div>
              <div
                className={classNames(
                  'tm-hdg-24',
                  styleClass,
                  styles.statsItemValue
                )}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

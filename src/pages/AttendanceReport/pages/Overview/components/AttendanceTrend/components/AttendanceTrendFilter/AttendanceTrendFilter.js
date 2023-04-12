import {Badges} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {STUDENT_ATTENDANCE_TREND_TOGGLE} from '../../../../../../AttendanceReport.events.constant'
import useSendEvent from '../../../../../../hooks/useSendEvent'
import {TREND_FILTER} from '../../AttendanceTrend.constant'
import styles from './AttendanceTrendFilter.module.css'

function AttendanceTrendFilter({selectedFilter, onFilterChange}) {
  const {t} = useTranslation()
  const sendEvent = useSendEvent()
  const handleFilterChange = (filter) => {
    onFilterChange(filter)
    sendEvent(STUDENT_ATTENDANCE_TREND_TOGGLE, {
      toggle_switch: filter,
    })
  }
  return (
    <div className={styles.filterWrapper}>
      <Badges
        onClick={() => handleFilterChange(TREND_FILTER.DAILY)}
        className={classNames(styles.badge, {
          [styles.selected]: selectedFilter === TREND_FILTER.DAILY,
        })}
        label={t('daily')}
        showIcon={false}
      />
      <Badges
        onClick={() => handleFilterChange(TREND_FILTER.MONTHLY)}
        className={classNames(styles.badge, {
          [styles.selected]: selectedFilter === TREND_FILTER.MONTHLY,
        })}
        label={t('monthly')}
        showIcon={false}
      />
    </div>
  )
}

export default AttendanceTrendFilter

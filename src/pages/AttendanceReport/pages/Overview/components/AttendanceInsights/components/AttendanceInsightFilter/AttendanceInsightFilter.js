import {Badges, BADGES_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {INSIGHT_FILTER} from '../../../../../../AttendanceReport.constant'
import {STUDENT_ATTENDANCE_INSIGHTS_TOGGLE} from '../../../../../../AttendanceReport.events.constant'
import useSendEvent from '../../../../../../hooks/useSendEvent'
import styles from './AttendanceInsightFilter.module.css'

function AttendanceInsightFilter({onFilterChange, selectedFilter}) {
  const {t} = useTranslation()
  const sendEvent = useSendEvent()
  const handleFilterChange = (filter) => {
    onFilterChange(filter)
    sendEvent(STUDENT_ATTENDANCE_INSIGHTS_TOGGLE, {
      toggle_switch: filter,
    })
  }
  return (
    <div className={styles.filterWrapper}>
      <Badges
        onClick={() => handleFilterChange(INSIGHT_FILTER.SESSION)}
        className={classNames(styles.badge, {
          [styles.selected]: selectedFilter === INSIGHT_FILTER.SESSION,
        })}
        inverted
        label={t('thisSession')}
        showIcon={false}
        type={BADGES_CONSTANTS.TYPE.PRIMARY}
      />
      <Badges
        onClick={() => handleFilterChange(INSIGHT_FILTER.MONTH)}
        className={classNames(styles.badge, {
          [styles.selected]: selectedFilter === INSIGHT_FILTER.MONTH,
        })}
        inverted
        label={t('thisMonth')}
        showIcon={false}
        type={BADGES_CONSTANTS.TYPE.PRIMARY}
      />
    </div>
  )
}

export default AttendanceInsightFilter

import {Badges} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {DEFAULT_SLIDER_VALUE} from '../../AttendanceReport.constant'
import styles from './AttendanceBadge.module.css'

function AttendanceBadge({P, A, percentage, showDash}) {
  const {t} = useTranslation()
  if (!P && !A) {
    return (
      <Badges
        label={showDash ? '-' : t('notMarkedSentenceCase')}
        className={classNames({
          [styles.notMarked]: true,
          [styles.dash]: showDash,
        })}
        showIcon={false}
      />
    )
  }

  if (percentage > DEFAULT_SLIDER_VALUE) {
    return <Badges label={`${percentage}%`} showIcon={false} type="success" />
  }
  return <Badges label={`${percentage}%`} showIcon={false} type="warning" />
}

export default AttendanceBadge

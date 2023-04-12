import {EmptyState} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {STAFF_ATTENDANCE_EMPTY_STATUS} from '../../StaffAttendanceConstants'

import styles from './styles.module.css'

const EmptyAttendance = ({
  status = STAFF_ATTENDANCE_EMPTY_STATUS.NOT_MARKED.value,
}) => {
  const {t} = useTranslation()

  if (!STAFF_ATTENDANCE_EMPTY_STATUS[status]?.label) return null

  return (
    <EmptyState
      iconName="voiceOverOff"
      content={t(STAFF_ATTENDANCE_EMPTY_STATUS[status].label)}
      classes={{
        wrapper: styles.wrapper,
        button: {button: styles.button},
      }}
    />
  )
}

export default EmptyAttendance

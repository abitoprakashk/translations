import {DateTime} from 'luxon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {
  LEAVE_BASE_TYPE,
  LEAVE_STATUS,
} from '../../../../../LeaveManagement.constant'
import styles from './LeaveDetailsPopup.module.css'

const BottomStatsInfo = ({leave}) => {
  const {status, status_date, status_set_by_name} = leave
  const {t} = useTranslation()

  return (
    <div className={styles.leaveStatusInfo}>
      <div className={styles[status?.toLowerCase()]}>
        {`${leave.edited_at ? LEAVE_STATUS.UPDATED : LEAVE_STATUS[status]}`} on{' '}
        {DateTime.fromMillis(parseInt(status_date)).toFormat('dd LLL yyyy')}
      </div>
      <div className={styles.byUser}>
        {status === LEAVE_BASE_TYPE.REQUESTED ? (
          t('noActiontaken')
        ) : (
          <>By {status_set_by_name}</>
        )}
      </div>
    </div>
  )
}

export default BottomStatsInfo

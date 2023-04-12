import React from 'react'
import classNames from 'classnames'

import styles from './styles.module.scss'
import {Trans, useTranslation} from 'react-i18next'
import {
  LEAVE_BASE_TYPE,
  LEAVE_STATUS,
  LEAVE_TYPE,
} from '../../../LeaveManagement.constant'
import {
  ROW_ACTIONS,
  ThreeDots as LeaveThreeDots,
} from '../LeaveTable/table.util'
import {useDispatch} from 'react-redux'
import {showCancelModal} from '../../../redux/actions/leaveManagement.actions'
import {canCancelPastLeave as canCancelLeave} from '../../../LeaveMangement.permission'

const UpcomingLeaveCard = ({leave = {}}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {status, type, leaveDates} = leave || {}

  const fromDate = leaveDates?.from?.split(' ').slice(0, 2).join(' ')
  const toDate = leaveDates?.to?.split(' ').slice(0, 2).join(' ')

  const onCancel = (rowData) => {
    dispatch(showCancelModal(rowData))
  }

  const onAction = (type, data) => {
    switch (type) {
      case ROW_ACTIONS.CANCEL:
        onCancel(data)
        break
    }
  }

  return (
    <div className={classNames(styles.flex, styles.card, styles.upcomingCard)}>
      <div className={styles.upcomingCardInfoWrapper}>
        <div
          className={classNames(
            styles.upcomingCardInfo,
            styles.upcomingLeaveDetails
          )}
        >
          <p className={styles.leaveType}>
            <Trans key={'leaveTypeDynamic'}>
              {{leave: `${LEAVE_TYPE[type]}`}} Leave
            </Trans>
          </p>
          <div className={styles.noWordWrap}>
            <span className={styles.leavedate}>{fromDate}</span>
            {toDate && (
              <>
                <span> - </span>
                <span className={styles.leavedate}>{toDate}</span>
              </>
            )}{' '}
            ({leaveDates?.count} {leaveDates?.count > 1 ? t('days') : t('day')})
          </div>
        </div>
        <LeaveThreeDots
          data={leave}
          onAction={onAction}
          canCancel={() => canCancelLeave({leave})}
          className={styles.threeDots}
        />
      </div>
      <p
        className={classNames(
          styles.leaveStatus,
          styles[status?.toLowerCase()]
        )}
      >
        {status === LEAVE_BASE_TYPE.REQUESTED ? (
          <>{t('pendingForApproval')}</>
        ) : status === LEAVE_BASE_TYPE.CREATED ? (
          <>
            <span className={styles.textSecondary}>
              {leave.edited_at ? 'Updated' : LEAVE_STATUS[status]} by
            </span>{' '}
            <span>{leave.status_set_by_name}</span>
          </>
        ) : (
          <>{LEAVE_STATUS[status]}</>
        )}
      </p>
    </div>
  )
}

export default UpcomingLeaveCard

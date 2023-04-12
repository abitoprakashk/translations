import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../../../utils/EventsConstants'
import {
  LEAVE_BASE_TYPE,
  LEAVE_STATUS,
  LEAVE_TYPE,
} from '../../../../../LeaveManagement.constant'
import {normalizePendingLeaves} from '../../../../../LeaveManagement.utils'
import {showLeaveDetails} from '../../../../../redux/actions/leaveManagement.actions'

import styles from './LeaveList.module.scss'
import {Trans, useTranslation} from 'react-i18next'
import defaultTeacherImage from '../../../../../../../assets/images/icons/teacher-default-image.svg'
import {DateTime} from 'luxon'
import classNames from 'classnames'

const LeaveCard = ({item, type, manage = false}) => {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const rolesList = useSelector((state) => state.rolesList)
  const {t} = useTranslation()

  return item ? (
    <div className={styles.cardWrapper}>
      <div
        onClick={() => {
          const [normalisedLeave] = normalizePendingLeaves([item], rolesList)
          dispatch(
            showLeaveDetails({
              item: normalisedLeave,
              from: type,
              manage,
            })
          )
          eventManager.send_event(events.VIEW_LEAVE_HISTORY_CLICKED_TFI, {
            employee_name: normalisedLeave.name,
            employee_user_id: normalisedLeave.id,
            employee_type:
              typeof normalisedLeave.rollName === 'object'
                ? normalisedLeave.rollName?.props?.children
                : normalisedLeave.rollName,
          })
        }}
        className={classNames(styles.card, {[styles.manageView]: manage})}
      >
        {manage && (
          <div className={styles.flex}>
            <img
              className={styles.img}
              src={item?.img_url || defaultTeacherImage}
            />
            <div className={styles.alignCenter}>
              <div className={styles.staffName}>{item.name}</div>
              <div className={styles.staffType}>{item.rollName}</div>
            </div>
          </div>
        )}
        <div className={styles.leaveInfo}>
          <div className={styles.leavedate}>
            <Trans key="leaveTypeDynamic">
              {{leave: `${LEAVE_TYPE[item.type]}`}} Leave
            </Trans>
          </div>
          {type === LEAVE_BASE_TYPE.PENDING ? (
            <div className={styles.staffType}>
              <Trans i18nKey="requestedon">
                Requested on {{requestedOn: item.requestedOn}}
              </Trans>
            </div>
          ) : (
            <div
              className={classNames(
                styles.staffType,
                styles[item?.status?.toLowerCase()]
              )}
            >
              {item.status === LEAVE_BASE_TYPE.REQUESTED ? (
                <>{t('pendingForApproval')}</>
              ) : (
                <>
                  {item.edited_at
                    ? LEAVE_STATUS.UPDATED
                    : LEAVE_STATUS[item.status]}{' '}
                  on{' '}
                  {DateTime.fromMillis(item.status_date).toFormat(
                    'dd LLL yyyy'
                  )}
                </>
              )}
            </div>
          )}
        </div>
        {!manage && item.leaveDates?.count > 0 && (
          <div className={styles.leaveCount}>
            {item.leaveDates?.count}{' '}
            {item.leaveDates?.count > 1 ? t('days') : t('day')}
          </div>
        )}
      </div>
    </div>
  ) : null
}

export default LeaveCard

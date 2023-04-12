import {Icon} from '@teachmint/common'
import {DateTime} from 'luxon'
import React, {useEffect, useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {
  leaveSlotTypeMap,
  LEAVE_BASE_TYPE,
  LEAVE_STATUS,
  LEAVE_TYPE,
} from '../../../../../LeaveManagement.constant'
import LeaveStatsAlert from '../LeaveStatsAlert'
import styles from './LeaveDetailsPopup.module.css'

const PopupLeaveInfo = ({leave, manage = false, alert = true}) => {
  const {t} = useTranslation()
  const [info, setinfo] = useState([])

  useEffect(() => {
    setinfo([
      {
        iconName: leave.type === LEAVE_BASE_TYPE.SICK ? 'sick' : 'vacation',
        title: (
          <Trans key={'leaveTypeDynamic'}>
            {{leave: `${LEAVE_TYPE[leave.type]}`}} Leave
          </Trans>
        ),
      },
      {
        iconName: 'calendar',
        title: `${leave?.leaveDates?.count} ${
          leave?.leaveDates?.count > 1 ? t('days') : t('day')
        }`,
      },
      {
        iconName: 'week',
        title: (
          <div className={styles.leaveDetailWrapper}>
            <div>
              {`${leave.leaveDates?.from}`}
              <span className={styles.subtext}>
                ({`${leaveSlotTypeMap[leave.from_slot].label}`})
              </span>
              {leave.leaveDates?.to && (
                <>
                  {`${` - ${leave.leaveDates?.to}`}`}
                  <span className={styles.subtext}>
                    ({`${leaveSlotTypeMap[leave.to_slot].label}`})
                  </span>
                </>
              )}
            </div>
          </div>
        ),
      },
      {
        iconName: 'message',
        title: <div className={styles.reason}>{leave.reason || 'NA'}</div>,
      },
    ])
  }, [leave])

  const leaveStatus = leave.status

  return (
    <>
      {manage && (
        <div className={styles.requestedOn}>
          <Trans i18nKey={'requestedon'}>
            Requested on {{requestedOn: leave.requestedOn}}
          </Trans>
        </div>
      )}

      {alert && leaveStatus === LEAVE_BASE_TYPE.REQUESTED && (
        <LeaveStatsAlert type={leaveStatus}>
          {t('pendingForApproval')}
        </LeaveStatsAlert>
      )}

      {alert && leaveStatus === LEAVE_BASE_TYPE.APPROVED && (
        <LeaveStatsAlert type={leaveStatus}>
          <Icon size="xxxs" name="checkCircle" color="success" />
          {leave.edited_at
            ? LEAVE_STATUS.UPDATED
            : LEAVE_STATUS[leaveStatus]}{' '}
          on{' '}
          {DateTime.fromMillis(parseInt(leave.status_date / 1000)).toFormat(
            'dd LLL yyyy'
          )}
        </LeaveStatsAlert>
      )}

      <div className={styles.infowrapper}>
        {info.map((item, i) => (
          <div key={i} className={styles.info}>
            <span className={styles.icon}>
              <Icon
                name={item.iconName}
                color="secondary"
                size="xxs"
                type="outlined"
              />
            </span>
            <div className={styles.title}>{item.title}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default PopupLeaveInfo

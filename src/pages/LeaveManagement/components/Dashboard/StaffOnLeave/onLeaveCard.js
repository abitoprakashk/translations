import React from 'react'
import classNames from 'classnames'
import defaultTeacherImage from '../../../../../assets/images/icons/teacher-default-image.svg'

import styles from './styles.module.scss'
import {Trans, useTranslation} from 'react-i18next'
import {LEAVE_TYPE} from '../../../LeaveManagement.constant'

const OnLeaveCard = ({leave = {}}) => {
  const {t} = useTranslation()
  const {img_url, name, rollName, type, leaveDates} = leave || {}

  const fromDate = leaveDates?.from?.split(' ').slice(0, 2).join(' ')
  const toDate = leaveDates?.to?.split(' ').slice(0, 2).join(' ')

  return (
    <div className={classNames(styles.flex, styles.card)}>
      <div className={classNames(styles.staffInfo, styles.cardInfo)}>
        <img
          className={styles.img}
          src={img_url || defaultTeacherImage}
          alt=""
        />
        <div className={styles.staffDetail}>
          <div className={classNames(styles.staffName, styles.textOverflow)}>
            {name}
          </div>
          <div className={classNames(styles.staffRole, styles.textOverflow)}>
            {rollName}
          </div>
        </div>
      </div>
      <div className={classNames(styles.cardInfo, styles.leaveDetails)}>
        <span className={styles.leaveType}>
          <Trans key={'leaveTypeDynamic'}>
            {{leave: `${LEAVE_TYPE[type]}`}} Leave
          </Trans>
        </span>
        <span className={styles.dot} />
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
  )
}

export default OnLeaveCard

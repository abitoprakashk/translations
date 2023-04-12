import React from 'react'
import {useTranslation} from 'react-i18next'
import {DateTime} from 'luxon'
import {
  Avatar,
  AVATAR_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {
  ATTENDANCE_LEAVE_STATUS_MAP,
  dateFromFormat,
} from '../../../StaffAttendanceConstants'
import {isURLValid} from '../../../commonFunctions'
import styles from './CardInfoBlock.module.css'

const CardInfoBlock = ({data, type, date, attendanceInfo}) => {
  const {t} = useTranslation()
  const {name, designation, role_name, img_url} = data
  const designationName = designation || role_name

  const isURL = isURLValid(img_url)

  const checkIn =
    attendanceInfo?.checkin && attendanceInfo?.checkin !== '' && type
      ? DateTime.fromSeconds(parseInt(attendanceInfo.checkin)).toFormat(
          dateFromFormat.hh_mm_a
        )
      : '--'

  const checkOut =
    attendanceInfo?.checkout && attendanceInfo?.checkout !== '' && type
      ? DateTime.fromSeconds(parseInt(attendanceInfo.checkout)).toFormat(
          dateFromFormat.hh_mm_a
        )
      : '--'
  return (
    <>
      <div className={styles.viewProfileDetails}>
        <div className={styles.viewDetailsLeft}>
          <div className={styles.profileImg}>
            <Avatar
              name={name}
              size={AVATAR_CONSTANTS.SIZE.LARGE}
              imgSrc={isURL ? img_url : ''}
            />
          </div>
          <div className={classNames(styles.infoWrapper)}>
            <div className={classNames(styles.userName, styles.textEllipsis)}>
              {name}
            </div>
            <div className={styles.subInfoDetails}>
              {designationName && (
                <span
                  className={classNames(
                    styles.designation,
                    styles.textEllipsis
                  )}
                >
                  {designationName}
                </span>
              )}
              {data?.shift_name && data?.shift_name !== '' && (
                <>
                  <span className={styles.dotBox}></span>
                  <span
                    className={classNames(
                      styles.shiftName,
                      styles.textEllipsis
                    )}
                  >
                    {data?.shift_name || '--'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.viewDetailsRight}>
          <div className={styles.statusBox}>
            {type && (
              <Badges
                size={BADGES_CONSTANTS.SIZE.SMALL}
                label={t(ATTENDANCE_LEAVE_STATUS_MAP[type].label)}
                type={ATTENDANCE_LEAVE_STATUS_MAP[type].type}
                showIcon={false}
                className={classNames(styles.statusLabel)}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.dateInfoBlock}>
        <div className={styles.dateBox}>
          <div className={styles.labelInfo}>{t('date')}</div>
          <div className={styles.labelValue}>
            {DateTime.fromFormat(date, dateFromFormat.yyyy_LL_dd).toFormat(
              dateFromFormat.LLL_dd_yyyy
            )}
          </div>
        </div>
        <div className={styles.checkInBox}>
          <div className={styles.labelInfo}>{t('checkIn')}</div>
          <div className={styles.labelValue}>{checkIn}</div>
        </div>
        <div className={styles.checkOutBox}>
          <div className={styles.labelInfo}>{t('checkOut')}</div>
          <div className={styles.labelValue}>{checkOut}</div>
        </div>
      </div>
    </>
  )
}

export default CardInfoBlock

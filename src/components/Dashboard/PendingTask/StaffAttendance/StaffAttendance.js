import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {redirectURLStaffAttenance} from './constants'
import styles from './StaffAttendance.module.css'
import {showFeatureLockAction} from '../../../../redux/actions/commonAction'
import {checkSubscriptionType} from '../../../../utils/Helpers'
import {events} from '../../../../utils/EventsConstants'

const StaffAttendance = () => {
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const isPremium = checkSubscriptionType(instituteInfo)

  useEffect(() => {
    eventManager.send_event(events.STAFF_ATTENDANCE_CARD_LOADED_TFI, {
      screen_name: 'DASHBOARD',
    })
  }, [])

  return (
    <div className={styles.staffAttendanceContainer}>
      <div className={styles.staffAttendanceContainerTitle}>
        {t('staffAttendance')}
      </div>
      <Link
        to={isPremium && redirectURLStaffAttenance}
        onClick={() => {
          if (isPremium) {
            eventManager.send_event(
              events.DASHBOARD_MARK_ATTENDANCE_CLICKED_TFI,
              {
                status: 'UNLOCKED',
                screen_name: 'DASHBOARD',
              }
            )
          } else {
            eventManager.send_event(
              events.DASHBOARD_MARK_ATTENDANCE_CLICKED_TFI,
              {
                status: 'LOCKED',
                screen_name: 'DASHBOARD',
              }
            )
            dispatchEvent(showFeatureLockAction(true))
          }
        }}
      >
        <div className={styles.staffAttendanceContainerCard}>
          <div className={styles.staffAttendanceContainerCardMain}>
            <div className={styles.staffAttendanceContainerCardIcon}>
              <Icon
                name="hrms"
                type={ICON_CONSTANTS.TYPES.INVERTED}
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
              />
            </div>
            <div className={styles.staffAttendanceContainerCardTitle}>
              {t('markNow')}
            </div>
          </div>
          <div className={styles.staffAttendanceContainerCardArrow}>
            <Icon name="forwardArrow" size={ICON_CONSTANTS.SIZES.XXX_SMALL} />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default StaffAttendance

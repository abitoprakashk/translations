import React from 'react'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {t} from 'i18next'
import classNames from 'classnames'
import styles from './StaffLeaves.module.css'
import {capitalizeFirstLetter} from '../../../../pages/global-settings/constants/constants'
import {useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'

const StaffLeavsCard = ({
  pendingStaffLeave,
  handleLeaveApproved,
  handleLeaveCancelled,
  buttonText,
}) => {
  const eventManager = useSelector((state) => state.eventManager)

  return (
    <div
      className={classNames(
        styles.staffLeavsCardContainer,
        !buttonText && styles.staffLeavsCardContainerPointer,
        buttonText === 'hide' && styles.staffLeavsCardContainerFull,
        buttonText !== 'hide' && styles.staffLeavsCardContainerMin
      )}
      onClick={({role_name, name, _id}) => {
        eventManager.send_event(
          events.DASHBOARD_PENDING_LEAVE_TAB_CLICKED_TFI,
          {
            employee_name: name,
            employee_user_id: _id,
            employee_type: role_name,
            screen_name: 'dashboard',
          }
        )
      }}
    >
      <div className={styles.staffLeavsCardContainerIcon}>
        <Icon
          name="eventNote"
          type={ICON_CONSTANTS.TYPES.INVERTED}
          size={ICON_CONSTANTS.SIZES.XXX_SMALL}
        />
      </div>

      <div className={styles.staffLeavsCardContainerMain}>
        <div className={styles.staffLeavsCardContainerLeaveTypeTop}>
          {`${capitalizeFirstLetter(pendingStaffLeave?.type)} ${t('leave')}`}
        </div>

        <div className={styles.staffLeavsCardContainerNameContainer}>
          <div className={styles.staffLeavsCardContainerName}>
            {pendingStaffLeave.name}
          </div>
          <div className={styles.staffLeavsCardContainerLeaveTypeRight}>
            {`${capitalizeFirstLetter(pendingStaffLeave?.type)} ${t('leave')}`}
          </div>
        </div>
        <div className={styles.staffLeavsCardContainerLeaveContainer}>
          <div className={styles.staffLeavsCardContainerLeaveDuration}>
            {`${pendingStaffLeave.no_of_days} ${
              pendingStaffLeave.no_of_days > 1 ? t('days') : t('day')
            }`}
          </div>
          <div className={styles.staffLeavsCardContainerDot}></div>
          <div className={styles.staffLeavsCardContainerStartDate}>
            {`${t('from')} ${pendingStaffLeave.leaveDates?.from.slice(0, 6)}
            `}
          </div>
        </div>
        <div className={styles.staffLeavsCardContainerRole}>
          {pendingStaffLeave?.role_name}
        </div>

        {buttonText === 'hide' && (
          <div className={styles.staffLeavsCardContainerButtonContainer}>
            <div
              className={styles.staffLeavsCardContainerCancel}
              onClick={() => {
                handleLeaveCancelled(pendingStaffLeave)
              }}
            >
              <Icon
                name="close"
                type={ICON_CONSTANTS.TYPES.ERROR}
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
              />
            </div>
            <div
              className={styles.staffLeavsCardContainerApprove}
              onClick={() => {
                handleLeaveApproved(pendingStaffLeave)
              }}
            >
              {t('approve')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffLeavsCard

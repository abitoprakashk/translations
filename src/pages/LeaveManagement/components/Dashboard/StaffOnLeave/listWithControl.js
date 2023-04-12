import {ErrorBoundary, Icon} from '@teachmint/common'
import classNames from 'classnames'
import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import {UPCOMING_LEAVE_DURATION} from '../../../LeaveManagement.constant'
import {getStaffUpcomingLeaves} from '../../../redux/actions/leaveManagement.actions'
import StaffOnLeaveCardList from './list'
import styles from './listWithControl.module.scss'

const StaffOnLeaveWithControl = ({heading, iid, upcoming}) => {
  const {duration, data, loading} = useSelector(
    (state) => state.leaveManagement.upcomingLeaves
  )

  const eventManager = useSelector((state) => state.eventManager)

  const dispatch = useDispatch()
  const {t} = useTranslation()

  return (
    <ErrorBoundary>
      <div className={classNames(styles.header, styles.flex)}>
        <p className={styles.title}>
          {heading ||
            (duration === UPCOMING_LEAVE_DURATION.TODAY.value
              ? t('onLeave')
              : t('upcomingLeaves'))}
        </p>
        <div className={styles.dropdown}>
          <span className={classNames(styles.dropdownSelected, styles.flex)}>
            {UPCOMING_LEAVE_DURATION[duration]?.label}{' '}
            <Icon size="xs" name="downArrow" color="primary" />
          </span>
          <div className={styles.dropdownContent}>
            {Object.values(UPCOMING_LEAVE_DURATION).map(({value, label}) => (
              <div
                className={classNames(styles.dropdownItem, {
                  [styles.active]: duration == value,
                })}
                key={value}
                onClick={() => {
                  if (!loading) {
                    dispatch(getStaffUpcomingLeaves({duration: value, iid}))
                    if (eventManager) {
                      eventManager.send_event(
                        upcoming
                          ? events.UPCOMING_LEAVE_DATA_DURATION_SELECTED_TFI
                          : events.ON_LEAVE_DATA_DURATION_SELECTED_TFI,
                        {
                          leave_data_duration: value.toLowerCase(),
                        }
                      )
                    }
                  }
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading || data.length == 0 ? (
        <div className={classNames(styles.empty, styles.flex)}>
          {loading ? (
            'loading...'
          ) : upcoming ? (
            t('noUpcomingLeaves')
          ) : (
            <Trans key="noStaffOnLeaveDynamic">
              No staff on leave
              {{
                duration: '',
              }}
            </Trans>
          )}
        </div>
      ) : (
        <StaffOnLeaveCardList upcoming={upcoming} />
      )}
    </ErrorBoundary>
  )
}

export default StaffOnLeaveWithControl

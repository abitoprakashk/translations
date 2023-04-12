import React from 'react'
import styles from './YearlyCalendarBanner.module.css'
import ArrowWhite from '../../../../assets/images/icons/arrow-side-white.svg'
import ArrowBlue from '../../../../assets/images/icons/arrow-side-blue.svg'
import {DateTime} from 'luxon'
import {HOLIDAY_EVENT_TYPE} from '../../../../pages/communication/constants'
import {useTranslation} from 'react-i18next'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import Permission from '../../../../components/Common/Permission/Permission'

const YearlyBannerContainer = (props) => {
  const {handleGreetingClick, completeEventsArray} = props
  const {t} = useTranslation()

  return (
    <>
      {completeEventsArray?.length > 0
        ? completeEventsArray.map((tabInfo, i) => (
            <div
              className={
                tabInfo?.event_type === HOLIDAY_EVENT_TYPE.holiday
                  ? styles.YearlyCalendarBannerContainerHoliday
                  : styles.YearlyCalendarBannerContainerEvent
              }
              key={i}
            >
              <div className={styles.YearlyCalendarBannerContent}>
                {tabInfo?.event_type === HOLIDAY_EVENT_TYPE.holiday ? (
                  <div className={styles.YearlyCalendarBannerHolidayName}>
                    {t('Holiday')}
                  </div>
                ) : (
                  <div className={styles.YearlyCalendarBannerEventName}>
                    {t('Event')}
                  </div>
                )}
                <div className={styles.YearlyCalendarBannerEvent}>
                  <div className={styles.YearlyCalendarBannerEventTitle}>
                    {tabInfo?.event_name}
                  </div>
                  <span className={styles.YearlyCalendarBannerEventSpan}></span>
                  <div className={styles.YearlyCalendarBannerEventTime}>
                    {DateTime.fromMillis(
                      parseInt(tabInfo?.starts_on * 1000)
                    ).toFormat('dd MMM, yyyy')}
                  </div>
                </div>
              </div>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.communicationController_announcement_create
                }
              >
                <div
                  className={styles.YearlyCalendarBannerGreetingCTA}
                  onClick={() => handleGreetingClick(tabInfo?.event_type)}
                >
                  <img
                    className={styles.YearlyCalendarBannerGreetingCTAImgMWeb}
                    src={ArrowBlue}
                  />
                  <img
                    className={styles.YearlyCalendarBannerGreetingCTAImgWeb}
                    src={ArrowWhite}
                  />

                  {tabInfo?.event_type === HOLIDAY_EVENT_TYPE.holiday ? (
                    <div className={styles.YearlyCalendarBannerGreetingCTAText}>
                      {t('SendGreetings')}
                    </div>
                  ) : (
                    <div className={styles.YearlyCalendarBannerRemindCTAText}>
                      {t('Remind')}
                    </div>
                  )}
                </div>
              </Permission>
            </div>
          ))
        : ''}
    </>
  )
}

export default YearlyBannerContainer

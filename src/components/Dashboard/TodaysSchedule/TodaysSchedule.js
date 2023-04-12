import React from 'react'
import {Icon} from '@teachmint/common'
import goLiveIcon from '../../../assets/images/dashboard/go-live.svg'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {DASHBOARD, sidebarData} from '../../../utils/SidebarItems'
import {Link} from 'react-router-dom'
import {events} from '../../../utils/EventsConstants'
import {showFeatureLockAction} from '../../../redux/actions/commonAction'
import {checkSubscriptionType} from '../../../utils/Helpers'
// import {CONSTS_DASHBOARD} from '../../../constants/dashboard.constants'

export default function TodaysSchedule() {
  const {instituteTodaysSchedule, eventManager, instituteInfo} = useSelector(
    (state) => state
  )

  const dispatch = useDispatch()
  const {t} = useTranslation()

  const isPremium = checkSubscriptionType(instituteInfo)
  const {
    is_live: ongoingLiveClasses,
    upcoming: upcomingLiveClasses,
    completed: completedLiveClasses,
    total_classes: liveClassesScheduled,
  } = instituteTodaysSchedule

  const attendanceItems = [
    {
      num: 1,
      title: t('ongoingLiveClasses'),
      value: (ongoingLiveClasses && ongoingLiveClasses.length) || 0,
      key: 'ONGOING',
    },
    {
      num: 2,
      title: t('upcomingLiveClasses'),
      value: (upcomingLiveClasses && upcomingLiveClasses.length) || 0,
      key: 'UPCOMING',
    },
    {
      num: 3,
      title: t('completedLiveClasses'),
      value: (completedLiveClasses && completedLiveClasses.length) || 0,
      key: 'COMPLETED',
    },
    {
      num: 4,
      title: t('liveClassesScheduled'),
      value: (liveClassesScheduled && liveClassesScheduled.length) || 0,
      key: 'SCHEDULED',
    },
  ]

  const trackEvent = (eventName, cardName, status) => {
    let data = {status}
    if (cardName) data = {...data, card_name: cardName}
    eventManager.send_event(eventName, data)
  }

  const handleOnClickViewDetails = () => {
    if (isPremium) trackEvent(events.VIEW_DETAILS_TFI, null, 'UNLOCKED')
    else {
      trackEvent(events.VIEW_DETAILS_TFI, null, 'LOCKED')
      dispatch(showFeatureLockAction(true))
    }
  }

  const handleOnClickTodaysScheduleCard = (key) => {
    if (isPremium)
      trackEvent(events.DASHBOARD_TODAYS_SCHEDULE_CARDS, key, 'UNLOCKED')
    else {
      trackEvent(events.DASHBOARD_TODAYS_SCHEDULE_CARDS, key, 'LOCKED')
      dispatch(showFeatureLockAction(true))
    }
  }

  return (
    <div className="w-full justify-between px-4 py-3 lg:px-0 lg:pt-0">
      <div className="w-full flex flex-row justify-between items-end">
        <div className="flex items-center">
          <div className="tm-h7 flex justify-start">{t('todaySchedule')}</div>
        </div>
        <div className="relative">
          <Link
            className="tm-para3 tm-color-blue"
            to={isPremium ? sidebarData.SCHEDULE.route : DASHBOARD}
            onClick={handleOnClickViewDetails}
          >
            <div className="flex items-center">
              {!isPremium && (
                <img
                  className="h-4 lg:mr-2 mb-0.5 w-3.5"
                  alt="card-icon"
                  src="https://storage.googleapis.com/tm-assets/icons/secondary/lock-secondary.svg"
                />
              )}
              <div>{t('viewDetails')}</div>
            </div>
          </Link>
        </div>
      </div>
      <div className="tm-horizontal-con tm-remove-horizontal-con my-3 justify-between ">
        {attendanceItems.map(({num, title, value, key}) => (
          <Link
            key={key}
            className="tm-dashboard-attendance-card bg-white px-3 py-3 relative tm-border-radius1 flex-col mr-4 lg:mr-0 tm-box-shadow1"
            to={{
              pathname: isPremium ? sidebarData.SCHEDULE.route : DASHBOARD,
              state: {
                defaultTab: key,
              },
            }}
            onClick={() => handleOnClickTodaysScheduleCard(key)}
          >
            <div className="relative">
              <div className="tm-h4">
                {value}
                {num === 1 && value > 0 ? (
                  <img
                    className="absolute top-1.5 right-1 w-12 lg:w-16"
                    src={goLiveIcon}
                    alt="Join Live"
                  />
                ) : null}
              </div>
              <div className="w-full flex flex-row justify-between items-center">
                <div className="tm-para3">{`${title}`}</div>
                <Icon
                  name="forwardArrow"
                  size="xs"
                  type="filled"
                  color="basic"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

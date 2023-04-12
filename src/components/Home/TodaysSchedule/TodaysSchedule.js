import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import todaysScheduleEmptyImg from '../../../assets/images/dashboard/empty/todays-schedule-empty.svg'
import EmptyScreen from '../../Common/EmptyScreen/EmptyScreen'
import ClassroomCard from '../../Common/ClassroomCard/ClassroomCard'
import {useLocation} from 'react-router-dom'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../redux/actions/commonAction'
import {utilsGetTodaysSchedule} from '../../../routes/dashboard'
import {instituteTodaysScheduleAction} from '../../../redux/actions/instituteInfoActions'
import {events} from '../../../utils/EventsConstants'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import {useTranslation} from 'react-i18next'

export default function TodaysSchedule() {
  const location = useLocation()
  const dispatch = useDispatch()
  const {t} = useTranslation()

  // const {REACT_APP_BASE_URL} = process.env
  const TABS_TODAYS_SCHEDULE = {
    ONGOING: {
      key: 'ONGOING',
      label: t('ongoingLabel'),
      // label: 'Ongoing',
      classes: 'is_live',
      emptyStr: t('todayScheduleTabOngoingDesc'),
    },
    UPCOMING: {
      key: 'UPCOMING',
      label: t('upcomingLabel'),
      classes: 'upcoming',
      emptyStr: t('todayScheduleTabUpcomingDesc'),
    },
    COMPLETED: {
      key: 'COMPLETED',
      label: t('completedLabel'),
      classes: 'completed',
      emptyStr: t('todayScheduleTabCompletedDesc'),
    },
    SCHEDULED: {
      key: 'SCHEDULED',
      label: t('scheduledLabel'),
      classes: 'total_classes',
      emptyStr: t('todayScheduleTabScheduledDesc'),
    },
  }

  const [activeTab, setActiveTab] = useState(
    location?.state?.defaultTab || TABS_TODAYS_SCHEDULE.ONGOING.key
  )
  const [classes, setClasses] = useState([])
  const {instituteTodaysSchedule, instituteInfo, eventManager} = useSelector(
    (state) => state
  )
  const updateClassroomsList = (tab) => {
    let classes = instituteTodaysSchedule[TABS_TODAYS_SCHEDULE[tab].classes]
    setClasses([...(classes ? classes : [])])
  }

  const onTabClick = (tab) => () => {
    trackEvent(
      events.TODAYS_SCHEDULE_TABS_CLICKED,
      TABS_TODAYS_SCHEDULE[tab].key
    )
    setActiveTab(TABS_TODAYS_SCHEDULE[tab].key)
    updateClassroomsList(tab)
  }

  const trackEvent = (eventName, tab_name) =>
    eventManager.send_event(eventName, {tab_name})

  const getTodaysSchedule = (instituteId) => {
    dispatch(showLoadingAction(true))
    utilsGetTodaysSchedule(instituteId)
      .then(({status, obj}) => {
        if (status) {
          dispatch(instituteTodaysScheduleAction(obj))
        }
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  useEffect(() => {
    if (instituteInfo?._id) getTodaysSchedule(instituteInfo._id)
  }, [instituteInfo])
  useEffect(() => {
    updateClassroomsList(activeTab)
  }, [instituteTodaysSchedule])

  return (
    <div className="lg:px-6 lg:pb-6 lg:pt-3">
      <ErrorBoundary>
        <div className="flex tm-border1-bottom overflow-auto">
          {Object.keys(TABS_TODAYS_SCHEDULE).map((tab) => {
            return (
              <div
                className={
                  tab === activeTab
                    ? 'mx-3 pt-2 pb-3 w-min tm-h6 cursor-pointer tm-color-blue tm-border1-blue-bottom'
                    : 'mx-3 pt-2 pb-3 w-min tm-h6 cursor-pointer'
                }
                onClick={onTabClick(tab)}
                key={tab}
              >
                {TABS_TODAYS_SCHEDULE[tab].label}&nbsp;(
                {(instituteTodaysSchedule[
                  [TABS_TODAYS_SCHEDULE[tab].classes]
                ] &&
                  instituteTodaysSchedule[[TABS_TODAYS_SCHEDULE[tab].classes]]
                    .length) ||
                  0}
                )
              </div>
            )
          })}
        </div>

        {classes && classes.length > 0 ? (
          <div className="mt-3 mx-4 lg:mx-0">
            <ErrorBoundary>
              {classes &&
                classes.map((item, index) => (
                  <ErrorBoundary key={index}>
                    <ClassroomCard
                      key={index}
                      item={item}
                      instituteId={instituteInfo && instituteInfo._id}
                      activeTab={activeTab}
                    />
                  </ErrorBoundary>
                ))}
            </ErrorBoundary>
          </div>
        ) : (
          <EmptyScreen
            img={todaysScheduleEmptyImg}
            text={TABS_TODAYS_SCHEDULE[activeTab].emptyStr}
          />
        )}
      </ErrorBoundary>
    </div>
  )
}

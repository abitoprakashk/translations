import React, {useState, useEffect} from 'react'
import s from './YearlyCalendar.module.scss'
import cx from 'classnames'
import {
  TAB_OPTIONS,
  WEEKLY_OFF,
  HOLIDAY,
  EVENTS_ACTIVITIES,
  EXAM,
  YEARLY_LABELS as LABELS,
} from './YearlyCalendar.constants'
import {INSTITUTE_TYPES} from '../../constants/institute.constants'
import WeeklyOffs from './components/WeeklyOffs/WeeklyOffs'
import HolidaysAndEvents from './components/HolidaysAndEvents/HolidaysAndEvents'
import LinearTabOptions from '../../components/Common/LinearTabOptions/LinearTabOptions'
import {useDispatch, useSelector} from 'react-redux'
import {getCalendarData} from './redux/actions/calendarActions'
import ExamPlannerPage from './components/ExamPlanner/ExamPlanner'
import Loader from '../../components/Common/Loader/Loader'
import {DASHBOARD} from '../../utils/SidebarItems'
import examMobileImage from '../../assets/images/dashboard/exam-mobile.svg'
import EmptyScreenV1 from '../../components/Common/EmptyScreenV1/EmptyScreenV1'
import history from '../../history'
import {events} from '../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'

const YearlyCalendar = () => {
  const {t} = useTranslation()
  const [activeTab, setActiveTab] = useState(
    window?.location?.search?.toString().split('=')[1] || 'WEEKLY_OFF'
  )
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()
  const {
    tabInfo: {tabInfo},
    tabInfo: {loading},
  } = useSelector((state) => state.yearlyCalendarInfo)
  useEffect(() => {
    dispatch(getCalendarData(TAB_OPTIONS[WEEKLY_OFF].eventType))
  }, [])

  const changeTab = (item) => {
    if (item === TAB_OPTIONS.WEEKLY_OFF.id) {
      eventManager.send_event(events.CALENDAR_WEEKLY_OFF_CLICKED_TFI)
    } else if (item === TAB_OPTIONS.HOLIDAY.id) {
      eventManager.send_event(events.CALENDAR_HOLIDAY_CLICKED_TFI)
    } else if (item === TAB_OPTIONS.EVENTS_ACTIVITIES.id) {
      eventManager.send_event(events.CALENDAR_EVENT_AND_ACTIVITY_CLICKED_TFI)
    } else {
      eventManager.send_event(events.EXAM_PLANNER_CALENDAR_CLICKED_TFI)
    }

    setActiveTab(item)
    dispatch(getCalendarData(TAB_OPTIONS[item].eventType))
  }

  const getTabComponent = () => {
    switch (activeTab) {
      case WEEKLY_OFF:
        return <WeeklyOffs data={tabInfo} />
      case HOLIDAY:
        return (
          <HolidaysAndEvents
            data={tabInfo}
            header={TAB_OPTIONS[HOLIDAY].header}
            primaryFieldLabel={LABELS.REASON_FOR_HOLIDAY}
            event={HOLIDAY}
            key="holidays"
          />
        )
      case EVENTS_ACTIVITIES:
        return (
          <HolidaysAndEvents
            data={tabInfo}
            header={TAB_OPTIONS[EVENTS_ACTIVITIES].header}
            primaryFieldLabel={LABELS.EVENT_NAME}
            event={EVENTS_ACTIVITIES}
            key="events"
          />
        )
      case EXAM:
        return <ExamPlannerPage expandAllowed={true} />
    }
  }

  const getTabOptions = () => {
    if (instituteInfo.institute_type === INSTITUTE_TYPES.SCHOOL) {
      return Object.keys(TAB_OPTIONS).map((key) => {
        return TAB_OPTIONS[key]
      })
    }
    return Object.keys(TAB_OPTIONS)
      .filter((itemKey) => !TAB_OPTIONS[itemKey].onlySchool)
      .map((key) => {
        return TAB_OPTIONS[key]
      })
  }

  return (
    <div className={s.wrapper}>
      <Loader show={loading} />

      <h1 className={cx(s.heading, 'tm-hdg tm-hdg-24')}>
        {LABELS.YEARLY_CALENDAR}
      </h1>
      <LinearTabOptions
        options={getTabOptions()}
        selected={activeTab}
        handleChange={changeTab}
      />
      <div className="lg:hidden mt-20">
        <EmptyScreenV1
          image={examMobileImage}
          title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
          desc=""
          btnText="Go to Dashboard"
          handleChange={() => history.push(DASHBOARD)}
          btnType="primary"
        />
      </div>
      <div className="hidden lg:block">{getTabComponent()}</div>
    </div>
  )
}

export default YearlyCalendar

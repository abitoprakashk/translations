import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {checkSubscriptionType, getDateAndTime} from '../../../utils/Helpers'
import {
  DASHBOARD,
  secondaryItems,
  sidebarData,
} from '../../../utils/SidebarItems'
import BarChart from '../../Common/BarChart/BarChart'
import CircularProgressBar from '../../Common/CircularProgressBar/CircularProgressBar'
import history from '../../../history'
import {dummyAttendanceStats} from '../../../utils/DummyStats'
import HideScreen from '../../Common/HideScreen/HideScreen'
import {showFeatureLockAction} from '../../../redux/actions/commonAction'
import {events} from '../../../utils/EventsConstants'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
// import {CONSTS_DASHBOARD} from '../../../constants/dashboard.constants'

export default function Attendance() {
  const {instituteStats, instituteAttendance, instituteInfo, eventManager} =
    useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const isPremium = checkSubscriptionType(instituteInfo)

  const trackEvent = (eventName, status) => {
    eventManager.send_event(eventName, {
      screen_name: 'DASHBOARD_ATTENDANCE',
      status,
    })
  }

  return (
    <div className="w-full justify-between px-4 py-3 lg:px-0">
      <div className="w-full flex flex-row justify-between items-end">
        <div className="flex items-center">
          <div className="tm-h5 lg:hidden">{t('todayAttendance')}</div>
          <div className="tm-h5 flex justify-start hidden lg:block">
            {t('attendance')}
          </div>
        </div>
        <div className="relative">
          <Link
            className="tm-h6 tm-color-blue lg:hidden"
            to={isPremium ? secondaryItems.ATTENDANCE_MOBILE.route : DASHBOARD}
            onClick={() => {
              if (isPremium)
                trackEvent(events.ATTENDANCE_CLICKED_TFI, 'UNLOCKED')
              else {
                trackEvent(events.ATTENDANCE_CLICKED_TFI, 'LOCKED')
                dispatch(showFeatureLockAction(true))
              }
            }}
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
      <div className="tm-para4 mt-1">
        <Trans i18nKey="attendanceLastUpdatesInfo">
          Updates every 6 hours. Last Updated{' '}
          {instituteStats && instituteStats.today_u
            ? getDateAndTime(instituteStats.today_u)
            : '00:00 AM Today'}
        </Trans>
      </div>

      <div className="flex flex-row justify-between mt-3 lg:hidden">
        <Link
          className="bg-white tm-border-radius1 px-3 py-3 w-24/25 tm-box-shadow1"
          to={isPremium ? secondaryItems.ATTENDANCE_MOBILE.route : DASHBOARD}
          onClick={() => {
            if (isPremium) trackEvent(events.ATTENDANCE_CLICKED_TFI, 'UNLOCKED')
            else {
              trackEvent(events.ATTENDANCE_CLICKED_TFI, 'LOCKED')
              dispatch(showFeatureLockAction(true))
            }
          }}
        >
          <div className="w-full flex justify-center relative">
            {!isPremium ? <HideScreen /> : null}
            <CircularProgressBar
              type={0}
              value={
                isPremium
                  ? instituteAttendance &&
                    instituteAttendance[1] &&
                    instituteAttendance[1].attendance &&
                    instituteAttendance[1].attendance[6]
                  : dummyAttendanceStats[2]
              }
            />
          </div>
          <div className="tm-para2 mt-2">{t('studentsPresent')}</div>
        </Link>

        <Link
          className="bg-white tm-border-radius1 px-3 py-3 w-24/25 tm-box-shadow1"
          to={isPremium ? secondaryItems.ATTENDANCE_MOBILE.route : DASHBOARD}
          onClick={() => {
            if (isPremium) trackEvent(events.ATTENDANCE_CLICKED_TFI, 'UNLOCKED')
            else {
              trackEvent(events.ATTENDANCE_CLICKED_TFI, 'LOCKED')
              dispatch(showFeatureLockAction(true))
            }
          }}
        >
          <div className="w-full flex justify-center relative">
            {!isPremium ? <HideScreen /> : null}
            <CircularProgressBar
              type={0}
              value={
                isPremium
                  ? instituteAttendance &&
                    instituteAttendance[0] &&
                    instituteAttendance[0].attendance &&
                    instituteAttendance[0].attendance[6]
                  : dummyAttendanceStats[3]
              }
            />
          </div>
          <div className="tm-para2 mt-2">{t('teachersPresent')}</div>
        </Link>
      </div>

      <div className="hidden lg:flex mt-3 bg-white tm-border-radius1 px-3 py-3 justify-between tm-box-shadow1">
        <ErrorBoundary>
          {instituteAttendance &&
            instituteAttendance.map(({title, attendance}, index) => (
              <div
                className={`mx-4 my-4 w-9/10 px-3 ${
                  index === 0 || !isPremium ? 'cursor-pointer' : ''
                } relative`}
                key={title}
                onClick={() => {
                  if (index === 0) {
                    if (isPremium) {
                      trackEvent(events.ATTENDANCE_CLICKED_TFI, 'UNLOCKED')
                      history.push(sidebarData.STAFF_ATTENDANCE.route)
                    } else {
                      trackEvent(events.ATTENDANCE_CLICKED_TFI, 'LOCKED')
                      dispatch(showFeatureLockAction(true))
                    }
                  } else {
                    if (!isPremium) {
                      trackEvent(events.ATTENDANCE_CLICKED_TFI, 'LOCKED')
                      dispatch(showFeatureLockAction(true))
                    }
                  }
                }}
              >
                <ErrorBoundary>
                  {!isPremium ? <HideScreen /> : null}
                  <BarChart
                    title={title}
                    attendance={
                      isPremium ? attendance : dummyAttendanceStats[index]
                    }
                  />
                </ErrorBoundary>
              </div>
            ))}
        </ErrorBoundary>
      </div>
    </div>
  )
}

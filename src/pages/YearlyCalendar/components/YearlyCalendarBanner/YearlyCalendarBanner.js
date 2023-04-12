import React, {useEffect, useState} from 'react'
import {getCalendarBannerData} from '../../redux/actions/calendarActions'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'
import {checkSubscriptionType} from '../../../../utils/Helpers'
import {sidebarData} from '../../../../utils/SidebarItems'
import {announcementType} from '../../../../pages/communication/constants'
import {showFeatureLockAction} from '../../../../redux/actions/commonAction'
import history from '../../../../history'
import {SliderActionTypes} from '../../../../pages/communication/redux/actionTypes'
import YearlyBannerContainer from './YearlyBannerContainer'
import styles from './YearlyCalendarBanner.module.css'

const YearlyCalendarBanner = () => {
  const [isEventDataCalled, setIsEventDataCalled] = useState(false)
  const dispatch = useDispatch()
  const {
    tabInfo: {tabInfo},
  } = useSelector((state) => state.yearlyCalendarBannerInfo)
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const isPremium = checkSubscriptionType(instituteInfo)

  const today = Math.ceil(Date.now() / 1000)

  let popEl
  let completeEventsArray = []
  const getCompleteEventArray = () => {
    let todayEventsArray = []
    let tomorrowEventsArray = []
    if (tabInfo[0]) {
      for (let info in tabInfo) {
        if (tabInfo[info].starts_on <= today) {
          if (tabInfo[info].event_type === 2) {
            todayEventsArray.push(tabInfo[info])
          } else {
            todayEventsArray.unshift(tabInfo[info])
          }
        } else {
          if (tabInfo[info].event_type === 2) {
            tomorrowEventsArray.push(tabInfo[info])
          } else {
            tomorrowEventsArray.unshift(tabInfo[info])
          }
        }
      }
      completeEventsArray = [...todayEventsArray, ...tomorrowEventsArray]
    }
    return completeEventsArray
  }

  const handleGreetingClick = () => {
    eventManager.send_event(events.EVENT_SEND_GREETINGS_CLICKED_TFI, {
      screen_name: 'calendarGreeting',
      event_id: tabInfo[0]?._id,
    })
    if (isPremium) {
      history.push({
        pathname: sidebarData.ANNOUNCEMENTS.route,
        state: {
          isSliderOpen: true,
          selectedOption: announcementType.ANNOUNCEMENT,
        },
      })
      dispatch({type: SliderActionTypes.SET_SLIDER, payload: true})
    } else dispatch(showFeatureLockAction(true))
  }

  if (tabInfo.length > 0 && completeEventsArray.length === 0) {
    getCompleteEventArray()
  }

  useEffect(() => {
    if (tabInfo.length === 0 && !isEventDataCalled) {
      dispatch(getCalendarBannerData())
      setIsEventDataCalled(true)
    }
  }, [tabInfo])

  useEffect(() => {
    if (tabInfo.length > 0) {
      dispatch(getCalendarBannerData())
    }
  }, [])
  return (
    <>
      {completeEventsArray.length > 0 && (
        <div className={styles.YearlyBannerContainerBox}>
          <YearlyBannerContainer
            handleGreetingClick={handleGreetingClick}
            completeEventsArray={completeEventsArray}
            popEl={popEl}
          />
        </div>
      )}
    </>
  )
}

export default YearlyCalendarBanner

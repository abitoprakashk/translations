import {useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom'
import {events} from '../utils/EventsConstants'

//  logs time spent by user on a page
function useLogUserTime() {
  let location = useLocation()
  const timer = useRef(null)
  const prevRoute = useRef(null)
  const eventManager = useSelector((state) => state.eventManager)
  const isMobile = useSelector((state) => state.isMobile)

  const sendEvent = (event, data = {}) => {
    eventManager.send_event(event, data)
  }

  useEffect(() => {
    if (timer?.current) {
      sendEvent(events.USER_TIME_SPENT_ON_A_ROUTE_TFI, {
        time: Math.round((new Date() - new Date(timer.current)) / 1000),
        path: prevRoute?.current,
        device: isMobile ? 'M-WEB' : 'WEB',
        deviceHeight: window.innerHeight,
        deviceWidth: window.innerWidth,
      })
    }

    prevRoute.current = location.pathname
    timer.current = +new Date()
  }, [location])
}

export default useLogUserTime

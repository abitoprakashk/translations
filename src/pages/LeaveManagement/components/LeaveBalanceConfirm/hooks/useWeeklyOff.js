import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getCalendarData} from '../../../../YearlyCalendar/redux/actions/calendarActions'
import {
  TAB_OPTIONS,
  WEEKLY_OFF,
} from '../../../../YearlyCalendar/YearlyCalendar.constants'
import {
  getActiveSessionId,
  parseFrequency,
} from '../../../LeaveManagement.utils'

const sortOrder = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thrusday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
}

const useWeeklyOff = () => {
  const [weeklyoff, setweeklyoff] = useState('') // to show weekly off
  const [weeklyOffDays, setWeeklyOffDays] = useState([])

  const {
    tabInfo: {tabInfo},
  } = useSelector((state) => state.yearlyCalendarInfo) // yearly calendar

  const dispatch = useDispatch()

  useEffect(() => {
    // get yearly calendar
    dispatch(getCalendarData(TAB_OPTIONS[WEEKLY_OFF].eventType))
  }, [])

  useEffect(() => {
    // from yearly calendar data
    // set weekly off
    if (tabInfo?.length) {
      const activeSessionId = getActiveSessionId()
      let _weeklyoff = ''
      tabInfo.forEach((item) => {
        if (
          item.session_id === activeSessionId &&
          (item.applicable_to === 1 || item.applicable_to === 3)
        ) {
          _weeklyoff = `${_weeklyoff ? `${_weeklyoff},` : ''} ${parseFrequency(
            item
          )}`
        }
      })
      setweeklyoff(_weeklyoff)
      setWeeklyOffDays(
        tabInfo
          .filter(
            ({applicable_to}) => applicable_to === 1 || applicable_to === 3
          )
          .map(({event_name, tag}) => ({event_name, tag}))
          .sort(
            (a, b) =>
              sortOrder[a.event_name.toLowerCase()] -
              sortOrder[b.event_name.toLowerCase()]
          )
      )
    }
  }, [tabInfo])

  return [weeklyoff, weeklyOffDays]
}

export default useWeeklyOff

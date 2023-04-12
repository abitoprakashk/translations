import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'

export const getCalendarData = async (type) => {
  // based on event_type
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}academic-planner/events?event_type=${type}`,
  })

  return res.data
}

export const getCalendarBannerData = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}academic-planner/events/in/range`,
  })
  return res.data
}

export const createCalendarItem = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}academic-planner/upsert`,
    data: payload,
  })
  return res.data
}

export const deleteCalendarItem = async (eventId) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}academic-planner/delete`,
    data: {event_id: eventId},
  })
  return res.data
}

import {
  CalendarInfoActionType,
  CreateCalendarItemTypes,
  DeleteCalendarItemTypes,
  CalendarBannerInfoActionType,
} from '../actionTypes'

export const getCalendarData = (type) => {
  return {
    type: CalendarInfoActionType.FETCH_TAB_DATA_REQUEST,
    payload: type,
  }
}

export const getCalendarBannerData = (type) => {
  return {
    type: CalendarBannerInfoActionType.FETCH_TAB_CALENDAR_DATA_REQUEST,
    payload: type,
  }
}

export const createCalendarItem = (payload) => {
  return {
    type: CreateCalendarItemTypes.CREATE_CALENDAR_ITEM,
    payload,
  }
}

export const deleteCalendarItem = (payload) => {
  return {
    type: DeleteCalendarItemTypes.DELETE_CALENDAR_ITEM,
    payload,
  }
}

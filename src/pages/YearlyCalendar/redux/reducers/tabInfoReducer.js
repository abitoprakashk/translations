import {createTransducer} from '../../../../redux/helpers'
import {
  CalendarInfoActionType,
  CreateCalendarItemTypes,
  DeleteCalendarItemTypes,
  CalendarBannerInfoActionType,
} from '../actionTypes'

const INITIAL_STATE = {
  tabInfo: [],
  loading: false,
}

const setTabData = (state, {payload}) => {
  return {
    ...state,
    tabInfo: payload,
    loading: false,
  }
}

const showLoader = (state) => {
  return {
    ...state,
    loading: true,
  }
}

const hideLoader = (state) => {
  return {
    ...state,
    tabInfo: [],
    loading: false,
  }
}

const updateTabData = (state, {payload}) => {
  const update = state.tabInfo.some((item) => item._id == payload._id)
  const data = [...state.tabInfo]
  return {
    ...state,
    tabInfo: update
      ? data.map((item) => {
          if (item._id == payload._id) return payload
          else return item
        })
      : [...state.tabInfo, payload],
    loading: false,
  }
}

const deleteTabData = (state, payload) => {
  return {
    ...state,
    tabInfo: [
      ...state.tabInfo.filter((item) => {
        return item._id != payload.id
      }),
    ],
    loading: false,
  }
}

const tabInfoReducer = {
  [CalendarInfoActionType.FETCH_TAB_DATA_SUCCESS]: setTabData,
  [CalendarInfoActionType.FETCH_TAB_DATA_REQUEST]: showLoader,
  [CalendarInfoActionType.FETCH_TAB_DATA_FAILURE]: hideLoader,
  [CalendarBannerInfoActionType.FETCH_TAB_CALENDAR_DATA_SUCCESS]: setTabData,
  [CalendarBannerInfoActionType.FETCH_TAB_CALENDAR_DATA_REQUEST]: showLoader,
  [CalendarBannerInfoActionType.FETCH_TAB_CALENDAR_DATA_FAILURE]: hideLoader,
  [CreateCalendarItemTypes.CREATE_CALENDAR_ITEM_SUCCESS]: updateTabData,
  [CreateCalendarItemTypes.CREATE_CALENDAR_ITEM_FAILURE]: hideLoader,
  [CreateCalendarItemTypes.CREATE_CALENDAR_ITEM]: showLoader,
  [DeleteCalendarItemTypes.DELETE_CALENDAR_ITEM_SUCCESS]: deleteTabData,
  [DeleteCalendarItemTypes.DELETE_CALENDAR_ITEM_FAILURE]: hideLoader,
  [DeleteCalendarItemTypes.DELETE_CALENDAR_ITEM]: showLoader,
}

export default createTransducer(tabInfoReducer, INITIAL_STATE)

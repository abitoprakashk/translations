import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import {
  CalendarInfoActionType,
  CreateCalendarItemTypes,
  DeleteCalendarItemTypes,
  CalendarBannerInfoActionType,
} from './../actionTypes'

function* fetchTabInfo({payload}) {
  try {
    const res = yield call(Api.getCalendarData, payload)
    if (res.status == true)
      yield put({
        type: CalendarInfoActionType.FETCH_TAB_DATA_SUCCESS,
        payload: res.obj,
      })
    else {
      yield put({
        type: CalendarInfoActionType.FETCH_TAB_DATA_FAILURE,
      })
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    console.error(e)
    yield put({
      type: CalendarInfoActionType.FETCH_TAB_DATA_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* fetchCalendarTabInfo() {
  try {
    const res = yield call(Api.getCalendarBannerData)
    if (res.status == true)
      yield put({
        type: CalendarBannerInfoActionType.FETCH_TAB_CALENDAR_DATA_SUCCESS,
        payload: res.obj,
      })
    else {
      yield put({
        type: CalendarBannerInfoActionType.FETCH_TAB_CALENDAR_DATA_FAILURE,
      })
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    console.error(e)
    yield put({
      type: CalendarBannerInfoActionType.FETCH_TAB_CALENDAR_DATA_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* addCalendarItem(data) {
  try {
    const res = yield call(Api.createCalendarItem, data.payload)
    if (res.status === true) {
      yield put(
        showSuccessToast(
          `${data?.payload?._id ? 'Updated' : 'Added'} successfully`
        )
      )
      yield put({
        type: CreateCalendarItemTypes.CREATE_CALENDAR_ITEM_SUCCESS,
        payload: res?.obj,
      })
    }
  } catch (e) {
    console.error(e)
    yield put({
      type: CreateCalendarItemTypes.CREATE_CALENDAR_ITEM_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* deleteCalendarItem(data) {
  try {
    const res = yield call(Api.deleteCalendarItem, data?.payload)
    if (res.status === true) {
      yield put({
        type: 'calendar_item_deleted_event',
        payload: {status: true, id: data?.payload},
      })
      yield put(showSuccessToast('Deleted successfully'))
      yield put({
        type: DeleteCalendarItemTypes.DELETE_CALENDAR_ITEM_SUCCESS,
        id: data?.payload,
      })
    } else {
      yield put({
        type: DeleteCalendarItemTypes.DELETE_CALENDAR_ITEM_FAILURE,
      })
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    console.error(e)
    yield put({
      type: DeleteCalendarItemTypes.DELETE_CALENDAR_ITEM_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchFetchTabInfoYearlyCalendar() {
  yield takeEvery(CalendarInfoActionType.FETCH_TAB_DATA_REQUEST, fetchTabInfo)
}

export function* watchFetchCalendarTabInfoYearlyCalendar() {
  yield takeEvery(
    CalendarBannerInfoActionType.FETCH_TAB_CALENDAR_DATA_REQUEST,
    fetchCalendarTabInfo
  )
}

export function* watchAddCalendarItem() {
  yield takeEvery(CreateCalendarItemTypes.CREATE_CALENDAR_ITEM, addCalendarItem)
}

export function* watchDeleteCalendarItem() {
  yield takeEvery(
    DeleteCalendarItemTypes.DELETE_CALENDAR_ITEM,
    deleteCalendarItem
  )
}

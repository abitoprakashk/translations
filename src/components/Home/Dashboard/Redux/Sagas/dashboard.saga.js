import * as Api from '../dashboard.apis'
import {t} from 'i18next'
import {showErrorToast} from '../../../../../redux/actions/commonAction'
import globalActions from '../../../../../redux/actions/global.actions'
import {call, put, takeEvery} from 'redux-saga/effects'

function* postDashboardPreferenceObj(payload) {
  try {
    const res = yield call(Api.postDashboardPreferenceObj, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(
        globalActions.postDashboardPreference.success(res?.data?.status)
      )
      yield put(globalActions.getDashboardPreference.request())
    }
  } catch (e) {
    globalActions.postDashboardPreference.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getDashboardPreferenceObj() {
  try {
    const res = yield call(Api.getDashboardPreferenceObj)
    const {status} = res?.data
    if (status == true) {
      yield put(globalActions.getDashboardPreference.success(res?.data.obj))
    }
  } catch (e) {
    globalActions.getDashboardPreference.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getLatestWidgetAnnouncementObj() {
  try {
    const res = yield call(Api.getLatestWidgetAnnouncementObj)
    const {status} = res?.data
    if (status == true) {
      yield put(
        globalActions.getLatestWidgetAnnouncement.success(res?.data.obj)
      )
    }
  } catch (e) {
    globalActions.getLatestWidgetAnnouncement.failure(
      t('fetchPostsListErrorToast')
    )
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchDashboardPreference() {
  yield takeEvery(
    globalActions.getDashboardPreference.REQUEST,
    getDashboardPreferenceObj
  )
  yield takeEvery(
    globalActions.postDashboardPreference.REQUEST,
    postDashboardPreferenceObj
  )
  yield takeEvery(
    globalActions.getLatestWidgetAnnouncement.REQUEST,
    getLatestWidgetAnnouncementObj
  )
}

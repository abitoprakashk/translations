import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../redux/actions/commonAction'
import * as Api from './nps.api'
import globalActions from '../../../redux/actions/global.actions'
import {t} from 'i18next'

function* submitNPSForm(payload) {
  try {
    const res = yield call(Api.submitNPSForm, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.submitNPSFormTemplate.success(res?.data?.status))
      yield put(globalActions.NPSTemplateList.request())
    } else {
      yield put(
        globalActions.submitNPSForm.failure(t('fetchPostsListErrorToast'))
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.submitNPSFormTemplate.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getNPSForm() {
  try {
    const res = yield call(Api.getNPSForm)
    const {status} = res?.data
    if (status == true) {
      yield put(globalActions.NPSTemplateList.success(res?.data.obj))
    } else {
      yield put(globalActions.NPSTemplateList.failure({}))
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.NPSTemplateList.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchNPSTemplate() {
  yield takeEvery(globalActions.NPSTemplateList.REQUEST, getNPSForm)
  yield takeEvery(globalActions.submitNPSFormTemplate.REQUEST, submitNPSForm)
}

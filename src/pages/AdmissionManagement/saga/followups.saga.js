import {t} from 'i18next'
import {DateTime} from 'luxon'
import {call, put, takeEvery} from 'redux-saga/effects'
import globalActions from '../../../redux/actions/global.actions'
import {
  showSuccessToast,
  showErrorToast,
} from '../../../redux/actions/commonAction'
import * as Api from '../apis/apiService'

function* addUpdateFollowups({data, successAction, failureAction}) {
  try {
    let payload = {...data.payload}
    payload.followup_timestamp = DateTime.fromFormat(
      `${DateTime.fromJSDate(payload.followupDate).toFormat('dd-MM-yyyy')} ${
        payload.followupTime
      }`,
      'dd-MM-yyyy hh:mm a'
    ).toSeconds()
    delete payload.followupDate
    delete payload.followupTime
    const response = yield call(Api.addUpdateFollowups, payload)
    if (response?.data?.status) {
      successAction?.()
      yield put(globalActions.addUpdateFollowups.success())
      yield put(
        showSuccessToast(
          data.isFollowupPage
            ? t('followupRescheduledSuccessfully')
            : t('followupAddedSuccessfully')
        )
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    yield put(globalActions.addUpdateFollowups.failure())
  }
}

export function* watchAddUpdateFollowupsSaga() {
  yield takeEvery(globalActions.addUpdateFollowups.REQUEST, addUpdateFollowups)
}

function* getFollowupList() {
  try {
    const response = yield call(Api.getFollowupList)
    if (response?.data?.status) {
      yield put(globalActions.getFollowupList.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getFollowupList.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchFetchFollowupListSaga() {
  yield takeEvery(globalActions.getFollowupList.REQUEST, getFollowupList)
}

function* admissionCrmUpdateFollowUp({data}) {
  try {
    const response = yield call(Api.updateFollowup, data)
    if (response?.data?.status) {
      yield put(globalActions.updateFollowups.success())
      yield put(globalActions.getFollowupList.request())
      yield put(showSuccessToast(t('followupUpdatedSuccessfully')))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.updateFollowups.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchAdmissionUpdateFollowUp() {
  yield takeEvery(
    globalActions.updateFollowups.REQUEST,
    admissionCrmUpdateFollowUp
  )
}

function* getFollowups({data}) {
  try {
    const response = yield call(Api.getFollowups, data)
    if (response?.data?.status) {
      yield put(globalActions.getFollowups.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.getFollowups.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchGetFollowupsSaga() {
  yield takeEvery(globalActions.getFollowups.REQUEST, getFollowups)
}

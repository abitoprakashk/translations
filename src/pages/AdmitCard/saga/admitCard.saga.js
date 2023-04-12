import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import globalActions from '../../../redux/actions/global.actions'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../redux/actions/commonAction'
import * as Api from '../apis/apiService'

function* getStudentListSectionWise(action) {
  try {
    const res = yield call(Api.getStudentsListSectionWise, action.data)

    if (res.status) {
      yield put(globalActions.getStudentListSectionWise.success(res.obj))
    } else {
      let error = 'Something went wrong'
      if (res.error_code === 7012) {
        error = 'Invalid Data'
      }
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('somethingWentWrongPleaseCheckYourNetwork')))
  }
}

export function* watchGetStudentListSectionWiseSaga() {
  yield takeEvery(
    globalActions.getStudentListSectionWise.REQUEST,
    getStudentListSectionWise
  )
}

function* getAdmitCardsGenerated(action) {
  try {
    const res = yield call(Api.generateAdmitCards, action.data)

    if (res.status) {
      yield put(globalActions.generateAdmitCards.success(res.obj))
    } else {
      let error = 'Something went wrong'
      if (res.error_code === 7012) {
        error = 'Invalid Data'
      }
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('somethingWentWrongPleaseCheckYourNetwork')))
  }
}

export function* watchGetAdmitCardSaga() {
  yield takeEvery(
    globalActions.generateAdmitCards.REQUEST,
    getAdmitCardsGenerated
  )
}

function* getBulkDownloadAdmitCards(action) {
  try {
    const res = yield call(Api.generateBulkDownloadAdmiCardUrl, action.data)

    if (res.status) {
      yield put(globalActions.bulkDownloadAdmitCard.success(res.obj))
      if (res.obj.length > 0)
        yield put(showSuccessToast(t('admitCardGenerationSuccessToast')))
    } else {
      let error = 'Something went wrong'
      if (res.error_code === 7012) {
        error = 'Invalid Data'
      }
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('somethingWentWrongPleaseCheckYourNetwork')))
  }
}

export function* watchGetBulkDownloadAdmitCard() {
  yield takeEvery(
    globalActions.bulkDownloadAdmitCard.REQUEST,
    getBulkDownloadAdmitCards
  )
}

function* getAdmitCardDownloadUrl(action) {
  try {
    const res = yield call(Api.getAdmitCardDownloadUrl, action.data)

    if (res.status) {
      yield put(globalActions.getAdmitCardDownloadUrl.success(res.obj))
      yield put(showSuccessToast(t('admitCardsDownloadedSuccessToast')))
    } else {
      let error = 'Something went wrong'
      if (res.error_code === 7012) {
        error = 'Invalid Data'
      }
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('somethingWentWrongPleaseCheckYourNetwork')))
  }
}

export function* watchGetAdmitCardDownloadUrl() {
  yield takeEvery(
    globalActions.getAdmitCardDownloadUrl.REQUEST,
    getAdmitCardDownloadUrl
  )
}

import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apis/stops.apis'
import globalActions from '../../../../redux/actions/global.actions'
import {t} from 'i18next'

function* fetchTransportStops({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchStops)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.transportStops.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.transportStops.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* updateTransportStops({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.updateStop, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.updateTransportStops.success(response?.data?.obj))
      yield put(globalActions.transportStops.request())
      yield put(globalActions?.transportAggregates?.request())
      yield put(globalActions.transportRoutes.request())
      sessionStorage.removeItem('stopId')
    } else if (response?.data?.error_code === 7082) {
      throw t('duplicateStopNameErrMsg')
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.updateTransportStops.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* deleteTransportStops({data, successAction, failureAction} = {}) {
  try {
    const response = yield call(Api.deleteStop, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.deleteTransportStops.success(response?.data?.obj))
      yield put(globalActions?.transportAggregates?.request())

      yield put(globalActions.transportStops.request())
      yield put(globalActions.transportRoutes.request())
      yield put(showSuccessToast(t('stopDeletedSuccessfully')))
    } else if (response?.data?.error_code === 11004) {
      yield put(showErrorToast(t('stopAssociatedWithRouteDeleteError')))
      failureAction?.()
      yield put(
        globalActions.deleteTransportStops.failure(response?.data?.error_msg)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.deleteTransportStops.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

export function* watchTransportStopsSaga() {
  yield takeEvery(globalActions.transportStops.REQUEST, fetchTransportStops)
  yield takeEvery(
    globalActions.updateTransportStops.REQUEST,
    updateTransportStops
  )
  yield takeEvery(
    globalActions.deleteTransportStops.REQUEST,
    deleteTransportStops
  )
}

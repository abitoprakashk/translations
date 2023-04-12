import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apis/transportRoutes.apis'
import globalActions from '../../../../redux/actions/global.actions'
import {t} from 'i18next'

function* fetchTransportRoutes({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchRoutes)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.transportRoutes.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.transportRoutes.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* updateTransportRoutes({data, successAction, failureAction} = {}) {
  try {
    const response = yield call(Api.updateRoutes, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.updateTransportRoutes.success(response?.data?.obj)
      )
      yield put(globalActions.transportRoutes.request())
      yield put(globalActions?.transportAggregates?.request())
      yield put(globalActions.transportVehicles.request())
      yield put(globalActions.transportStaff.request())
      yield put(
        showSuccessToast(
          data?.routes_list?.[0]?._id
            ? t('routeUpdatedSuccessfully')
            : t('routeCreatedSuccessfully')
        )
      )
    } else if (response?.data?.error_code === 7082) {
      throw t('duplicateRouteExists')
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.updateTransportRoutes.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* deleteTransportRoutes({data, successAction, failureAction} = {}) {
  try {
    const response = yield call(Api.deleteRoutes, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.deleteTransportRoutes.success(response?.data?.obj)
      )
      yield put(globalActions?.transportAggregates?.request())

      yield put(globalActions.transportRoutes.request())
      yield put(globalActions.transportVehicles.request())
      yield put(globalActions.transportStaff.request())
      yield put(showSuccessToast(t('routeDeletedSuccessfully')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.deleteTransportRoutes.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

export function* watchTransportRoutesSaga() {
  yield takeEvery(globalActions.transportRoutes.REQUEST, fetchTransportRoutes)
  yield takeEvery(
    globalActions.updateTransportRoutes.REQUEST,
    updateTransportRoutes
  )
  yield takeEvery(
    globalActions.deleteTransportRoutes.REQUEST,
    deleteTransportRoutes
  )
}

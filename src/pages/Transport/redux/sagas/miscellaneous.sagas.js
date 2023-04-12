import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apis/miscellaneous.apis'
import globalActions from '../../../../redux/actions/global.actions'
import {t} from 'i18next'

function* fetchTransportAggregates({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchTransportAggregates)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.transportAggregates.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.transportAggregates.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* fetchTransportLiveTracking({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchTransportLiveTracking)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.transportLiveTracking.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.transportLiveTracking.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* fetchSchoolTransportSettings({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchSettings)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchSchoolTransportSettings.success(response?.data?.obj)
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.fetchSchoolTransportSettings.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* updateSchoolLocation({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.updateSchoolLocation, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.updateSchoolLocation.success(response?.data?.obj))
      yield put(globalActions.fetchSchoolTransportSettings.request())
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.updateSchoolLocation.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* requestTransportGPS({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.requestTransportGPS, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.requestTransportGPS.success(response?.data?.obj))
      yield put(globalActions.fetchSchoolTransportSettings.request())
      yield put(showSuccessToast(t('requestSuccessfullySent')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.requestTransportGPS.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* acknowledgeVehicleSOS({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.acknowledgeVehicleSOS, data)

    if (response?.data?.status) {
      successAction?.(response?.data)
      yield put(
        globalActions.acknowledgeVehicleSOS.success(response?.data?.obj)
      )
      yield put(globalActions?.transportLiveTracking?.request())
      yield put(showSuccessToast(t('sosAcknowledgedSuccessfully')))
    } else {
      throw response?.data?.msg
    }
  } catch (error) {
    failureAction?.(error)
    yield put(globalActions.acknowledgeSOS.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

export function* watchTransportMiscellaneousSaga() {
  yield takeEvery(
    globalActions.transportAggregates.REQUEST,
    fetchTransportAggregates
  )
  yield takeEvery(
    globalActions.transportLiveTracking.REQUEST,
    fetchTransportLiveTracking
  )
  yield takeEvery(
    globalActions.fetchSchoolTransportSettings.REQUEST,
    fetchSchoolTransportSettings
  )
  yield takeEvery(
    globalActions.updateSchoolLocation.REQUEST,
    updateSchoolLocation
  )
  yield takeEvery(
    globalActions.requestTransportGPS.REQUEST,
    requestTransportGPS
  )
  yield takeEvery(
    globalActions.acknowledgeVehicleSOS.REQUEST,
    acknowledgeVehicleSOS
  )
}

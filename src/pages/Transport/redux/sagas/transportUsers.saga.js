import {call, debounce, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apis/transportUsers.apis'
import globalActions from '../../../../redux/actions/global.actions'
import {t} from 'i18next'

function* fetchTransportUsers({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchTransportUsers, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.transportPassengers.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.transportPassengers.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* deleteTransportUsers({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.deleteTransportUsers, {
      passengers_list: data?.passengers_list,
    })
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.deleteTransportPassengers.success(response?.data?.obj)
      )
      yield put(
        globalActions.transportPassengers.request({...data?.paginationInputs})
      )
      yield put(globalActions.transportStops.request())
      yield put(globalActions.transportRoutes.request())
      yield put(showSuccessToast(t('passengerRemovedSuccessfully')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.deleteTransportPassengers.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* updateUserWiseTransport({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.updateUserWiseTransport, {
      passengers_list: data,
    })
    if (response?.data?.status) {
      successAction?.({passengers_list: response.data.obj})
      yield put(
        globalActions.updateUserWiseTransport.success(response.data.obj)
      )
      yield put(showSuccessToast(t('transportDataUpdatedSuccessfully')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.updateUserWiseTransport.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

export function* watchTransportUsersSaga() {
  yield debounce(
    300,
    globalActions.transportPassengers.REQUEST,
    fetchTransportUsers
  )

  yield takeEvery(
    globalActions.deleteTransportPassengers.REQUEST,
    deleteTransportUsers
  )

  yield takeEvery(
    globalActions.updateUserWiseTransport.REQUEST,
    updateUserWiseTransport
  )
}

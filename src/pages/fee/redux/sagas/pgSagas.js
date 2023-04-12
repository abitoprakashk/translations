import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../apis/paymentGatewayApis'
import {pgListActionType} from '../actionTypes/pgActionTypes'

function* fetchPgList({payload}) {
  try {
    const res = yield call(Api.getPgList, payload)
    if (res.status == true) {
      yield put({
        type: pgListActionType.FETCH_PG_LIST_SUCCESS,
        payload: res.obj,
      })
    }
  } catch (e) {
    console.error(e)
    yield put({
      type: pgListActionType.FETCH_PG_LIST_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* fetchPgFields({payload}) {
  try {
    const res = yield call(Api.getPgFields, payload)
    if (res.status == true) {
      yield put({
        type: pgListActionType.FETCH_PG_LIST_FIELDS_SUCCESS,
        payload: res.obj,
      })
    } else {
      yield put({
        type: pgListActionType.FETCH_PG_LIST_FIELDS_FAILURE,
      })
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    console.error(e)
    yield put({
      type: pgListActionType.FETCH_PG_LIST_FIELDS_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* updatePgList({payload}) {
  try {
    const res = yield call(Api.updatePgCredentials, payload)
    const {status, obj} = res
    if (status == true) {
      if (obj.verification_status) {
        yield put(showSuccessToast('Updated Successfully'))
        yield put({
          type: pgListActionType.UPDATE_PG_DATA_SUCCESS,
        })
      } else {
        yield put(showErrorToast('Failed to verify'))
        yield put({
          type: pgListActionType.UPDATE_PG_DATA_FAILURE,
        })
      }
    } else {
      yield put({
        type: pgListActionType.UPDATE_PG_DATA_FAILURE,
      })
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    console.error(e)
    yield put({
      type: pgListActionType.UPDATE_PG_DATA_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchFetchPgList() {
  yield takeEvery(pgListActionType.FETCH_PG_LIST, fetchPgList)
}
export function* watchFetchPgFields() {
  yield takeEvery(pgListActionType.FETCH_PG_LIST_FIELDS, fetchPgFields)
}

export function* watchUpdatePgData() {
  yield takeLatest(pgListActionType.UPDATE_PG_DATA_REQUEST, updatePgList)
}

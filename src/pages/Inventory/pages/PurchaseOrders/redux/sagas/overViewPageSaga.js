import {Trans} from 'react-i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../../redux/actions/commonAction'
import * as Api from '../../../Overview/apiServices'
import {inventoryPurchaseOrderActionTypes} from '../actions/actionsTypes'

const addPurchaseOrderSuccessToast = (
  <Trans i18nKey={'addPurchaseOrderSuccessToast'}>
    Purchase order added successfully
  </Trans>
)

const editPurchaseOrderSuccessToast = (
  <Trans i18nKey={'editPurchaseOrderSuccessToast'}>
    Purchase order updated successfully
  </Trans>
)

const deletePurchaseOrderSuccessToast = (
  <Trans i18nKey={'deletePurchaseOrderSuccessToast'}>
    Purchase order deleted successfully
  </Trans>
)
const addPurchaseOrderFailureToast = (
  <Trans i18nKey={'addPurchaseOrderFailureToast'}>
    Error while adding purchase order
  </Trans>
)

const editPurchaseOrderFailureToast = (
  <Trans i18nKey={'editPurchaseOrderFailureToast'}>
    Error while updating purchase order
  </Trans>
)

const deletePurchaseOrderFailureToast = (
  <Trans i18nKey={'deletePurchaseOrderFailureToast'}>
    Error while deleting purchase order
  </Trans>
)

function* addInventoryPurchaseOrderSaga(payload) {
  try {
    const res = yield call(Api.addInventoryPurchaseOrder, payload)
    if (res.status) {
      yield put({
        type: inventoryPurchaseOrderActionTypes.ADD_INVENTORY_PURCHASE_ORDER_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(addPurchaseOrderSuccessToast))
      yield put({
        type: inventoryPurchaseOrderActionTypes.GET_PURCHASE_ORDER_LIST_REQUEST,
      })
    } else {
      yield put(showErrorToast(addPurchaseOrderFailureToast))
    }
  } catch (error) {
    yield put(showErrorToast(addPurchaseOrderFailureToast))
    yield put({
      type: inventoryPurchaseOrderActionTypes.ADD_INVENTORY_PURCHASE_ORDER_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchAddInventoryPurchaseOrder() {
  yield takeEvery(
    inventoryPurchaseOrderActionTypes.ADD_INVENTORY_PURCHASE_ORDER_REQUEST,
    addInventoryPurchaseOrderSaga
  )
}

function* deletePurchaseOrderSaga(payload) {
  try {
    const res = yield call(Api.deletePurchaseOrder, payload)
    if (res.status) {
      yield put({
        type: inventoryPurchaseOrderActionTypes.DELETE_PURCHASE_ORDER_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(deletePurchaseOrderSuccessToast))
      yield put({
        type: inventoryPurchaseOrderActionTypes.GET_PURCHASE_ORDER_LIST_REQUEST,
      })
    } else {
      yield put(showErrorToast(deletePurchaseOrderFailureToast))
      yield put({
        type: inventoryPurchaseOrderActionTypes.DELETE_PURCHASE_ORDER_FAILURE,
        payload: {loading: false, error: res.msg},
      })
    }
  } catch (error) {
    yield put(showErrorToast(deletePurchaseOrderFailureToast))
    yield put({
      type: inventoryPurchaseOrderActionTypes.DELETE_PURCHASE_ORDER_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchDeletePurchaseOrder() {
  yield takeEvery(
    inventoryPurchaseOrderActionTypes.DELETE_PURCHASE_ORDER_REQUEST,
    deletePurchaseOrderSaga
  )
}

function* getPurchaseOrderListSaga(payload) {
  try {
    const res = yield call(Api.getPurchaseOrderList, payload.payload)
    yield put({
      type: inventoryPurchaseOrderActionTypes.GET_PURCHASE_ORDER_LIST_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryPurchaseOrderActionTypes.GET_PURCHASE_ORDER_LIST_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchGetPurchaseOrderList() {
  yield takeEvery(
    inventoryPurchaseOrderActionTypes.GET_PURCHASE_ORDER_LIST_REQUEST,
    getPurchaseOrderListSaga
  )
}

function* searchInventoryPurchaseOrderVendorSaga(payload) {
  try {
    const res = yield call(Api.searchInventoryPurchaseOrderVendor, payload)
    yield put({
      type: inventoryPurchaseOrderActionTypes.SEARCH_INVENTORY_PURCHASE_ORDER_VENDOR_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryPurchaseOrderActionTypes.SEARCH_INVENTORY_PURCHASE_ORDER_VENDOR_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchSearchInventoryPurchaseOrderVendor() {
  yield takeEvery(
    inventoryPurchaseOrderActionTypes.SEARCH_INVENTORY_PURCHASE_ORDER_VENDOR_REQUEST,
    searchInventoryPurchaseOrderVendorSaga
  )
}

function* updateInventoryPurchaseOrderSaga(payload) {
  try {
    const res = yield call(Api.updateInventoryPurchaseOrder, payload)
    if (res.status) {
      yield put({
        type: inventoryPurchaseOrderActionTypes.UPDATE_INVENTORY_PURCHASE_ORDER_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(editPurchaseOrderSuccessToast))
      yield put({
        type: inventoryPurchaseOrderActionTypes.GET_PURCHASE_ORDER_LIST_REQUEST,
      })
    } else {
      yield put(showErrorToast(editPurchaseOrderFailureToast))
    }
  } catch (error) {
    yield put(showErrorToast(editPurchaseOrderFailureToast))
    yield put({
      type: inventoryPurchaseOrderActionTypes.UPDATE_INVENTORY_PURCHASE_ORDER_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchUpdateInventoryPurchaseOrder() {
  yield takeEvery(
    inventoryPurchaseOrderActionTypes.UPDATE_INVENTORY_PURCHASE_ORDER_REQUEST,
    updateInventoryPurchaseOrderSaga
  )
}

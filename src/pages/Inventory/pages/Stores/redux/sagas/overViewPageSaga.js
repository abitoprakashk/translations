import {Trans} from 'react-i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../../redux/actions/commonAction'
import * as Api from '../../../Overview/apiServices'
import {inventoryStoreActionTypes} from '../actions/actionsTypes'

const addItemRoomSuccessToast = (
  <Trans i18nKey={'addItemRoomSuccessToast'}>Room added successfully</Trans>
)

const editItemRoomSuccessToast = (
  <Trans i18nKey={'editItemRoomSuccessToast'}>Room updated successfully</Trans>
)

const deleteItemRoomSuccessToast = (
  <Trans i18nKey={'deleteItemRoomSuccessToast'}>
    Room deleted successfully
  </Trans>
)
const addItemRoomFailureToast = (
  <Trans i18nKey={'addItemRoomFailureToast'}>Error while adding room</Trans>
)

const editItemRoomFailureToast = (
  <Trans i18nKey={'editItemRoomFailureToast'}>Error while updating room</Trans>
)

const deleteItemRoomFailureToast = (
  <Trans i18nKey={'deleteItemRoomFailureToast'}>
    Error while deleting room
  </Trans>
)

function* addInventoryItemStoreSaga(payload) {
  try {
    const res = yield call(Api.addInventoryItemStore, payload.payload)
    if (res.status) {
      yield put({
        type: inventoryStoreActionTypes.ADD_INVENTORY_ITEM_STORE_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(addItemRoomSuccessToast))
      yield put({
        type: inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_REQUEST,
      })
    } else {
      yield put(showErrorToast(addItemRoomFailureToast))

      yield put({
        type: inventoryStoreActionTypes.ADD_INVENTORY_ITEM_STORE_FAILURE,
        payload: {loading: false, error: res.msg},
      })
    }
  } catch (error) {
    yield put(showErrorToast(addItemRoomFailureToast))
    yield put({
      type: inventoryStoreActionTypes.ADD_INVENTORY_ITEM_STORE_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchAddInventoryItemStore() {
  yield takeEvery(
    inventoryStoreActionTypes.ADD_INVENTORY_ITEM_STORE_REQUEST,
    addInventoryItemStoreSaga
  )
}

function* searchInventoryItemStoreSaga(payload) {
  try {
    const res = yield call(Api.searchInventoryItemStore, payload)
    yield put({
      type: inventoryStoreActionTypes.SEARCH_INVENTORY_ITEM_STORE_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryStoreActionTypes.SEARCH_INVENTORY_ITEM_STORE_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchSearchInventoryItemStore() {
  yield takeEvery(
    inventoryStoreActionTypes.SEARCH_INVENTORY_ITEM_STORE_REQUEST,
    searchInventoryItemStoreSaga
  )
}

function* getInventoryStoreListSaga() {
  try {
    const res = yield call(Api.getInventoryStoreList)
    yield put({
      type: inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchGetInventoryStoreList() {
  yield takeEvery(
    inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_REQUEST,
    getInventoryStoreListSaga
  )
}

function* deleteInventoryItemStoreSaga(payload) {
  try {
    const res = yield call(Api.deleteInventoryItemStore, payload)
    if (res.status) {
      yield put({
        type: inventoryStoreActionTypes.DELETE_INVENTORY_ITEM_STORE_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(deleteItemRoomSuccessToast))

      yield put({
        type: inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_REQUEST,
      })
    } else {
      yield put(showErrorToast(deleteItemRoomFailureToast))
    }
  } catch (error) {
    yield put(showErrorToast(deleteItemRoomFailureToast))

    yield put({
      type: inventoryStoreActionTypes.DELETE_INVENTORY_ITEM_STORE_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchDeleteInventoryItemStore() {
  yield takeEvery(
    inventoryStoreActionTypes.DELETE_INVENTORY_ITEM_STORE_REQUEST,
    deleteInventoryItemStoreSaga
  )
}

function* fetchInventoryStoreItemsSaga(payload) {
  try {
    const res = yield call(Api.fetchInventoryStoreItems, payload)
    yield put({
      type: inventoryStoreActionTypes.FETCH_INVENTORY_STORE_ITEMS_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryStoreActionTypes.FETCH_INVENTORY_STORE_ITEMS_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchFetchInventoryStoreItemsSaga() {
  yield takeEvery(
    inventoryStoreActionTypes.FETCH_INVENTORY_STORE_ITEMS_REQUEST,
    fetchInventoryStoreItemsSaga
  )
}

function* updateInventoryItemStoreSaga(payload) {
  try {
    const res = yield call(Api.updateInventoryItemStore, payload.payload)
    if (res.status) {
      yield put({
        type: inventoryStoreActionTypes.UPDATE_INVENTORY_ITEM_STORE_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(editItemRoomSuccessToast))
      yield put({
        type: inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_REQUEST,
      })
    } else {
      yield put(showErrorToast(editItemRoomFailureToast))

      yield put({
        type: inventoryStoreActionTypes.UPDATE_INVENTORY_ITEM_STORE_FAILURE,
        payload: {loading: false, error: res.msg},
      })
    }
  } catch (error) {
    yield put(showErrorToast(editItemRoomFailureToast))
    yield put({
      type: inventoryStoreActionTypes.UPDATE_INVENTORY_ITEM_STORE_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchUpdateInventoryItemStore() {
  yield takeEvery(
    inventoryStoreActionTypes.UPDATE_INVENTORY_ITEM_STORE_REQUEST,
    updateInventoryItemStoreSaga
  )
}

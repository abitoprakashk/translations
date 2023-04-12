import {call, debounce, put, takeEvery} from 'redux-saga/effects'
import {Trans} from 'react-i18next'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../../redux/actions/commonAction'
import * as Api from '../../apiServices'
import inventoryOverviewActionTypes from '../actions/actionsTypes'
import {inventoryStoreActionTypes} from '../../../Stores/redux/actions/actionsTypes'

const addCategoryItemsSuccessToast = (
  <Trans i18nKey={'addCategoryItemsSuccessToast'}>
    Categories and items added successfully
  </Trans>
)

const editCategoryItemsSuccessToast = (
  <Trans i18nKey={'editCategoryItemsSuccessToast'}>
    Category and items updated successfully
  </Trans>
)

const deleteCategoryItemsSuccessToast = (
  <Trans i18nKey={'deleteCategoryItemsSuccessToast'}>
    Category and items deleted successfully
  </Trans>
)

const deleteItemSuccessToast = (
  <Trans i18nKey={'deleteItemSuccessToast'}>Item deleted successfully</Trans>
)

const addCategoryItemsFailureToast = (
  <Trans i18nKey={'addCategoryItemsFailureToast'}>
    Error while adding categories and items
  </Trans>
)

const editCategoryItemsFailureToast = (
  <Trans i18nKey={'editCategoryItemsFailureToast'}>
    Error while updating categories and items
  </Trans>
)

const deleteCategoryItemsFailureToast = (
  <Trans i18nKey={'deleteCategoryItemsFailureToast'}>
    Error while deleting categories and items
  </Trans>
)

const deleteItemFailureToast = (
  <Trans i18nKey={'deleteItemFailureToast'}>Error while deleting item</Trans>
)

const updateUnitConditionSuccessToast = (
  <Trans i18nKey={'updateUnitConditionSuccessToast'}>
    Item unit condition updated successfully
  </Trans>
)

const updateUnitConditionFailureToast = (
  <Trans i18nKey={'updateUnitConditionFailureToast'}>
    Error while updating unit condition{' '}
  </Trans>
)

const allocationSuccessToast = (
  <Trans i18nKey={'allocationSuccessToast'}>Allocation successful</Trans>
)

const allocationRemovedSuccessToast = (
  <Trans i18nKey={'allocationRemovedSuccessToast'}>
    Allocation removed successfully
  </Trans>
)

const allocationFailureToast = (
  <Trans i18nKey={'allocationFailureToast'}>Allocation failed</Trans>
)

function* getAggregateData() {
  try {
    const res = yield call(Api.getAggregates)
    yield put({
      type: inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_FAILURE,
      loading: false,
    })
  }
}

export function* watchGetAggregateData() {
  yield takeEvery(
    inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_REQUEST,
    getAggregateData
  )
}

function* getAllCategories() {
  try {
    const res = yield call(Api.getAllCategories)
    yield put({
      type: inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_FAILURE,
      loading: false,
    })
  }
}

export function* watchGetAllCategories() {
  yield takeEvery(
    inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_REQUEST,
    getAllCategories
  )
}

function* getAllItemsListSaga(payload) {
  try {
    const res = yield call(Api.getAllItemsList, payload)
    yield put({
      type: inventoryOverviewActionTypes.FETCH_ALL_ITEMS_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.FETCH_ALL_ITEMS_FAILURE,
      loading: false,
    })
  }
}

export function* watchgetAllItemsList() {
  yield takeEvery(
    inventoryOverviewActionTypes.FETCH_ALL_ITEMS_REQUEST,
    getAllItemsListSaga
  )
}

function* getSingleItemByIDSaga(payload) {
  try {
    const res = yield call(Api.getSingleItemByID, payload)
    yield put({
      type: inventoryOverviewActionTypes.FETCH_SINGLE_ITEM_BY_ID_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.FETCH_SINGLE_ITEM_BY_ID_FAILURE,
      loading: false,
    })
  }
}

export function* watchgetSingleItemByID() {
  yield takeEvery(
    inventoryOverviewActionTypes.FETCH_SINGLE_ITEM_BY_ID_REQUEST,
    getSingleItemByIDSaga
  )
}

function* getAllItemsBySearchTextSaga(payload) {
  try {
    const res = yield call(Api.getAllItemsBySearchText, payload)
    yield put({
      type: inventoryOverviewActionTypes.FETCH_ALL_ITEM_BY_SEARCHTEXT_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.FETCH_ALL_ITEM_BY_SEARCHTEXT_FAILURE,
      loading: false,
    })
  }
}

export function* watchGetAllItemsBySearchText() {
  yield debounce(
    300,
    inventoryOverviewActionTypes.FETCH_ALL_ITEM_BY_SEARCHTEXT_REQUEST,
    getAllItemsBySearchTextSaga
  )
}

function* checkCategoryNameAvailabilitySaga(payload = {category_name: ''}) {
  try {
    const res = yield call(Api.checkCategoryNameAvailability, payload)
    yield put({
      type: inventoryOverviewActionTypes.CHECK_CATEGORY_NAME_AVAILABILITY_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.CHECK_CATEGORY_NAME_AVAILABILITY_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchCheckCategoryNameAvailability() {
  yield takeEvery(
    inventoryOverviewActionTypes.CHECK_CATEGORY_NAME_AVAILABILITY_REQUEST,
    checkCategoryNameAvailabilitySaga
  )
}

function* checkItemNameAvailabilitySaga(payload) {
  try {
    const res = yield call(Api.checkItemNameAvailability, payload)
    yield put({
      type: inventoryOverviewActionTypes.CHECK_ITEM_NAME_AVAILABILITY_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.CHECK_ITEM_NAME_AVAILABILITY_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchcheckItemNameAvailability() {
  yield takeEvery(
    inventoryOverviewActionTypes.CHECK_ITEM_NAME_AVAILABILITY_REQUEST,
    checkItemNameAvailabilitySaga
  )
}

function* createPrefixSaga(
  payload = {
    item_name: '',
    prefix_blacklist: [],
  }
) {
  try {
    const res = yield call(Api.createPrefix, payload)
    yield put({
      type: inventoryOverviewActionTypes.CREATE_PREFIX_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.CREATE_PREFIX_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchcreatePrefix() {
  yield debounce(
    300,
    inventoryOverviewActionTypes.CREATE_PREFIX_REQUEST,
    createPrefixSaga
  )
}

function* addInventoryItemSaga(payload) {
  try {
    const res = yield call(Api.addInventoryItem, payload)
    if (res.status) {
      yield put({
        type: inventoryOverviewActionTypes.ADD_INVENTORY_ITEM_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(addCategoryItemsSuccessToast))
      yield put({
        type: inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_REQUEST,
      })
      yield put({
        type: inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_REQUEST,
      })
    } else {
      yield put(showErrorToast(addCategoryItemsFailureToast))
    }
  } catch (error) {
    yield put(showErrorToast(addCategoryItemsFailureToast))
    yield put({
      type: inventoryOverviewActionTypes.ADD_INVENTORY_ITEM_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}
export function* watchAddInventoryItem() {
  yield takeEvery(
    inventoryOverviewActionTypes.ADD_INVENTORY_ITEM_REQUEST,
    addInventoryItemSaga
  )
}

function* searchInventoryCategorySaga(payload = {search_text: ''}) {
  try {
    const res = yield call(Api.searchInventoryCategory, payload)
    yield put({
      type: inventoryOverviewActionTypes.SEARCH_INVENTORY_CATEGORY_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.SEARCH_INVENTORY_CATEGORY_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}
export function* watchSearchInventoryCategory() {
  yield takeEvery(
    inventoryOverviewActionTypes.SEARCH_INVENTORY_CATEGORY_REQUEST,
    searchInventoryCategorySaga
  )
}

function* searchInventoryItemSaga(payload) {
  try {
    const res = yield call(Api.searchInventoryItem, payload)
    yield put({
      type: inventoryOverviewActionTypes.SEARCH_INVENTORY_ITEM_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.SEARCH_INVENTORY_ITEM_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchSearchInventoryItem() {
  yield takeEvery(
    inventoryOverviewActionTypes.SEARCH_INVENTORY_ITEM_REQUEST,
    searchInventoryItemSaga
  )
}

function* deleteInventoryItemCategorySaga(payload) {
  try {
    const res = yield call(Api.deleteInventoryItemCategory, payload)
    if (res.status) {
      yield put({
        type: inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_CATEGORY_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(deleteCategoryItemsSuccessToast))
      yield put({
        type: inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_REQUEST,
      })
    } else {
      yield put(showErrorToast(deleteCategoryItemsFailureToast))
    }
  } catch (error) {
    yield put(showErrorToast(deleteCategoryItemsFailureToast))
    yield put({
      type: inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_CATEGORY_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchDeleteInventoryItemCategory() {
  yield takeEvery(
    inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_CATEGORY_REQUEST,
    deleteInventoryItemCategorySaga
  )
}

function* deleteInventoryItemSaga(payload) {
  try {
    const res = yield call(Api.deleteInventoryItem, payload)
    if (res.status) {
      yield put({
        type: inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(deleteItemSuccessToast))
    } else {
      yield put(showErrorToast(deleteItemFailureToast))
    }
  } catch (error) {
    yield put(showErrorToast(deleteItemFailureToast))

    yield put({
      type: inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchDeleteInventoryItem() {
  yield takeEvery(
    inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_REQUEST,
    deleteInventoryItemSaga
  )
}

function* updateInventoryItemCategorySaga(payload) {
  try {
    const res = yield call(Api.updateInventoryItemCategory, payload)
    if (res.status) {
      yield put({
        type: inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_CATEGORY_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(editCategoryItemsSuccessToast))
      yield put({
        type: inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_REQUEST,
      })
    } else {
      yield put(showErrorToast(editCategoryItemsFailureToast))
    }
  } catch (error) {
    yield put(showErrorToast(editCategoryItemsFailureToast))
    yield put({
      type: inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_CATEGORY_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchUpdateInventoryItemCategory() {
  yield takeEvery(
    inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_CATEGORY_REQUEST,
    updateInventoryItemCategorySaga
  )
}

function* updateInventoryItemSaga(payload) {
  try {
    const res = yield call(Api.updateInventoryItem, payload)
    yield put({
      type: inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_SUCCESS,
      payload: res,
    })
  } catch (error) {
    yield put({
      type: inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchUpdateInventoryItem() {
  yield takeEvery(
    inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_REQUEST,
    updateInventoryItemSaga
  )
}

function* updateInventoryItemUnitConditionSaga({payload}) {
  try {
    const res = yield call(Api.updateInventoryItemUnitCondition, payload)
    if (res.status) {
      yield put({
        type: inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_UNIT_CONDITION_SUCCESS,
        payload: res,
      })
      yield put(showSuccessToast(updateUnitConditionSuccessToast))
      yield put({
        type: inventoryOverviewActionTypes.FETCH_ALL_ITEMS_REQUEST,
        payload: payload.payload,
      })
      yield put({
        type: inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_REQUEST,
      })
    } else {
      yield put(showErrorToast(updateUnitConditionFailureToast))
    }
  } catch (error) {
    yield put(showErrorToast(updateUnitConditionFailureToast))
    yield put({
      type: inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_UNIT_CONDITION_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchUpdateInventoryItemUnitCondition() {
  yield takeEvery(
    inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_UNIT_CONDITION_REQUEST,
    updateInventoryItemUnitConditionSaga
  )
}

function* allocateItemsManuallySaga(payload) {
  try {
    const res = yield call(Api.allocateItemsManually, {
      type: payload.type,
      payload: payload.payload.allocationDetails,
    })
    if (res.status) {
      yield put({
        type: inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_REQUEST,
      })
      if (
        payload.payload.allocationDetails.allocate_to_type === 'UNALLOCATED'
      ) {
        yield put(showSuccessToast(allocationRemovedSuccessToast))
      } else {
        yield put(showSuccessToast(allocationSuccessToast))
      }
      yield put({
        type: inventoryOverviewActionTypes.FETCH_ALL_ITEMS_REQUEST,
        payload: payload.payload.payload,
      })
      yield put({
        type: inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_REQUEST,
      })
      yield put({
        type: inventoryOverviewActionTypes.ALLOCATE_ITEMS_MANUALLY_SUCCESS,
        payload: res,
      })
      yield put({
        type: inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_REQUEST,
      })
    } else {
      yield put(showErrorToast(allocationFailureToast))
    }
  } catch (error) {
    yield put(showErrorToast(allocationFailureToast))
    yield put({
      type: inventoryOverviewActionTypes.ALLOCATE_ITEMS_MANUALLY_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchAllocateItemsManually() {
  yield takeEvery(
    inventoryOverviewActionTypes.ALLOCATE_ITEMS_MANUALLY_REQUEST,
    allocateItemsManuallySaga
  )
}

function* allocateItemsAutomaticallySaga(payload) {
  try {
    const res = yield call(Api.allocateItemsAutomatically, {
      type: payload.type,
      payload: payload.payload.allocationDetails,
    })
    if (res.status) {
      yield put({
        type: inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_REQUEST,
      })
      yield put(showSuccessToast(allocationSuccessToast))
      yield put({
        type: inventoryOverviewActionTypes.FETCH_ALL_ITEMS_REQUEST,
        payload: payload.payload.payload,
      })
      yield put({
        type: inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_REQUEST,
      })
      yield put({
        type: inventoryOverviewActionTypes.ALLOCATE_ITEMS_AUTOMATICALLY_SUCCESS,
        payload: res,
      })
      yield put({
        type: inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_REQUEST,
      })
    } else {
      yield put(showErrorToast(allocationFailureToast))
    }
  } catch (error) {
    yield put(showErrorToast(allocationFailureToast))
    yield put({
      type: inventoryOverviewActionTypes.ALLOCATE_ITEMS_AUTOMATICALLY_FAILURE,
      payload: {loading: false, error: error},
    })
  }
}

export function* watchAllocateItemsAutomatically() {
  yield takeEvery(
    inventoryOverviewActionTypes.ALLOCATE_ITEMS_AUTOMATICALLY_REQUEST,
    allocateItemsAutomaticallySaga
  )
}

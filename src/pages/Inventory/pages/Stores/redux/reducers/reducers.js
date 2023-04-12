// Reducer with initial state
import {inventoryStoreActionTypes} from '../actions/actionsTypes'
import {createTransducer} from '../../../../../../redux/helpers'

const INITIAL_STATE = {
  addItemStoreLoading: false,
  addItemStoreError: false,
  addItemStoreData: {},
  deleteItemStoreLoading: false,
  deleteItemStoreError: false,
  deleteItemStoreData: {},
  selectedStoreItems: {},
  storeItemsLoading: false,
  storeItemsError: false,
  storeItemsData: {},
  updateStoreLoading: false,
  updateStoreError: false,
  updateStoreData: {},
}

const addInventoryItemStoreRequestReducer = (state) => {
  return {
    ...state,
    addItemStoreLoading: true,
  }
}

const addInventoryItemStoreErrorReducer = (state, action) => {
  return {
    ...state,
    addItemStoreLoading: false,
    addItemStoreError: true,
    addItemStoreData: action.payload.error,
  }
}

const addInventoryItemStoreSuccessReducer = (state, action) => {
  return {
    ...state,
    addItemStoreLoading: false,
    addItemStoreError: false,
    addItemStoreData: action.payload,
  }
}

const deleteInventoryItemStoreRequestReducer = (state) => {
  return {
    ...state,
    deleteItemStoreLoading: true,
  }
}

const deleteInventoryItemStoreErrorReducer = (state, action) => {
  return {
    ...state,
    deleteItemStoreLoading: false,
    deleteItemStoreError: true,
    deleteItemStoreData: action.payload,
  }
}

const deleteInventoryItemStoreSuccessReducer = (state, action) => {
  return {
    ...state,
    deleteItemStoreLoading: false,
    deleteItemStoreError: false,
    deleteItemStoreData: action.payload,
  }
}

const fetchInventoryStoreItemsRequestReducer = (state) => {
  return {
    ...state,
  }
}

const fetchInventoryStoreItemsErrorReducer = (state) => {
  return {
    ...state,
  }
}

const fetchInventoryStoreItemsSuccessReducer = (state, action) => {
  return {
    ...state,
    selectedStoreItems: action.payload.obj,
  }
}

const getInventoryStoreListRequestReducer = (state) => {
  return {
    ...state,
    storeItemsLoading: true,
  }
}

const getInventoryStoreListErrorReducer = (state) => {
  return {
    ...state,
    storeItemsLoading: false,
    storeItemsError: true,
  }
}

const getInventoryStoreListSuccessReducer = (state, action) => {
  return {
    ...state,
    storeItemsLoading: false,
    storeItemsError: false,
    storeItemsData: action.payload,
    updateStoreData: false,
    addItemStoreData: false,
  }
}

const searchInventoryItemStoreRequestReducer = (state) => {
  return {
    ...state,
  }
}

const searchInventoryItemStoreErrorReducer = (state) => {
  return {
    ...state,
  }
}

const searchInventoryItemStoreSuccessReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryItemStoreRequestReducer = (state) => {
  return {
    ...state,
    updateStoreLoading: true,
  }
}

const updateInventoryItemStoreErrorReducer = (state, action) => {
  return {
    ...state,
    updateStoreLoading: false,
    updateStoreError: true,
    updateStoreData: action.payload.error,
  }
}

const updateInventoryItemStoreSuccessReducer = (state, action) => {
  return {
    ...state,
    updateStoreLoading: false,
    updateStoreError: false,
    updateStoreData: action.payload,
  }
}

const inventoryStoresReducer = {
  [inventoryStoreActionTypes.ADD_INVENTORY_ITEM_STORE_REQUEST]:
    addInventoryItemStoreRequestReducer,
  [inventoryStoreActionTypes.ADD_INVENTORY_ITEM_STORE_FAILURE]:
    addInventoryItemStoreErrorReducer,
  [inventoryStoreActionTypes.ADD_INVENTORY_ITEM_STORE_SUCCESS]:
    addInventoryItemStoreSuccessReducer,
  [inventoryStoreActionTypes.UPDATE_INVENTORY_ITEM_STORE_REQUEST]:
    updateInventoryItemStoreRequestReducer,
  [inventoryStoreActionTypes.UPDATE_INVENTORY_ITEM_STORE_FAILURE]:
    updateInventoryItemStoreErrorReducer,
  [inventoryStoreActionTypes.UPDATE_INVENTORY_ITEM_STORE_SUCCESS]:
    updateInventoryItemStoreSuccessReducer,
  [inventoryStoreActionTypes.SEARCH_INVENTORY_ITEM_STORE_REQUEST]:
    searchInventoryItemStoreRequestReducer,
  [inventoryStoreActionTypes.SEARCH_INVENTORY_ITEM_STORE_FAILURE]:
    searchInventoryItemStoreErrorReducer,
  [inventoryStoreActionTypes.SEARCH_INVENTORY_ITEM_STORE_SUCCESS]:
    searchInventoryItemStoreSuccessReducer,
  [inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_REQUEST]:
    getInventoryStoreListRequestReducer,
  [inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_FAILURE]:
    getInventoryStoreListErrorReducer,
  [inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_SUCCESS]:
    getInventoryStoreListSuccessReducer,
  [inventoryStoreActionTypes.DELETE_INVENTORY_ITEM_STORE_REQUEST]:
    deleteInventoryItemStoreRequestReducer,
  [inventoryStoreActionTypes.DELETE_INVENTORY_ITEM_STORE_FAILURE]:
    deleteInventoryItemStoreErrorReducer,
  [inventoryStoreActionTypes.DELETE_INVENTORY_ITEM_STORE_SUCCESS]:
    deleteInventoryItemStoreSuccessReducer,
  [inventoryStoreActionTypes.FETCH_INVENTORY_STORE_ITEMS_REQUEST]:
    fetchInventoryStoreItemsRequestReducer,
  [inventoryStoreActionTypes.FETCH_INVENTORY_STORE_ITEMS_SUCCESS]:
    fetchInventoryStoreItemsSuccessReducer,
  [inventoryStoreActionTypes.FETCH_INVENTORY_STORE_ITEMS_FAILURE]:
    fetchInventoryStoreItemsErrorReducer,
}

export default createTransducer(inventoryStoresReducer, INITIAL_STATE)

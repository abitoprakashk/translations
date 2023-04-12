import {inventoryStoreActionTypes} from './actionsTypes'

export const addInventoryItemStoreAction = (payload) => {
  return {
    type: inventoryStoreActionTypes.ADD_INVENTORY_ITEM_STORE_REQUEST,
    payload: payload,
  }
}

export const deleteInventoryItemStoreAction = (payload) => {
  return {
    type: inventoryStoreActionTypes.DELETE_INVENTORY_ITEM_STORE_REQUEST,
    payload: payload,
  }
}

export const fetchInventoryStoreItemsAction = (payload) => {
  return {
    type: inventoryStoreActionTypes.FETCH_INVENTORY_STORE_ITEMS_REQUEST,
    payload: payload,
  }
}

export const getInventoryStoreListAction = () => {
  return {
    type: inventoryStoreActionTypes.GET_INVENTORY_STORE_LIST_REQUEST,
  }
}

export const searchInventoryItemStoreAction = (payload) => {
  return {
    type: inventoryStoreActionTypes.SEARCH_INVENTORY_ITEM_STORE_REQUEST,
    payload: payload,
  }
}

export const updateInventoryItemStoreAction = (payload) => {
  return {
    type: inventoryStoreActionTypes.UPDATE_INVENTORY_ITEM_STORE_REQUEST,
    payload: payload,
  }
}

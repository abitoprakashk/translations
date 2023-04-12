import {inventoryPurchaseOrderActionTypes} from './actionsTypes'

export const AddInventoryPurchaseOrderAction = (payload) => {
  return {
    type: inventoryPurchaseOrderActionTypes.ADD_INVENTORY_PURCHASE_ORDER_REQUEST,
    payload: payload,
  }
}
export const deletePurchaseOrderAction = (payload) => {
  return {
    type: inventoryPurchaseOrderActionTypes.DELETE_PURCHASE_ORDER_REQUEST,
    payload: payload,
  }
}

export const getPurchaseOrderListAction = (payload) => {
  return {
    type: inventoryPurchaseOrderActionTypes.GET_PURCHASE_ORDER_LIST_REQUEST,
    payload: payload,
  }
}

export const SearchInventoryPurchaseOrderVendorAction = (payload) => {
  return {
    type: inventoryPurchaseOrderActionTypes.SEARCH_INVENTORY_PURCHASE_ORDER_VENDOR_REQUEST,
    payload: payload,
  }
}

export const UpdateInventoryPurchaseOrderAction = (payload) => {
  return {
    type: inventoryPurchaseOrderActionTypes.UPDATE_INVENTORY_PURCHASE_ORDER_REQUEST,
    payload: payload,
  }
}

export const setPurchaseOrderErrorFalse = () => {
  return {
    type: inventoryPurchaseOrderActionTypes.SET_P_O_ERROR_FALSE,
  }
}

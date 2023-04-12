// Reducer with initial state
import {inventoryPurchaseOrderActionTypes} from '../actions/actionsTypes'
import {createTransducer} from '../../../../../../redux/helpers'

const INITIAL_STATE = {
  addInventoryPurchaseOrderLoading: false,
  addInventoryPurchaseOrderError: false,
  addInventoryPurchaseOrderData: {},
  deletePurchaseOrderLoading: false,
  deletePurchaseOrderError: false,
  purchaseOrdersListLoading: false,
  purchaseOrdersListError: false,
  purchaseOrdersListData: {},
  updatePurchaseOrderLoading: false,
  updatePurchaseOrderError: false,
  updatePurchaseOrderData: {},
}

const addInventoryPurchaseOrderRequestReducer = (state) => {
  return {
    ...state,
    addInventoryPurchaseOrderLoading: true,
  }
}

const addInventoryPurchaseOrderErrorReducer = (state) => {
  return {
    ...state,
    addInventoryPurchaseOrderLoading: false,
    addInventoryPurchaseOrderError: true,
  }
}

const addInventoryPurchaseOrderSuccessReducer = (state, action) => {
  return {
    ...state,
    addInventoryPurchaseOrderLoading: false,
    addInventoryPurchaseOrderError: false,
    addInventoryPurchaseOrderData: action.data,
  }
}

const deletePurchaseOrderRequestReducer = (state) => {
  return {
    ...state,
    deletePurchaseOrderLoading: true,
  }
}

const deletePurchaseOrderErrorReducer = (state, action) => {
  return {
    ...state,
    deletePurchaseOrderLoading: false,
    deletePurchaseOrderError: true,
    deletePurchaseOrderData: action.payload.error,
  }
}

const deletePurchaseOrderSuccessReducer = (state, action) => {
  return {
    ...state,
    deletePurchaseOrderLoading: false,
    deletePurchaseOrderError: false,
    deletePurchaseOrderData: action.payload,
  }
}

const getPurchaseOrderListRequestReducer = (state) => {
  return {
    ...state,
    purchaseOrdersListLoading: true,
    purchaseOrdersListError: false,
  }
}

const getPurchaseOrderListErrorReducer = (state) => {
  return {
    ...state,
    purchaseOrdersListLoading: false,
    purchaseOrdersListError: true,
  }
}

const getPurchaseOrderListSuccessReducer = (state, action) => {
  return {
    ...state,
    purchaseOrdersListLoading: false,
    purchaseOrdersListError: false,
    purchaseOrdersListData: action.payload,
    deletePurchaseOrderData: false,
  }
}

const searchInventoryPurchaseOrderVendorRequestReducer = (state) => {
  return {
    ...state,
  }
}

const searchInventoryPurchaseOrderVendorErrorReducer = (state) => {
  return {
    ...state,
  }
}

const searchInventoryPurchaseOrderVendorSuccessReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryPurchaseOrderRequestReducer = (state) => {
  return {
    ...state,
    updatePurchaseOrderLoading: true,
  }
}

const updateInventoryPurchaseOrderErrorReducer = (state) => {
  return {
    ...state,
    updatePurchaseOrderLoading: false,
    updatePurchaseOrderError: true,
  }
}

const updateInventoryPurchaseOrderSuccessReducer = (state, action) => {
  return {
    ...state,
    updatePurchaseOrderLoading: false,
    updatePurchaseOrderError: false,
    updatePurchaseOrderData: action.data,
  }
}

const setPurchaseOrderErrorFalse = (state) => {
  return {
    ...state,
    deletePurchaseOrderError: false,
  }
}

const inventoryPurchaseOrderReducer = {
  [inventoryPurchaseOrderActionTypes.ADD_INVENTORY_PURCHASE_ORDER_REQUEST]:
    addInventoryPurchaseOrderRequestReducer,
  [inventoryPurchaseOrderActionTypes.ADD_INVENTORY_PURCHASE_ORDER_FAILURE]:
    addInventoryPurchaseOrderErrorReducer,
  [inventoryPurchaseOrderActionTypes.ADD_INVENTORY_PURCHASE_ORDER_SUCCESS]:
    addInventoryPurchaseOrderSuccessReducer,
  [inventoryPurchaseOrderActionTypes.DELETE_PURCHASE_ORDER_REQUEST]:
    deletePurchaseOrderRequestReducer,
  [inventoryPurchaseOrderActionTypes.DELETE_PURCHASE_ORDER_SUCCESS]:
    deletePurchaseOrderSuccessReducer,
  [inventoryPurchaseOrderActionTypes.DELETE_PURCHASE_ORDER_FAILURE]:
    deletePurchaseOrderErrorReducer,
  [inventoryPurchaseOrderActionTypes.GET_PURCHASE_ORDER_LIST_REQUEST]:
    getPurchaseOrderListRequestReducer,
  [inventoryPurchaseOrderActionTypes.GET_PURCHASE_ORDER_LIST_SUCCESS]:
    getPurchaseOrderListSuccessReducer,
  [inventoryPurchaseOrderActionTypes.GET_PURCHASE_ORDER_LIST_FAILURE]:
    getPurchaseOrderListErrorReducer,
  [inventoryPurchaseOrderActionTypes.SEARCH_INVENTORY_PURCHASE_ORDER_VENDOR_REQUEST]:
    searchInventoryPurchaseOrderVendorRequestReducer,
  [inventoryPurchaseOrderActionTypes.SEARCH_INVENTORY_PURCHASE_ORDER_VENDOR_FAILURE]:
    searchInventoryPurchaseOrderVendorErrorReducer,
  [inventoryPurchaseOrderActionTypes.SEARCH_INVENTORY_PURCHASE_ORDER_VENDOR_SUCCESS]:
    searchInventoryPurchaseOrderVendorSuccessReducer,
  [inventoryPurchaseOrderActionTypes.UPDATE_INVENTORY_PURCHASE_ORDER_REQUEST]:
    updateInventoryPurchaseOrderRequestReducer,
  [inventoryPurchaseOrderActionTypes.UPDATE_INVENTORY_PURCHASE_ORDER_FAILURE]:
    updateInventoryPurchaseOrderErrorReducer,
  [inventoryPurchaseOrderActionTypes.UPDATE_INVENTORY_PURCHASE_ORDER_SUCCESS]:
    updateInventoryPurchaseOrderSuccessReducer,
  [inventoryPurchaseOrderActionTypes.SET_P_O_ERROR_FALSE]:
    setPurchaseOrderErrorFalse,
}

export default createTransducer(inventoryPurchaseOrderReducer, INITIAL_STATE)

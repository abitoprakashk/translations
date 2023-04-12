import inventoryOverviewActionTypes from './actionsTypes'

export const getAggregateDataRequestedAction = () => {
  return {
    type: inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_REQUEST,
  }
}

export const getAllCategoriesRequestAction = () => {
  return {
    type: inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_REQUEST,
  }
}

export const getAllItemsListRequestAction = (payload = {}) => {
  return {
    type: inventoryOverviewActionTypes.FETCH_ALL_ITEMS_REQUEST,
    payload,
  }
}

export const getSingleItemByIDAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.FETCH_SINGLE_ITEM_BY_ID_REQUEST,
    payload,
  }
}

export const getAllItemsBySearchTextAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.FETCH_ALL_ITEM_BY_SEARCHTEXT_REQUEST,
    payload,
  }
}

export const checkItemNameAvailabilityAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.CHECK_ITEM_NAME_AVAILABILITY_REQUEST,
    payload: payload,
  }
}

export const checkCategoryNameAvailabilityAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.CHECK_CATEGORY_NAME_AVAILABILITY_REQUEST,
    payload: payload,
  }
}

export const createPrefixAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.CREATE_PREFIX_REQUEST,
    payload: payload,
  }
}

export const addInventoryItemAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.ADD_INVENTORY_ITEM_REQUEST,
    payload: payload,
  }
}

export const searchInventoryCategoryAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.SEARCH_INVENTORY_CATEGORY_REQUEST,
    payload: payload,
  }
}

export const searchInventoryItemAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.SEARCH_INVENTORY_ITEM_REQUEST,
    payload: payload,
  }
}

export const deleteInventoryItemCategoryAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_CATEGORY_REQUEST,
    payload: payload,
  }
}

export const deleteInventoryItemAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_REQUEST,
    payload: payload,
  }
}

export const updateInventoryItemCategoryAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_CATEGORY_REQUEST,
    payload: payload,
  }
}

export const updateInventoryItemAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_REQUEST,
    payload: payload,
  }
}

export const updateInventoryItemUnitConditionAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_UNIT_CONDITION_REQUEST,
    payload,
  }
}

export const allocateItemsManuallyAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.ALLOCATE_ITEMS_MANUALLY_REQUEST,
    payload: payload,
  }
}

export const allocateItemsAutomaticallyAction = (payload) => {
  return {
    type: inventoryOverviewActionTypes.ALLOCATE_ITEMS_AUTOMATICALLY_REQUEST,
    payload: payload,
  }
}

export const emptyBlackListAction = () => {
  return {
    type: inventoryOverviewActionTypes.EMPTY_BLACKLIST,
  }
}

export const setPage = (payload) => {
  return {
    type: inventoryOverviewActionTypes.SET_PAGE,
    payload: payload,
  }
}

export const setCurrentPageReference = (payload) => {
  return {
    type: inventoryOverviewActionTypes.SET_CURRENT_PAGE_REFERENCE,
    payload: payload,
  }
}

export const setApiFilterData = (payload) => {
  return {
    type: inventoryOverviewActionTypes.SET_API_FILTER_DATA,
    payload: payload,
  }
}

export const setSelectedFilters = (payload) => {
  return {
    type: inventoryOverviewActionTypes.SET_SELECTED_FILTERS,
    payload: payload,
  }
}

export const setPossibleAllocationIds = (payload) => {
  return {
    type: inventoryOverviewActionTypes.SET_POSSIBLE_ALLOCATION_IDS,
    payload: payload,
  }
}

export const setSearchText = (payload) => {
  return {
    type: inventoryOverviewActionTypes.SET_SEARCH_TEXT,
    payload: payload,
  }
}

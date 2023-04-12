// Reducer with initial state
import inventoryOverviewActionTypes from '../actions/actionsTypes'
import {createTransducer} from '../../../../../../redux/helpers'

const INITIAL_STATE = {
  aggregateDataLoading: false,
  aggregateDataLError: false,
  aggregateData: {},
  allCategoriesLoading: false,
  allCategoriesError: false,
  allCategories: {},
  allItemsLoading: false,
  allItemsError: false,
  allItems: {},
  categoryNameAvailabilityStatus: '',
  itemNameAvailabilityStatus: '',
  prefixBlacklist: [],
  addInventoryItemloading: false,
  addInventoryItemError: false,
  addInventoryItemData: {},
  possibleAllocatedIds: [],
}

const getAggregateDataRequestedReducer = (state) => {
  return {
    ...state,
    aggregateDataLoading: true,
    aggregateDataLError: false,
  }
}

const getAggregateDataSuccessReducer = (state, action) => {
  return {
    ...state,
    aggregateDataLoading: false,
    aggregateDataLError: false,
    aggregateData: action.payload,
  }
}

const getAggregateDataErrorReducer = (state) => {
  return {
    ...state,
    aggregateDataLoading: false,
    aggregateDataLError: true,
  }
}

const getAllCategoriesRequestedReducer = (state) => {
  return {
    ...state,
    allCategoriesLoading: true,
    allCategoriesError: false,
  }
}

const getAllCategoriesSuccessReducer = (state, action) => {
  return {
    ...state,
    allCategoriesLoading: false,
    allCategoriesError: false,
    allCategories: action.payload,
  }
}

const getAllCategoriesErrorReducer = (state) => {
  return {
    ...state,
    allCategoriesLoading: false,
    allCategoriesError: true,
  }
}

const getAllItemsRequestedReducer = (state) => {
  return {
    ...state,
    allItemsLoading: true,
    allItemsError: false,
  }
}

const getAllItemsSuccessReducer = (state, action) => {
  return {
    ...state,
    allItemsLoading: false,
    allItemsError: false,
    allItems: action.payload,
  }
}

const getAllItemsErrorReducer = (state) => {
  return {
    ...state,
    allItemsLoading: false,
    allItemsError: true,
  }
}

const getAllItemsBySearchTextRequestedReducer = (state) => {
  return {
    ...state,
    allItemsLoading: true,
    allItemsError: false,
  }
}

const getAllItemsBySearchTextSuccessReducer = (state, action) => {
  return {
    ...state,
    allItemsLoading: false,
    allItemsError: false,
    allItems: action.payload,
  }
}

const getAllItemsBySearchTextErrorReducer = (state) => {
  return {
    ...state,
    allItemsLoading: false,
    allItemsError: true,
  }
}

const checkCategoryNameAvailabilityRequestedReducer = (state) => {
  return {
    ...state,
  }
}

const checkCategoryNameAvailabilitySuccessReducer = (state, action) => {
  return {
    ...state,
    categoryNameAvailabilityStatus: action.payload,
  }
}

const checkCategoryNameAvailabilityErrorReducer = (state, action) => {
  return {
    ...state,
    categoryNameAvailabilityStatus: action.payload,
  }
}

const checkItemNameAvailabilityRequestedReducer = (state) => {
  return {
    ...state,
  }
}

const checkItemNameAvailabilitySuccessReducer = (state, action) => {
  return {
    ...state,
    itemNameAvailabilityStatus: action.payload,
  }
}

const checkItemNameAvailabilityErrorReducer = (state, action) => {
  return {
    ...state,
    itemNameAvailabilityStatus: action.payload,
  }
}

const createPrefixRequestedReducer = (state) => {
  return {
    ...state,
  }
}

const createPrefixSuccessReducer = (state, action) => {
  return {
    ...state,
    prefixBlacklist: [...state.prefixBlacklist, action.payload.obj],
  }
}

const createPrefixErrorReducer = (state, action) => {
  return {
    ...state,
    prefixBlacklist: [...state.prefixBlacklist, action.payload],
  }
}
const addInventoryItemRequestedReducer = (state) => {
  return {
    ...state,
    addInventoryItemloading: true,
    addInventoryItemError: false,
  }
}
const addInventoryItemSuccessReducer = (state, action) => {
  return {
    ...state,
    addInventoryItemloading: false,
    addInventoryItemError: false,
    addInventoryItemData: action.payload,
  }
}
const addInventoryItemErrorReducer = (state) => {
  return {
    ...state,
    addInventoryItemloading: false,
    addInventoryItemError: true,
  }
}

const searchInventoryCategoryRequestReducer = (state) => {
  return {
    ...state,
  }
}

const searchInventoryCategoryErrorReducer = (state) => {
  return {
    ...state,
  }
}

const searchInventoryCategorySuccessReducer = (state) => {
  return {
    ...state,
  }
}

const searchInventoryItemRequestReducer = (state) => {
  return {
    ...state,
  }
}

const searchInventoryItemErrorReducer = (state) => {
  return {
    ...state,
  }
}

const searchInventoryItemSuccessReducer = (state) => {
  return {
    ...state,
  }
}

const deleteInventoryItemCategoryRequestReducer = (state) => {
  return {
    ...state,
  }
}

const deleteInventoryItemCategoryErrorReducer = (state) => {
  return {
    ...state,
  }
}

const deleteInventoryItemCategorySuccessReducer = (state) => {
  return {
    ...state,
  }
}

const deleteInventoryItemRequestReducer = (state) => {
  return {
    ...state,
  }
}

const deleteInventoryItemErrorReducer = (state) => {
  return {
    ...state,
  }
}

const deleteInventoryItemSuccessReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryItemCategoryRequestReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryItemCategoryErrorReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryItemCategorySuccessReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryItemRequestReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryItemErrorReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryItemSuccessReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryItemUnitConditionRequestReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryItemUnitConditionErrorReducer = (state) => {
  return {
    ...state,
  }
}

const updateInventoryItemUnitConditionSuccessReducer = (state) => {
  return {
    ...state,
  }
}

const getSingleItemByIDRequestReducer = (state) => {
  return {
    ...state,
    selectedItemTypeUnitListLoading: true,
  }
}

const getSingleItemByIDErrorReducer = (state) => {
  return {
    ...state,
    selectedItemTypeUnitListLoading: false,
    selectedItemTypeUnitListError: true,
  }
}

const getSingleItemByIDSuccessReducer = (state, action) => {
  return {
    ...state,
    selectedItemTypeUnitListData: action.payload.obj,
    selectedItemTypeUnitListLoading: false,
    selectedItemTypeUnitListError: false,
  }
}

const allocateItemsManuallyRequestReducer = (state) => {
  return {
    ...state,
    allocateItemsLoading: true,
  }
}

const allocateItemsManuallyErrorReducer = (state) => {
  return {
    ...state,
    allocateItemsLoading: false,
    allocateItemsError: true,
  }
}

const allocateItemsManuallySuccessReducer = (state, action) => {
  return {
    ...state,
    allocateItemsData: action.payload,
    allocateItemsLoading: false,
    allocateItemsError: false,
  }
}

const allocateItemsAutomaticallyRequestReducer = (state) => {
  return {
    ...state,
    allocateItemsLoading: true,
  }
}

const allocateItemsAutomaticallyErrorReducer = (state) => {
  return {
    ...state,
    allocateItemsLoading: false,
    allocateItemsError: true,
  }
}

const allocateItemsAutomaticallySuccessReducer = (state, action) => {
  return {
    ...state,
    allocateItemsData: action.payload,
    allocateItemsLoading: false,
    allocateItemsError: false,
  }
}

const emptyBlackListReducer = (state) => {
  return {
    ...state,
    prefixBlacklist: [],
  }
}

const setPage = (state, action) => {
  return {...state, pageNumber: action.payload}
}

const setCurrentPageReferenceReducer = (state, action) => {
  return {...state, currentPageReference: action.payload}
}

const setApiFilterDataReducer = (state, action) => {
  return {...state, apiFilterData: action.payload}
}

const setSelectedFiltersReducer = (state, action) => {
  return {...state, selectedFilters: action.payload}
}

const setPossibleAllocationIdsReducer = (state, action) => {
  return {...state, possibleAllocatedIds: action.payload}
}

const setSearchTextReducer = (state, action) => {
  return {...state, searchText: action.payload}
}

const inventoryOverviewReducer = {
  [inventoryOverviewActionTypes.FETCH_SINGLE_ITEM_BY_ID_REQUEST]:
    getSingleItemByIDRequestReducer,
  [inventoryOverviewActionTypes.FETCH_SINGLE_ITEM_BY_ID_FAILURE]:
    getSingleItemByIDErrorReducer,
  [inventoryOverviewActionTypes.FETCH_SINGLE_ITEM_BY_ID_SUCCESS]:
    getSingleItemByIDSuccessReducer,
  [inventoryOverviewActionTypes.FETCH_ALL_ITEM_BY_SEARCHTEXT_REQUEST]:
    getAllItemsBySearchTextRequestedReducer,
  [inventoryOverviewActionTypes.FETCH_ALL_ITEM_BY_SEARCHTEXT_FAILURE]:
    getAllItemsBySearchTextErrorReducer,
  [inventoryOverviewActionTypes.FETCH_ALL_ITEM_BY_SEARCHTEXT_SUCCESS]:
    getAllItemsBySearchTextSuccessReducer,
  [inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_REQUEST]:
    getAggregateDataRequestedReducer,
  [inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_SUCCESS]:
    getAggregateDataSuccessReducer,
  [inventoryOverviewActionTypes.FETCH_AGGREGATED_DATA_FAILURE]:
    getAggregateDataErrorReducer,
  [inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_REQUEST]:
    getAllCategoriesRequestedReducer,
  [inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_SUCCESS]:
    getAllCategoriesSuccessReducer,
  [inventoryOverviewActionTypes.FETCH_ALL_CATEGORIES_FAILURE]:
    getAllCategoriesErrorReducer,
  [inventoryOverviewActionTypes.CHECK_CATEGORY_NAME_AVAILABILITY_REQUEST]:
    checkCategoryNameAvailabilityRequestedReducer,
  [inventoryOverviewActionTypes.CHECK_CATEGORY_NAME_AVAILABILITY_SUCCESS]:
    checkCategoryNameAvailabilitySuccessReducer,
  [inventoryOverviewActionTypes.CHECK_CATEGORY_NAME_AVAILABILITY_FAILURE]:
    checkCategoryNameAvailabilityErrorReducer,
  [inventoryOverviewActionTypes.CHECK_ITEM_NAME_AVAILABILITY_REQUEST]:
    checkItemNameAvailabilityRequestedReducer,
  [inventoryOverviewActionTypes.CHECK_ITEM_NAME_AVAILABILITY_SUCCESS]:
    checkItemNameAvailabilitySuccessReducer,
  [inventoryOverviewActionTypes.CHECK_ITEM_NAME_AVAILABILITY_FAILURE]:
    checkItemNameAvailabilityErrorReducer,
  [inventoryOverviewActionTypes.CREATE_PREFIX_REQUEST]:
    createPrefixRequestedReducer,
  [inventoryOverviewActionTypes.CREATE_PREFIX_SUCCESS]:
    createPrefixSuccessReducer,
  [inventoryOverviewActionTypes.CREATE_PREFIX_FAILURE]:
    createPrefixErrorReducer,
  [inventoryOverviewActionTypes.ADD_INVENTORY_ITEM_REQUEST]:
    addInventoryItemRequestedReducer,
  [inventoryOverviewActionTypes.ADD_INVENTORY_ITEM_SUCCESS]:
    addInventoryItemSuccessReducer,
  [inventoryOverviewActionTypes.ADD_INVENTORY_ITEM_FAILURE]:
    addInventoryItemErrorReducer,
  [inventoryOverviewActionTypes.SEARCH_INVENTORY_CATEGORY_REQUEST]:
    searchInventoryCategoryRequestReducer,
  [inventoryOverviewActionTypes.SEARCH_INVENTORY_CATEGORY_FAILURE]:
    searchInventoryCategoryErrorReducer,
  [inventoryOverviewActionTypes.SEARCH_INVENTORY_CATEGORY_SUCCESS]:
    searchInventoryCategorySuccessReducer,
  [inventoryOverviewActionTypes.SEARCH_INVENTORY_ITEM_REQUEST]:
    searchInventoryItemRequestReducer,
  [inventoryOverviewActionTypes.SEARCH_INVENTORY_ITEM_FAILURE]:
    searchInventoryItemErrorReducer,
  [inventoryOverviewActionTypes.SEARCH_INVENTORY_ITEM_SUCCESS]:
    searchInventoryItemSuccessReducer,
  [inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_CATEGORY_REQUEST]:
    deleteInventoryItemCategoryRequestReducer,
  [inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_CATEGORY_FAILURE]:
    deleteInventoryItemCategoryErrorReducer,
  [inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_CATEGORY_SUCCESS]:
    deleteInventoryItemCategorySuccessReducer,
  [inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_REQUEST]:
    deleteInventoryItemRequestReducer,
  [inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_FAILURE]:
    deleteInventoryItemErrorReducer,
  [inventoryOverviewActionTypes.DELETE_INVENTORY_ITEM_SUCCESS]:
    deleteInventoryItemSuccessReducer,
  [inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_CATEGORY_REQUEST]:
    updateInventoryItemCategoryRequestReducer,
  [inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_CATEGORY_FAILURE]:
    updateInventoryItemCategoryErrorReducer,
  [inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_CATEGORY_SUCCESS]:
    updateInventoryItemCategorySuccessReducer,
  [inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_REQUEST]:
    updateInventoryItemRequestReducer,
  [inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_FAILURE]:
    updateInventoryItemErrorReducer,
  [inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_SUCCESS]:
    updateInventoryItemSuccessReducer,
  [inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_UNIT_CONDITION_REQUEST]:
    updateInventoryItemUnitConditionRequestReducer,
  [inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_UNIT_CONDITION_FAILURE]:
    updateInventoryItemUnitConditionErrorReducer,
  [inventoryOverviewActionTypes.UPDATE_INVENTORY_ITEM_UNIT_CONDITION_SUCCESS]:
    updateInventoryItemUnitConditionSuccessReducer,
  [inventoryOverviewActionTypes.FETCH_ALL_ITEMS_REQUEST]:
    getAllItemsRequestedReducer,
  [inventoryOverviewActionTypes.FETCH_ALL_ITEMS_SUCCESS]:
    getAllItemsSuccessReducer,
  [inventoryOverviewActionTypes.FETCH_ALL_ITEMS_FAILURE]:
    getAllItemsErrorReducer,
  [inventoryOverviewActionTypes.ALLOCATE_ITEMS_MANUALLY_REQUEST]:
    allocateItemsManuallyRequestReducer,
  [inventoryOverviewActionTypes.ALLOCATE_ITEMS_MANUALLY_SUCCESS]:
    allocateItemsManuallySuccessReducer,
  [inventoryOverviewActionTypes.ALLOCATE_ITEMS_MANUALLY_FAILURE]:
    allocateItemsManuallyErrorReducer,
  [inventoryOverviewActionTypes.ALLOCATE_ITEMS_AUTOMATICALLY_REQUEST]:
    allocateItemsAutomaticallyRequestReducer,
  [inventoryOverviewActionTypes.ALLOCATE_ITEMS_AUTOMATICALLY_SUCCESS]:
    allocateItemsAutomaticallySuccessReducer,
  [inventoryOverviewActionTypes.ALLOCATE_ITEMS_AUTOMATICALLY_FAILURE]:
    allocateItemsAutomaticallyErrorReducer,
  [inventoryOverviewActionTypes.EMPTY_BLACKLIST]: emptyBlackListReducer,
  [inventoryOverviewActionTypes.SET_PAGE]: setPage,
  [inventoryOverviewActionTypes.SET_API_FILTER_DATA]: setApiFilterDataReducer,
  [inventoryOverviewActionTypes.SET_CURRENT_PAGE_REFERENCE]:
    setCurrentPageReferenceReducer,
  [inventoryOverviewActionTypes.SET_SELECTED_FILTERS]:
    setSelectedFiltersReducer,
  [inventoryOverviewActionTypes.SET_POSSIBLE_ALLOCATION_IDS]:
    setPossibleAllocationIdsReducer,
  [inventoryOverviewActionTypes.SET_SEARCH_TEXT]: setSearchTextReducer,
}

export default createTransducer(inventoryOverviewReducer, INITIAL_STATE)

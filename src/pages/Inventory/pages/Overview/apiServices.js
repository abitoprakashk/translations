import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'
import {compareStrings} from '../Categories/components/CategoriesPage'

const URL = REACT_APP_API_URL

export const getAggregates = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${URL}inventory/aggregates`,
    })
    return res.data
  } catch (error) {
    return {error}
  }
}

export const getAllCategories = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${URL}inventory-item-category/list`,
    })
    let data = res.data
    data?.obj.forEach((item) => {
      item?.item_list
        ? item.item_list.sort((a, b) => compareStrings(a.name, b.name))
        : item?.item_list
    })
    data?.obj.sort((a, b) => compareStrings(a.name, b.name))
    return data
  } catch (error) {
    return {error}
  }
}

export const getAllItemsList = async (payload = {}) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-unit/list`,
      data: payload?.payload,
    })
    return res.data
  } catch (error) {
    return {error}
  }
}

export const getSingleItemByID = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-unit/list`,
      data: {
        filters: {
          item_id: [payload.payload.item_id],
          allocated_to_type: payload.payload.allocated_to_type,
          condition: payload.payload.condition,
        },
        limit: payload.payload.limit,
        paginate: payload.payload.paginate,
      },
    })
    return res.data
  } catch (error) {
    return {error}
  }
}

export const getAllItemsBySearchText = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-unit/list`,
      data: {
        search_text: payload.payload,
      },
    })
    return res.data
  } catch (error) {
    return {error}
  }
}

export const checkCategoryNameAvailability = async (
  payload = {category_name: ''}
) => {
  try {
    if (payload.category_name != '') {
      const res = await axios({
        method: 'POST',
        url: `${URL}inventory-item-category/check-name-availability`,
        data: payload.payload,
      })
      return res.data
    }
  } catch (error) {
    return {error: error}
  }
}

export const checkItemNameAvailability = async (payload = {item_name: ''}) => {
  try {
    if (payload.item_name != '') {
      const res = await axios({
        method: 'POST',
        url: `${URL}inventory-item/check-name-availability`,
        data: payload.payload,
      })
      return res.data
    }
  } catch (error) {
    return {error: error}
  }
}

export const createPrefix = async (
  payload = {
    item_name: '',
    prefix_blacklist: [],
  }
) => {
  try {
    if (payload.item_name != '') {
      const res = await axios({
        method: 'POST',
        url: `${URL}inventory-item/create-prefix`,
        data: payload.payload,
      })
      return res.data
    }
  } catch (error) {
    return {error: error}
  }
}

export const addInventoryItem = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item/add`,
      data: {data: payload.payload},
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const searchInventoryCategory = async (payload = {search_text: ''}) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-category/search`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const searchInventoryItem = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item/search`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const deleteInventoryItemCategory = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-category/delete`,
      data: {_id: payload.payload},
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const deleteInventoryItem = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item/delete`,
      data: payload.payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const updateInventoryItemCategory = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-category/edit`,
      data: payload.payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const updateInventoryItem = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item/edit`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const updateInventoryItemUnitCondition = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-unit/update/condition`,
      data: payload.condition,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const addInventoryItemStore = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-store/add`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const updateInventoryItemStore = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-store/edit`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const searchInventoryItemStore = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-store/search`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const getInventoryStoreList = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${URL}inventory-item-store/list`,
    })
    return res.data
  } catch (error) {
    return {error}
  }
}

export const deleteInventoryItemStore = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-store/delete`,
      data: {_id: payload.payload},
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const fetchInventoryStoreItems = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-store/allocated-item-list`,
      data: {_id: payload.payload},
    })
    let data = res.data
    data?.obj.sort((a, b) => compareStrings(a.name, b.name))

    return data
  } catch (error) {
    return {error: error}
  }
}

export const getPurchaseOrderList = async (payload = {}) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-purchase-order/list`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error}
  }
}

export const addInventoryPurchaseOrder = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-purchase-order/add`,
      data: payload.payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const updateInventoryPurchaseOrder = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-purchase-order/edit`,
      data: payload.payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const searchInventoryPurchaseOrderVendor = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-purchase-order/search/vendor`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const deletePurchaseOrder = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-purchase-order/delete`,
      data: {_id: payload.payload},
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const allocateItemsManually = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item/allocate/manual`,
      data: payload.payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const allocateItemsAutomatically = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item/allocate/automatic`,
      data: payload.payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const studentWiseItemsList = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${URL}inventory-item-unit/user-items`,
      data: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

export const studentWiseBooksList = async (payload) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${URL}book/list-associated`,
      params: payload,
    })
    return res.data
  } catch (error) {
    return {error: error}
  }
}

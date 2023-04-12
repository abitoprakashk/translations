import {Trans} from 'react-i18next'

const good = <Trans i18nKey={'good'}>Good</Trans>
const expired = <Trans i18nKey={'expired'}>Expired</Trans>
const consumed = <Trans i18nKey={'consumed'}>Consumed</Trans>
const lost = <Trans i18nKey={'lost'}>Lost</Trans>
const damaged = <Trans i18nKey={'damaged'}>Damaged</Trans>
const categoryName = <Trans i18nKey={'categoryName'}>Category name</Trans>
const noOfItems = <Trans i18nKey={'noOfItems'}>No. of items</Trans>
const noOfUnits = <Trans i18nKey={'noOfUnits'}>No. of units</Trans>
const itemsAllocated = <Trans i18nKey={'itemsAllocated'}>Item Allocated</Trans>
const totalStockPrice = (
  <Trans i18nKey={'totalStockPrice'}>Total Stock Price</Trans>
)
const edit = <Trans i18nKey={'edit'}>Edit</Trans>
const deleteText = <Trans i18nKey={'delete'}>Delete</Trans>
const availableToAllocate = (
  <Trans i18nKey={'availableToAllocate'}>available to allocate</Trans>
)
const items = <Trans i18nKey={'items'}>Items</Trans>
const category = <Trans i18nKey={'category'}>Category</Trans>
const storeName = <Trans i18nKey={'storeName'}>Room name</Trans>
const allocatedTo = <Trans i18nKey={'allocatedTo'}>Allocated To</Trans>
const description = <Trans i18nKey={'description'}>Description</Trans>
const itemCode = <Trans i18nKey={'itemCode'}>Item Code</Trans>
const condition = <Trans i18nKey={'condition'}>Condition</Trans>
const quantity = <Trans i18nKey={'quantity'}>Quantity</Trans>
const item = <Trans i18nKey={'item'}>Item</Trans>
const unitPrice = <Trans i18nKey={'unitPrice'}>Unit Price</Trans>
const totalPrice = <Trans i18nKey={'totalPrice'}>Total Price</Trans>

export const CONST_CATEGORY_PARENT_TABLE_COLUMNS = [
  {key: 'category', label: category},
]

export const CONST_CATEGORY_CHILD_TABLE_COLUMNS = [
  {key: 'item', label: items},
  {key: 'available', label: availableToAllocate},
  {key: 'itemCount', label: noOfUnits},
  {key: 'price', label: totalStockPrice},
  {key: 'allocation', label: ''},
]

export const CONST_CATEGORY_CHILD_TABLE_MAPPINGS = {
  id: '_id',
  item: 'name',
  available: 'total_available',
  itemCount: 'total_quantity',
  price: 'total_worth',
}

export const PAGE_LIMIT = 10

export const CONST_HEADER_TYPES = {
  NORMAL: 'normal',
  CUSTOM: 'custom',
}

export const CONST_OVERVIEW_ITEMS_HEADERS = [
  {key: 'itemCode', label: itemCode},
  {key: 'items', label: items},
  {key: 'category', label: category},
  {key: 'condition', label: condition},
  {key: 'allocatedTo', label: allocatedTo},
  {key: 'allocationStatus', label: ' '},
]

export const CONST_ITEM_TABLE_MAPPINGS = {
  id: '_id',
  items: 'item_name',
  itemCode: 'unit_code',
  category: 'category_name',
  condition: 'condition',
  allocatedTo: 'allocated_to_type',
  allocationStatus: '',
}

export const CONST_STORE_COLUMN_HEADERS = [
  {key: 'storeName', label: storeName},
  {key: 'description', label: description},
  {key: 'itemCount', label: noOfItems},
  {key: 'unitCount', label: noOfUnits},
  {key: 'edit', label: ''},
  {key: 'delete', label: ''},
]

export const CONST_STORE_COLUMN_MAPPING = {
  id: '_id',
  description: 'description',
  storeName: 'name',
  unitCount: 'item_unit_count',
  itemCount: 'item_count',
}

export const CONST_ITEM_CONDITION = {
  CONSUMED: 'CONSUMED',
  DAMAGED: 'DAMAGED',
  EXPIRED: 'EXPIRED',
  GOOD: 'GOOD',
  LOST: 'LOST',
}

export const CONST_ITEM_CONDITION_LIST = [
  {value: 'GOOD', label: good},
  {
    value: 'DAMAGED',
    label: damaged,
  },
  {
    value: 'LOST',
    label: lost,
  },
  {
    value: 'EXPIRED',
    label: expired,
  },
  {
    value: 'CONSUMED',
    label: consumed,
  },
]

export const CONST_ITEM_ALLOCATION_STATUS = {
  UNALLOCATED: 'UNALLOCATED',
  INDIVIDUAL: 'INDIVIDUAL',
  STORE: 'STORE',
}

export const ALLOCATION_EVENT_MAP = {
  INDIVIDUAL: 'individual',
  STORE: 'item_room',
}

export const CONST_CATEGORIES_ITEMS_HEADERS = [
  {key: 'categoryName', label: categoryName},
  {key: 'itemsCount', label: noOfItems},
  {key: 'unitCount', label: noOfUnits},
  {key: 'allocationCount', label: itemsAllocated},
  {key: 'worth', label: totalStockPrice},
  {key: 'edit', label: edit},
  {key: 'delete', label: deleteText},
]

export const CONST_CATEGORIES_ITEMS_TABLE_MAPPINGS = {
  id: '_id',
  categoryName: 'name',
  itemsCount: 'item_count',
  unitCount: 'total_quantity',
  allocationCount: 'total_allocated',
  worth: 'total_worth',
}

export const CONST_PURCHASE_ORDERS_ITEM_TABLE_HEADERS = [
  {key: '', label: ''},
  {key: 'category', label: category},
  {key: 'item', label: item},
  {key: 'quantity', label: quantity},
  {key: 'price', label: unitPrice},
  {key: 'totalPrice', label: totalPrice},
]

export const CONST_INPUTS_MAX_LENGTH = {
  name: '50',
  description: '200',
  number: '50',
  price: '9',
}

export const CONST_ALLOCATION_METHOD = {
  MANUAL: 'MANUAL',
  AUTOMATIC: 'AUTOMATIC',
}

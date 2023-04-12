import {Table} from '@teachmint/common'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './categories.module.css'
import {compareStrings} from './CategoriesPage'
import {Button} from '@teachmint/common'
import {useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import {v4 as uuidv4} from 'uuid'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export default function ShowItemDetailsSlider({
  selectedRowData,
  setEditSliderOpen,
  setSliderOpen,
  setEditCategoryData,
  setScrollToBottom,
}) {
  const [tableRows, setTableRows] = useState([])
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)

  useEffect(() => {
    createTableRows(selectedRowData?.item_list)
  }, [])

  const CONST_COLUMN_HEADERS = [
    {key: 'items', label: `${selectedRowData.item_count} Items`},
    {key: 'units', label: `${selectedRowData.total_quantity} Units`},
  ]

  const CONST_COLUMN_HEADERS_MAPPING = {
    id: '_id',
    items: 'name',
    units: 'total_quantity',
  }

  const createTableRows = (items = []) => {
    let allRows = []
    items?.forEach((item) => {
      let newRow = {}
      for (let key in CONST_COLUMN_HEADERS_MAPPING) {
        newRow[key] = item[CONST_COLUMN_HEADERS_MAPPING[key]]
      }
      allRows.push(newRow)
    })

    allRows?.sort((a, b) => compareStrings(a.items, b.items))

    setTableRows(allRows)
  }
  const HandleEditClick = () => {
    setScrollToBottom(true)
    setSliderOpen(false)
    handleEdit(selectedRowData)
    setEditSliderOpen(true)
    eventManager.send_event(events.IM_EDIT_CATEGORY_TAB_CLICKED_TFI, {
      category_name: selectedRowData?.name,
    })
  }

  const handleEdit = (data) => {
    let itemsData = {}
    data.item_list.forEach((item) => {
      let itemData = {
        name: item.name,
        stock: item.opening_stock,
        price: item.opening_price,
        prefix: item.prefix,
        totalAllocated: item.total_allocated,
      }
      itemsData[item._id] = itemData
    })
    itemsData = {
      ...itemsData,
      [uuidv4()]: {
        name: '',
        prefix: '',
        stock: '',
        price: '',
        hasError: true,
      },
    }
    let catData = {name: data.name, accordionOpen: true, items: itemsData}
    let payload = {[data._id]: catData}
    setEditCategoryData(payload)
  }

  return (
    <div>
      <header className={styles.sliderHeading}>{selectedRowData.name}</header>
      <div className={styles.categoryDetailedItems}>
        <Table cols={CONST_COLUMN_HEADERS} rows={tableRows}></Table>
      </div>
      <div className={styles.doneButtonWrapper}>
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.inventoryItemCategoryController_edit_update
          }
        >
          <div className={styles.doneButtonWrapper}>
            <Button
              className={styles.doneButton}
              type="border"
              size="big"
              onClick={HandleEditClick}
            >
              {t('addMoreItems')}
            </Button>
          </div>
        </Permission>
      </div>
    </div>
  )
}

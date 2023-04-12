import {Table} from '@teachmint/common'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './store.module.css'
import {fetchInventoryStoreItemsAction} from '../redux/actions/actions'

export default function ShowItemDetailsSlider(props) {
  const dispatch = useDispatch()
  const [tableRows, setTableRows] = useState([])
  const inventoryStoresState = useSelector((state) => state.inventoryStores)

  useEffect(() => {
    dispatch(fetchInventoryStoreItemsAction(props._id))
  }, [])

  useEffect(() => {
    if (inventoryStoresState?.selectedStoreItems?.length > 0) {
      createTableRows(inventoryStoresState.selectedStoreItems)
    }
  }, [inventoryStoresState.selectedStoreItems])

  const CONST_COLUMN_HEADERS = [
    {key: 'items', label: `${props.item_count} Items`},
    {key: 'units', label: `${props.item_unit_count} Units`},
  ]

  const CONST_COLUMN_HEADERS_MAPPING = {
    id: '_id',
    items: 'name',
    units: 'quantity',
  }

  const createTableRows = (items = []) => {
    let allRows = []
    items?.map((item) => {
      let newRow = {}
      for (let key in CONST_COLUMN_HEADERS_MAPPING) {
        newRow[key] = item[CONST_COLUMN_HEADERS_MAPPING[key]]
      }
      allRows.push(newRow)
    })
    setTableRows(allRows)
  }

  return (
    <div>
      <header className={styles.sliderHeading}>{props.name}</header>
      <div className={styles.storeDetailedItems}>
        <Table cols={CONST_COLUMN_HEADERS} rows={tableRows}></Table>
      </div>
    </div>
  )
}

import styles from './itemForm.module.css'
import {Button} from '@teachmint/common'
import {ItemCard} from '../ItemCard/ItemCard'
import {useTranslation} from 'react-i18next'
import {v4 as uuidv4} from 'uuid'
import {useState} from 'react'
import {events} from '../../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'

export function ItemForm({
  itemsData,
  onItemsDataChange,
  checkUniqueItemName,
  handleprefix,
  screenName,
}) {
  const {t} = useTranslation()

  const [itemInputErrors, setItemInputErrors] = useState({})
  const {eventManager} = useSelector((state) => state)

  const addItem = () => {
    const itemKey = uuidv4()
    const itemData = {
      name: '',
      prefix: '',
      stock: '',
      price: '',
      hasError: true,
    }
    onItemsDataChange({...itemsData, [itemKey]: itemData}, true)
    setItemInputErrors({...itemInputErrors, [itemKey]: true})
  }

  const removeItem = (itemId) => {
    let newItemsData = {...itemsData}
    delete newItemsData[itemId]
    let tempErrors = {...itemInputErrors}
    delete tempErrors[itemId]
    let hasError = Object.keys(tempErrors).length > 0
    onItemsDataChange(newItemsData, hasError)
    setItemInputErrors(tempErrors)
  }

  const onItemDataChange = (itemData, itemHasError, itemId) => {
    let tempErrors = {...itemInputErrors}
    if (itemHasError) {
      tempErrors = {...tempErrors, [itemId]: true}
    } else {
      delete tempErrors[itemId]
    }
    let hasError = Object.keys(tempErrors).length > 0
    onItemsDataChange({...itemsData, [itemId]: itemData}, hasError)
    setItemInputErrors(tempErrors)
  }

  return (
    <div className={styles.itemForm}>
      <hr></hr>
      {Object.keys(itemsData).map((id, index) => (
        <ItemCard
          _id={id}
          isEdit={id.length == 36 ? false : true}
          key={id}
          index={index + 1}
          itemData={itemsData[id]}
          removable={Object.keys(itemsData).length > 1 ? true : false}
          onRemoveItem={() => removeItem(id)}
          onItemDataChange={(itemData, hasError) =>
            onItemDataChange(itemData, hasError, id)
          }
          checkUniqueItemName={(itemName) => {
            return checkUniqueItemName(itemName, id)
          }}
          handleprefix={(itemName) => handleprefix(itemName, id)}
        />
      ))}
      <div className={styles.addItemButtonWrapper}>
        <Button
          className={styles.addItemButton}
          onClick={() => {
            addItem()
            eventManager.send_event(events.IM_ADD_MORE_ITEMS_CLICKED_TFI, {
              screen_name: screenName,
            })
          }}
          type="secondary"
        >
          {t('addMoreItems')}
        </Button>
      </div>
    </div>
  )
}

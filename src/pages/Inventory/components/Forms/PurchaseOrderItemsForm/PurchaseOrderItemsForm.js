import {useTranslation} from 'react-i18next'
import styles from './purchaseOrderItemsForm.module.css'
import {PurchaseOrderItemCard} from '../PurchaseOrderItemCard/PurchaseOrderItemCard'
import {v4 as uuidv4} from 'uuid'
import {Button} from '@teachmint/common'
import {useState} from 'react'

export function PurchaseOrderItemsForm({items, onItemsChange, isEdit}) {
  const {t} = useTranslation()

  const [itemInputErrors, setItemInputErrors] = useState({})

  const addItem = () => {
    const itemKey = uuidv4()
    const itemData = {categoryName: '', itemName: '', quantity: '', price: ''}
    let newItems = {...items, [itemKey]: itemData}
    onItemsChange(newItems, true)
  }

  const removeItem = (itemId) => {
    let newItems = {...items}
    delete newItems[itemId]
    let newInputErrors = {...itemInputErrors}
    delete newInputErrors[itemId]
    const hasError = Object.keys(newInputErrors).length > 0
    onItemsChange(newItems, hasError)
    setItemInputErrors(newInputErrors)
  }

  const onItemDataChange = (itemData, itemHasError, itemId) => {
    let newItems = {...items}
    newItems[itemId] = itemData
    let newInputErrors = {...itemInputErrors}
    if (!itemHasError) {
      delete newInputErrors[itemId]
    } else {
      newInputErrors = {...newInputErrors, [itemId]: itemId}
    }
    let hasError = Object.keys(newInputErrors).length > 0
    onItemsChange(newItems, hasError)
    setItemInputErrors(newInputErrors)
  }
  const checkItemNameExists = (val, itemId) => {
    for (const key in items) {
      if (items[key].itemName == val && key != itemId) {
        return true
      }
    }
    return false
  }

  return (
    <div className={styles.itemsFormWrapper}>
      <div>{t('addItems')}</div>
      <div className={styles.itemsWrapper}>
        {Object.keys(items).map((id) => {
          return (
            <PurchaseOrderItemCard
              isEdit={isEdit}
              key={id}
              itemData={items[id]}
              onItemDataChange={(itemData, hasError) => {
                onItemDataChange(itemData, hasError, id)
              }}
              onRemoveItem={() => {
                removeItem(id)
              }}
              removable={
                isEdit ? false : Object.keys(items).length > 1 ? true : false
              }
              checkItemNameExists={(val) => checkItemNameExists(val, id)}
            />
          )
        })}
        {!isEdit && (
          <div className={styles.addItemsButtonWrapper}>
            <Button
              className={styles.addItemsButton}
              onClick={addItem}
              type="secondary"
            >
              {t('addMoreItems')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

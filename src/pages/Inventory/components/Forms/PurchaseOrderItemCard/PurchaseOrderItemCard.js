import {Input, Icon} from '@teachmint/common'
import {t} from 'i18next'
import {useEffect, useState} from 'react'
import styles from './purchaseOrderItemCard.module.css'
import {CONST_INPUTS_MAX_LENGTH} from '../../../../../constants/inventory.constants'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export function PurchaseOrderItemCard({
  itemData,
  onItemDataChange,
  onRemoveItem,
  removable,
  isEdit,
  checkItemNameExists,
}) {
  const inventoryState = useSelector((state) => state.inventoryOverview)
  const {instituteInfo} = useSelector((state) => state)

  const [catOptions, setCatOptions] = useState(
    isEdit ? [{label: itemData.categoryName, value: itemData.categoryName}] : []
  )
  const [itemOptions, setItemOptions] = useState(
    isEdit ? [{label: itemData.itemName, value: itemData.itemName}] : []
  )

  const dummyOption = [{label: 'None', value: 'None'}]

  const [itemNameError, setItemNameError] = useState('')

  const handleItemOptions = (catId) => {
    const category = inventoryState?.allCategories?.obj?.find((obj) => {
      return obj._id === catId
    })
    const itemList = category?.item_list
    let optionsArray = []
    itemList?.forEach((item) => {
      optionsArray.push({label: item.name, value: item._id})
    })
    setItemOptions(optionsArray)
  }

  const handleCatOptions = () => {
    const allCategoriesArray = inventoryState.allCategories.obj
    let optionsArray = []
    allCategoriesArray?.forEach((category) => {
      optionsArray.push({label: category.name, value: category._id})
    })
    setCatOptions(optionsArray)
  }

  useEffect(() => {
    if (!isEdit) {
      handleCatOptions()
    }
  }, [inventoryState.allCategories])

  const handleInitialInputError = () => {
    let hasError = false
    for (const key in itemData) {
      if (!itemData[key]) {
        hasError = true
        break
      }
    }
    onItemDataChange(itemData, hasError)
  }

  useEffect(() => {
    handleInitialInputError()
  }, [])

  const handleChange = (field, value) => {
    let hasError = !value
    for (let key in itemData) {
      if (key != field) {
        hasError = hasError || !itemData[key]
      }
    }
    if (field == 'itemName') {
      if (checkItemNameExists(value)) {
        hasError = true
        setItemNameError(t('itemAlreadySeleted'))
      } else {
        setItemNameError('')
      }
    } else {
      hasError = itemNameError ? true : hasError
    }
    onItemDataChange({...itemData, [field]: value}, hasError)
  }

  return (
    <div className={classNames(styles.itemWrapper, {[styles.isEdit]: isEdit})}>
      <Input
        classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
        type="select"
        title={t('category')}
        fieldName="categoryName"
        className={classNames(styles.dropDownInput, {
          [styles.disabledInputBackground]: isEdit,
        })}
        value={itemData.categoryName}
        disabled={isEdit}
        options={catOptions.length > 0 ? catOptions : dummyOption}
        isRequired={true}
        onChange={(e) => {
          if (e.value == 'None') return
          handleChange(e.fieldName, e.value)
          handleItemOptions(e.value)
        }}
      />
      <Input
        classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
        type="select"
        title={t('items')}
        fieldName="itemName"
        className={classNames(styles.dropDownInput, {
          [styles.disabledInputBackground]: isEdit,
        })}
        options={itemOptions.length > 0 ? itemOptions : dummyOption}
        disabled={isEdit}
        value={itemData.itemName}
        isRequired={true}
        showError={itemNameError ? true : false}
        errorMsg={itemNameError}
        onChange={(e) => {
          if (e.value == 'None') return
          handleChange(e.fieldName, e.value)
        }}
      />
      <Input
        classes={{
          wrapper: styles.inputWrapper,
          input: isEdit ? styles.disabledInputBackground : '',
          title: 'tm-para',
        }}
        type="number"
        title={t('quantity')}
        fieldName="quantity"
        maxLength={CONST_INPUTS_MAX_LENGTH.number}
        placeholder={t('numberPlaceHolder')}
        className={isEdit ? styles.disabledInputBackground : ''}
        disabled={isEdit}
        value={itemData.quantity}
        isRequired={true}
        onChange={(e) => {
          if (parseInt(e.value) > 10000 || parseInt(e.value) <= 0) {
            return
          }
          handleChange(e.fieldName, e.value)
        }}
      />
      <Input
        classes={{
          wrapper: styles.inputWrapper,
          input: isEdit ? styles.disabledInputBackground : '',
          title: 'tm-para',
        }}
        type="number"
        title="Unit Price"
        placeholder={t('numberPlaceHolder')}
        fieldName="price"
        maxLength={CONST_INPUTS_MAX_LENGTH.price}
        className={isEdit ? styles.disabledInputBackground : ''}
        prefix={getSymbolFromCurrency(
          instituteInfo.currency || DEFAULT_CURRENCY
        )}
        disabled={isEdit}
        value={itemData.price}
        isRequired={true}
        onChange={(e) => {
          handleChange(e.fieldName, e.value)
        }}
      />
      {removable && (
        <div className={styles.removeIcon} onClick={onRemoveItem}>
          <Icon color="error" name="removeCircle" type="outlined" size="xxs" />
        </div>
      )}
    </div>
  )
}

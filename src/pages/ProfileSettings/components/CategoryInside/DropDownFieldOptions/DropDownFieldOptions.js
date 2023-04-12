import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import produce from 'immer'
import {Icon, Input} from '@teachmint/common'
import {alphaNumericRegex} from '../../../../../utils/Validations'
import {
  checkSameValuesExistInObject,
  createVaildDropdownObjects,
  isExistingObjectsVaild,
} from '../CategoryInside.utils'
import styles from './DropDownFieldOptions.module.css'

const DropDownFieldOptions = ({
  setIsFormValid,
  setDropDownOptionItems,
  dropDownOptionItems,
  setFieldFormInputsValue,
  fieldFormInputsValue,
}) => {
  const {t} = useTranslation()
  const [errorDropDownObject, setErrorDropDownObject] = useState({})

  // Drop down items functions start
  const onChangeDropDownItems = (itemElement, index) => {
    setErrorDropDownObject({})
    if (!alphaNumericRegex(itemElement.value)) {
      return false
    }
    const changeDropDownItemText = [...dropDownOptionItems]
    changeDropDownItemText[index]['dropDownOptionName'] = itemElement.value
    setDropDownOptionItems(changeDropDownItemText)
    const updateDropDownItems = createVaildDropdownObjects(
      changeDropDownItemText
    )
    const isSameValuesExist = checkSameValuesExistInObject(updateDropDownItems)
    if (
      itemElement.value !== '' &&
      updateDropDownItems.length >= 2 &&
      !isSameValuesExist
    ) {
      setIsFormValid(fieldFormInputsValue.fieldName !== '')
    } else {
      setIsFormValid(false)
    }
  }
  const onClickAddDropDownItems = () => {
    const isObjectsVaild = isExistingObjectsVaild(dropDownOptionItems)
    if (isObjectsVaild) {
      const newDropDownItem = {dropDownOptionName: ''}
      const newDropDownItemsColletion = [
        ...dropDownOptionItems,
        newDropDownItem,
      ]
      setDropDownOptionItems(newDropDownItemsColletion)
    } else {
      handleCategoryInputsSetError(
        'dropDownOptionName',
        t('dropDownOptionInvaild')
      )
    }
  }
  const removeDropDownOptionHandler = (index) => {
    const dropDownItemlist = [...dropDownOptionItems]
    dropDownItemlist.splice(index, 1)
    setDropDownOptionItems(dropDownItemlist)
    const updateDropDownItems = createVaildDropdownObjects(dropDownItemlist)
    const isSameValuesExist = checkSameValuesExistInObject(updateDropDownItems)
    if (dropDownItemlist.length >= 2 && !isSameValuesExist) {
      if (fieldFormInputsValue.fieldName !== '') {
        setIsFormValid(true)
      } else {
        setIsFormValid(false)
      }
    } else {
      setIsFormValid(false)
      handleCategoryInputsSetError(
        'dropDownOptionName',
        t('dropDownOptionInvaild')
      )
    }
  }

  const handleCategoryInputsSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorDropDownObject((errorDropDownObject) => ({
      ...errorDropDownObject,
      ...obj,
    }))
  }

  const getDropDownConditionalProps = (i) => {
    let propsObject = {}
    if (
      errorDropDownObject &&
      Object.keys(errorDropDownObject).length > 0 &&
      errorDropDownObject?.dropDownOptionName !== '' &&
      dropDownOptionItems.length > 0
    ) {
      const lastElementIndex = dropDownOptionItems.length - 1
      if (lastElementIndex == i) {
        propsObject = produce(propsObject, (draft) => {
          draft.showError = true
          draft.errorMsg = errorDropDownObject?.dropDownOptionName
          return draft
        })
      }
    }
    return propsObject
  }

  useEffect(() => {
    if (dropDownOptionItems.length > 0) {
      const optionValues = createVaildDropdownObjects(dropDownOptionItems)
      setFieldFormInputsValue({
        ...fieldFormInputsValue,
        permissibleValues: optionValues.length > 0 ? optionValues : [],
      })
    }
  }, [dropDownOptionItems])
  // Drop Down Items functions end

  return (
    <div className={styles.dropDwonFieldOptionBlock}>
      <div className={styles.dropDownItemBox}>
        <div className={styles.dropDownBoxTitle}>
          {t('createDropDownOptions')}
          <span className={styles.astrik}>*</span>
          <span className={styles.limitText}>{t('charMaxLimit')}</span>
        </div>
        <div className={styles.dropDownItemRowsContainer}>
          {dropDownOptionItems.length > 0 &&
            dropDownOptionItems.map((dropDownItem, i) => {
              const uniqueKey = `dropDownItemUniqueId_${i}`
              const condinationProps = getDropDownConditionalProps(i)
              // console.log('condinationProps', condinationProps)
              return (
                <div key={uniqueKey} className={styles.dropDownItemRow}>
                  <div className={styles.dropDownItemInput}>
                    <Input
                      type="text"
                      fieldName="dropDownOptionName"
                      value={dropDownItem?.dropDownOptionName}
                      placeholder={`${t('optionLabel')} ${i + 1}`}
                      maxLength="50"
                      onChange={(e) => onChangeDropDownItems(e, i)}
                      className={styles.inputFieldClass}
                      showError={false}
                      errorMsg={''}
                      {...condinationProps}
                    />
                  </div>

                  {dropDownOptionItems.length > 2 && (
                    <div
                      className={styles.deleteItemDiv}
                      onClick={() => removeDropDownOptionHandler(i)}
                    >
                      <Icon
                        name="delete1"
                        type="filled"
                        size="m"
                        color="basic"
                      />
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>
      <div
        className={styles.addMoreDropOptionBlock}
        onClick={onClickAddDropDownItems}
      >
        {t('addMoreOptionsPlus')}
      </div>
    </div>
  )
}

export default DropDownFieldOptions

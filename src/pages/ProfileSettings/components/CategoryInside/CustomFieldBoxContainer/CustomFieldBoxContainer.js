import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {Input} from '@teachmint/common'
import {
  FIELD_TYPES,
  FIELD_TYPES_OBJECT,
} from '../../../ProfileSettings.constant'
import CustomFieldBoxCard from '../../UICommon/CustomFieldBoxCard'
import DropDownFieldOptions from '../DropDownFieldOptions/DropDownFieldOptions'
import DateRangePickerWrapper from '../DateRangePickerWrapper/DateRangePickerWrapper'
import {titleFieldRegex} from '../../../../../utils/Validations'
import {dropDownOptionItemsState} from '../AddCategoryFieldsSlider/AddCategoryFieldsSlider.utils'
import styles from './CustomFieldBoxContainer.module.css'
import {
  checkSameValuesExistInObject,
  createVaildDropdownObjects,
} from '../CategoryInside.utils'

const CustomFieldBoxContainer = ({
  setIsFormValid,
  dataResetFlag,
  fieldFormInputsValue,
  setFieldFormInputsValue,
  setErrorObject,
  errorObject,
  handleCategoryInputsSetError,
}) => {
  const {t} = useTranslation()
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [dropDownOptionItems, setDropDownOptionItems] = useState(
    dropDownOptionItemsState
  )

  const fieldTitleNameOnChangeHandler = (nameObj) => {
    let updateErrorObject = {...errorObject}
    if (!titleFieldRegex(nameObj.value)) {
      return false
    }
    setFieldFormInputsValue({
      ...fieldFormInputsValue,
      fieldName: nameObj.value,
    })
    delete updateErrorObject?.fieldName
    setErrorObject(updateErrorObject)
    if (nameObj.value !== '') {
      if (
        fieldFormInputsValue.fieldTypeName == FIELD_TYPES_OBJECT[0].value &&
        fieldFormInputsValue.charLimit > 0
      ) {
        setIsFormValid(true)
      } else if (
        fieldFormInputsValue.fieldTypeName == FIELD_TYPES_OBJECT[1].value &&
        fieldFormInputsValue.permissibleValues.length >= 2
      ) {
        const changeDropDownItemText = [...dropDownOptionItems]
        const updateDropDownItems = createVaildDropdownObjects(
          changeDropDownItemText
        )
        const isSameValuesExist =
          checkSameValuesExistInObject(updateDropDownItems)
        if (updateDropDownItems.length >= 2 && !isSameValuesExist) {
          setIsFormValid(true)
        } else {
          setIsFormValid(false)
        }
      } else if (
        fieldFormInputsValue.fieldTypeName == FIELD_TYPES_OBJECT[2].value
      ) {
        if (fieldFormInputsValue?.isDateChecked) {
          setIsFormValid(fieldFormInputsValue?.dateRange?.length == 2)
        } else {
          setIsFormValid(true)
        }
      } else {
        setIsFormValid(false)
      }
    } else {
      setIsFormValid(false)
    }
  }
  const fieldTypeOnChangeHandler = (typeObj) => {
    if (typeObj.value == FIELD_TYPES['DROPDOWN'].key) {
      setIsFormValid(false)
    } else {
      if (fieldFormInputsValue.fieldName !== '') {
        setIsFormValid(true)
      } else {
        setIsFormValid(false)
      }
    }
    setFieldFormInputsValue({
      ...fieldFormInputsValue,
      fieldTypeName: typeObj.value,
      isDateChecked: false,
      charLimit: '50',
      permissibleValues: [],
      dateRange: [],
    })
    setDropDownOptionItems([{dropDownOptionName: ''}, {dropDownOptionName: ''}])
    setStartDate(null)
    setEndDate(null)
  }

  // Character Limit OnChange function
  const charLimitOnChangeHandler = (charObj) => {
    let updateErrorObject = {...errorObject}
    delete updateErrorObject?.charLimit
    setErrorObject(updateErrorObject)
    if (charObj.value > 0) {
      if (fieldFormInputsValue.fieldName !== '') {
        setIsFormValid(true)
      }
    } else {
      setIsFormValid(false)
      handleCategoryInputsSetError('charLimit', t('charLimitInVaild'))
    }
    setFieldFormInputsValue({
      ...fieldFormInputsValue,
      charLimit: charObj.value,
    })
  }

  // Reset data handler
  useEffect(() => {
    if (dataResetFlag) {
      setDropDownOptionItems(dropDownOptionItemsState)
      setStartDate(null)
      setEndDate(null)
    }
  }, [dataResetFlag])

  return (
    <div className={styles.customFieldsBoxContainer}>
      <CustomFieldBoxCard className={styles.customFieldBoxCardClass}>
        <div className={styles.inputsFieldsBlock}>
          {/* Visible Input Fields Block */}
          <div className={styles.visibleInputFieldsBlock}>
            <div
              className={classNames(
                styles.inputGroup,
                styles.fieldNameTextBoxDiv
              )}
            >
              <Input
                type="text"
                title={t('fieldTitle')}
                fieldName="fieldName"
                value={fieldFormInputsValue?.fieldName}
                className={styles.inputFieldTitleClass}
                placeholder={t('remarks')}
                maxLength="50"
                isRequired={true}
                onChange={fieldTitleNameOnChangeHandler}
                showError={
                  Object.keys(errorObject).length > 0 &&
                  'fieldName' in errorObject
                }
                errorMsg={
                  (Object.keys(errorObject).length > 0 &&
                    errorObject?.fieldName) ||
                  ''
                }
              />
            </div>
            <div
              className={classNames(
                styles.inputGroup,
                styles.selectFieldTypeInput
              )}
            >
              <Input
                type="radio"
                title={t('selectFieldType')}
                fieldName="fieldTypeName"
                value={fieldFormInputsValue?.fieldTypeName}
                isRequired={true}
                options={FIELD_TYPES_OBJECT}
                onChange={fieldTypeOnChangeHandler}
                className={styles.inputFieldClass}
              />
            </div>
          </div>

          {/* Condition base show hide block */}
          <div className={styles.showHideInputFieldsBlock}>
            {/* Character Limit Input */}
            {fieldFormInputsValue?.fieldTypeName ==
              FIELD_TYPES_OBJECT[0].value && (
              <div
                className={classNames(
                  styles.inputGroup,
                  styles.charLimitInputGroup
                )}
              >
                <span className={styles.limitText}>
                  {t('characterMaxLimit')}
                </span>
                <Input
                  type="number"
                  title={t('setTextLimitText')}
                  fieldName="charLimit"
                  isRequired={true}
                  value={fieldFormInputsValue?.charLimit?.toString()}
                  onChange={charLimitOnChangeHandler}
                  className={styles.inputFieldClass}
                  maxLength="2"
                  showError={
                    Object.keys(errorObject).length > 0 &&
                    'charLimit' in errorObject
                  }
                  errorMsg={
                    (Object.keys(errorObject).length > 0 &&
                      errorObject?.charLimit) ||
                    ''
                  }
                />
              </div>
            )}

            {/* Drop Down Options */}
            {fieldFormInputsValue?.fieldTypeName ==
              FIELD_TYPES_OBJECT[1].value && (
              <div
                className={classNames(
                  styles.inputGroup,
                  styles.dropDownOptionsGroup
                )}
              >
                <DropDownFieldOptions
                  setIsFormValid={setIsFormValid}
                  setFieldFormInputsValue={setFieldFormInputsValue}
                  fieldFormInputsValue={fieldFormInputsValue}
                  setDropDownOptionItems={setDropDownOptionItems}
                  dropDownOptionItems={dropDownOptionItems}
                />
              </div>
            )}

            {/* Date Range Checkbox Group */}
            {fieldFormInputsValue?.fieldTypeName ==
              FIELD_TYPES_OBJECT[2].value && (
              <div
                className={classNames(
                  styles.inputGroup,
                  styles.dateRangeCheckboxGroup
                )}
              >
                <DateRangePickerWrapper
                  setIsFormValid={setIsFormValid}
                  fieldFormInputsValue={fieldFormInputsValue}
                  setFieldFormInputsValue={setFieldFormInputsValue}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                />
              </div>
            )}
          </div>
        </div>
      </CustomFieldBoxCard>
    </div>
  )
}

export default CustomFieldBoxContainer

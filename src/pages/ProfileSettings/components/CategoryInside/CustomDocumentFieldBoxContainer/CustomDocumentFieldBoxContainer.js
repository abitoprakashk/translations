import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {Input} from '@teachmint/common'
import {FORMAT_OPTIONS} from '../../../ProfileSettings.constant'
import CustomFieldBoxCard from '../../UICommon/CustomFieldBoxCard'
import {titleFieldRegex} from '../../../../../utils/Validations'
import styles from './CustomDocumentFieldBoxContainer.module.css'

const CustomDocumentFieldBoxContainer = ({
  setIsFormValid,
  dataResetFlag,
  fieldFormInputsValue,
  setFieldFormInputsValue,
}) => {
  const {t} = useTranslation()

  const [selectedOptions, setSelectedOptions] = useState([])

  const fieldTitleNameOnChangeHandler = (nameObj) => {
    if (!titleFieldRegex(nameObj.value)) {
      return false
    }
    setFieldFormInputsValue({
      ...fieldFormInputsValue,
      fieldName: nameObj.value,
    })
    if (nameObj.value !== '') {
      setIsFormValid(fieldFormInputsValue.permissibleValues.length > 0)
    } else {
      setIsFormValid(false)
    }
  }

  const optionsLogic = (item) => {
    let newOptions = selectedOptions
    let changeValue = item.value
    if (selectedOptions.includes(changeValue)) {
      if (changeValue === 'jpeg') {
        newOptions.splice(newOptions.indexOf(changeValue), 1)
        newOptions.splice(newOptions.indexOf('jpg'), 1)
      } else {
        newOptions.splice(newOptions.indexOf(changeValue), 1)
      }
    } else {
      if (changeValue === 'jpeg') {
        newOptions.push(changeValue, 'jpg')
      } else {
        newOptions.push(changeValue)
      }
    }
    // console.log('newOptions1111', newOptions)
    permissibleValueOnChangeHandler(newOptions)
  }

  const permissibleValueOnChangeHandler = (e) => {
    setSelectedOptions(e)
    setFieldFormInputsValue({
      ...fieldFormInputsValue,
      permissibleValues: e,
    })
    if (e.length > 0) {
      setIsFormValid(fieldFormInputsValue.fieldName !== '')
    } else {
      setIsFormValid(false)
    }
  }

  // Reset data handler
  useEffect(() => {
    if (dataResetFlag) {
      return true
    }
  }, [dataResetFlag])

  const docTypesCheckbox = (options) => {
    return options.map((item, i) => {
      return (
        <div key={`${item.label}_${i}`} className={styles.checkBoxInputGroup}>
          <Input
            id={item.label}
            type="checkbox"
            fieldName={item.label}
            labelTxt={item.label}
            className={styles.inputComponent}
            isChecked={selectedOptions.includes(item.value)}
            onChange={() => {
              optionsLogic(item)
            }}
          />
        </div>
      )
    })
  }

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
                title={t('documentName')}
                placeholder={t('aadharCard')}
                fieldName="fieldName"
                value={fieldFormInputsValue?.fieldName}
                isRequired={true}
                onChange={fieldTitleNameOnChangeHandler}
                className={styles.inputFieldTitleClass}
                maxLength="50"
              />
            </div>
            <div
              className={classNames(
                styles.inputGroup,
                styles.formatSelectedInput
              )}
            >
              <div className={styles.formatTitle}>
                {t('selectAFormatForTheDocumentYouWantToAdd')}
                <span className={styles.astrik}>*</span>
              </div>
              <div className={styles.doctypesCheckbox}>
                {docTypesCheckbox(FORMAT_OPTIONS)}
              </div>
            </div>
          </div>
        </div>
      </CustomFieldBoxCard>
    </div>
  )
}

export default CustomDocumentFieldBoxContainer

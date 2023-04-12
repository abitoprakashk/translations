import React, {useEffect, useState, useCallback} from 'react'
import {useTranslation} from 'react-i18next'
import {Input} from '@teachmint/common'
import {FIELD_TYPES} from '../../../../ProfileSettings/ProfileSettings.constant'
import {
  getConditionalProps,
  getUserLabel,
} from './CategoryFieldsLoadingContainer.utils'
import {checkDuplicates} from './../../../UserProfile.utils'
import {debounce, getRoleName} from '../../../../../utils/Helpers'
import DuplicateUserCard from '../../../../../components/SchoolSystem/StudentDirectory/DuplicateUserCard'
import styles from './DynamicInputFieldsHTML.module.css'
import {useSelector} from 'react-redux'

const DynamicInputFieldsHTML = ({
  item,
  isAdd,
  fieldsHandleChange,
  fieldValue,
  inputOptionsValue,
  handleValidationError,
  userList,
  openViewProfile,
  editFieldValue = null,
  roleLabelIdMap,
  userType,
}) => {
  let inputFieldHTML = ''
  const {t} = useTranslation()
  const {instituteInfo, countryList} = useSelector((state) => state)
  const [error, setError] = useState('')
  const [countryCode, setCountryCode] = useState('91')
  const [duplicates, setDuplicates] = useState(null)

  useEffect(() => {
    if (item.fieldType === FIELD_TYPES.PHONE_NUMBER.key) {
      if (fieldValue) {
        const phnSplit = fieldValue.split('-')
        if (phnSplit.length === 2) setCountryCode(phnSplit[0])
      } else {
        const isdCode = countryList?.find(
          (item) => item?.country === instituteInfo?.address?.country
        )?.isd_code
        if (isdCode) setCountryCode(isdCode)
      }
    }
  }, [item, fieldValue])

  const debounceCheck = useCallback(
    debounce((...args) => {
      let dup = checkDuplicates(...args)
      setDuplicates(dup)
      if (dup.length) {
        setError(`${t('duplicateEntriesFound')}`)
      }
    }, 50),
    []
  )

  const handleOnClickOfProfile = (...args) => {
    openViewProfile(...args)
    setDuplicates(null)
  }

  const handleCountryCodeChange = (obj, item) => {
    setCountryCode(obj.value)
    obj.fieldName = `${item.keyId}_${obj.fieldName}`
    fieldsHandleChange({obj, item})
  }

  const handleOnChange = (obj, item) => {
    fieldsHandleChange({obj, item})
    switch (item.keyId) {
      case 'phone_number':
        if (obj.value.length === 10) {
          setDuplicates(
            checkDuplicates(userList, item.keyId, `${countryCode}-${obj.value}`)
          )
        }
        break
      case 'enrollment_number':
        debounceCheck(userList, item.keyId, obj.value)
        break
      case 'employee_id':
        debounceCheck(userList, item.keyId, obj.value)
        break
    }
    if (item?.fieldType === FIELD_TYPES.PHONE_NUMBER.key) {
      obj.value = obj.value !== '' ? `${countryCode}-${obj.value}` : ''
      fieldsHandleChange({obj, item})
    }
  }

  const errorPersists = () => {
    setError(`${error} `)
  }

  const handleOnBlur = (event, obj) => {
    let regex = new RegExp(obj.pattern)
    let val = event?.target?.value

    if (item.fieldType === FIELD_TYPES.PHONE_NUMBER.key) {
      val = val !== '' ? `${countryCode}-${val}` : ''
    }

    let match = regex.test(val)
    if (!match) {
      if (error) {
        errorPersists()
      } else {
        setError(`${t('invalid')} ${obj.label}`)
      }
    } else {
      if (duplicates?.length) {
        errorPersists()
        return
      }
      setError('')
    }
  }

  const getValue = () => {
    if (fieldValue && fieldValue !== '') {
      if (item.fieldType === FIELD_TYPES.PHONE_NUMBER.key) {
        const phnSplit = fieldValue.split('-')
        if (phnSplit.length === 2) {
          return phnSplit[1]
        }
      }
      if (item.fieldType === FIELD_TYPES.DATE.key) {
        if (Number.isInteger(fieldValue) && fieldValue.toString().length >= 8) {
          return new Date(fieldValue * 1000)
        }
      }
      if (!isAdd && roleLabelIdMap?.length > 0 && item.keyId === 'roles') {
        const roleName = getRoleName(roleLabelIdMap, fieldValue)
        return roleName !== '' ? roleName : fieldValue
      }
    }
    return fieldValue
  }

  if (item.fieldType) {
    const condinationProps = getConditionalProps({
      item,
      isAdd,
      editFieldValue,
      userType,
    })
    inputFieldHTML = (
      <div className={styles.fieldWrapper}>
        <Input
          type={FIELD_TYPES[item.fieldType].type}
          title={item.label}
          fieldName={item.keyId}
          className={styles.dynamicFieldInputClass}
          value={getValue()}
          isRequired={item.isValueMandatory}
          options={inputOptionsValue}
          instituteId={item.instituteId}
          countryCodeItem={countryCode}
          onCountryCodeChange={(obj) => handleCountryCodeChange(obj, item)}
          onChange={(obj) => handleOnChange(obj, item)}
          onBlur={(e) => handleOnBlur(e, item)}
          showError={error?.length}
          errorMsg={error}
          setShowError={(val) => handleValidationError(val, item.keyId)}
          maxLength={item?.charLimit || '50'}
          {...condinationProps}
        />
        {duplicates?.length ? (
          <DuplicateUserCard
            items={duplicates}
            handleUpdateProfile={handleOnClickOfProfile}
            handleCreateNewProfile={() => {
              setDuplicates(null)
              setError('')
            }}
            hideCreateNew={item.fieldType === FIELD_TYPES.ENROLLMENT_ID.key}
            userType={getUserLabel(userType)}
          />
        ) : null}
      </div>
    )
  }
  return inputFieldHTML
}

export default DynamicInputFieldsHTML

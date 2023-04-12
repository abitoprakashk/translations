import React from 'react'
import {Input} from '@teachmint/common'
import styles from './ParentInfo.module.css'
import {parentInfoFields} from './../inputFields'
import {useTranslation} from 'react-i18next'
import {useCountryCode} from '../../../../../../redux/reducers/CommonSelectors'

const ParentInfo = ({
  parentInfo = {},
  setParentInfo,
  setHasEdited,
  setShowError,
  disableInputs,
}) => {
  const {t} = useTranslation()
  const instituteCountryCode = useCountryCode()
  const handleChange = ({fieldName, value, parentFieldName}) => {
    if (parentFieldName != fieldName && parentFieldName != undefined) {
      const obj = {
        fatherContactNumber: 'fatherContactNumberCountryCode',
        guardianNumber: 'guardianNumberCountryCode',
        motherContactNumber: 'motherContactNumberCountryCode',
      }
      setParentInfo({
        ...parentInfo,
        [obj[parentFieldName]]: value,
        [parentFieldName]: '',
      })
    } else {
      setParentInfo({...parentInfo, [fieldName]: value})
      setHasEdited(true)
    }
  }
  const renderfields = () => {
    return parentInfoFields.map((field) => (
      <div key={field.fieldName} className={styles[`item-${field.fieldName}`]}>
        {field.fieldType === 'phoneNumber' ? (
          <Input
            type={field.fieldType}
            title={t(field.title)}
            fieldName={field.fieldName}
            value={parentInfo[field.fieldName]}
            countryCodeItem={
              parentInfo[field.countryCode] || instituteCountryCode
            }
            setShowError={(val) => setShowError(val, field.fieldName)}
            // showError={false}
            onChange={(obj) =>
              handleChange({...obj, parentFieldName: field.fieldName})
            }
            disabled={disableInputs}
            classes={{title: 'tm-para'}}
          />
        ) : (
          <Input
            type={field.fieldType}
            title={t(field.title)}
            classes={{title: 'tm-para'}}
            fieldName={field.fieldName}
            value={parentInfo[field.fieldName]}
            countryCodeItem={
              parentInfo[field.countryCode] || instituteCountryCode
            }
            // setShowError={(val) => handleError(val, 'phone')}
            onChange={handleChange}
            disabled={disableInputs}
          />
        )}
      </div>
    ))
  }

  return <div className={styles.wrapper}>{renderfields()}</div>
}

export default ParentInfo

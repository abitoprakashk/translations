import React from 'react'
import {Input} from '@teachmint/common'
import {FIELD_TYPES} from '../../../ProfileSettings.constant'
import {getConditionalProps} from './CategoryFieldsPreivewContainer.utils'
import styles from './DynamicInputFieldsPreviewHTML.module.css'

const DynamicInputFieldsPreviewHTML = ({item, inputOptionsValue}) => {
  let inputFieldHTML = ''
  if (item.fieldType) {
    const condinationProps = getConditionalProps({
      item,
    })
    inputFieldHTML = (
      <div className={styles.fieldWrapper}>
        <Input
          type={FIELD_TYPES[item.fieldType].type}
          title={item.label}
          fieldName={item.keyId}
          value={''}
          isRequired={item.isValueMandatory}
          options={inputOptionsValue}
          instituteId={item.instituteId}
          countryCodeItem={'91'}
          {...condinationProps}
        />
      </div>
    )
  }
  return inputFieldHTML
}

export default DynamicInputFieldsPreviewHTML

import React from 'react'
import {Input} from '@teachmint/common'
import styles from './Demographics.module.css'
import {demographicsFields} from './../inputFields'

const Demographics = ({
  demographics = {},
  setDemographics,
  setHasEdited,
  disableInputs,
}) => {
  const handleChange = ({fieldName, value}) => {
    setDemographics({...demographics, [fieldName]: value})
    setHasEdited(true)
  }

  const renderfields = () => {
    return demographicsFields.map((field) => (
      <div key={field.fieldName} className={styles[`item-${field.fieldName}`]}>
        <Input
          type={field.fieldType}
          title={field.title}
          fieldName={field.fieldName}
          value={demographics[field.fieldName]}
          options={field.dropdownItems}
          onChange={handleChange}
          disabled={disableInputs}
          classes={{title: 'tm-para'}}
        />
      </div>
    ))
  }

  return <div className={styles.wrapper}>{renderfields()}</div>
}

export default Demographics

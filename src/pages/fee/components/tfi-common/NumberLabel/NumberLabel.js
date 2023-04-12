import classNames from 'classnames'
import React from 'react'
import styles from './NumberLabel.module.css'

export default function NumberLabel({
  number = '0',
  label = '',
  numberClassName = '',
  labelClassName = '',
  isRequired = false,
}) {
  return (
    <div className={styles.section}>
      <span className={classNames(styles.sectionNumber, numberClassName)}>
        {number}
      </span>
      <div className={classNames(styles.sectionLabel, labelClassName)}>
        <span>{label}</span>
        {isRequired && <span className={styles.required}>*</span>}
      </div>
    </div>
  )
}

import React from 'react'
import classNames from 'classnames'
import styles from './InputWithLabel.module.css'
import {Input} from '@teachmint/common'

export default function InputWithLabel({
  wrapperClassName = '',
  inputPrefix = '',
  inputPrefixClassName = '',
  inputWrapperClassName = '',
  inputClassName = '',
  inputPostfix = '',
  inputPostfixClassName = '',
  ...inputProps
}) {
  return (
    <div className={classNames(styles.section, wrapperClassName)}>
      {inputPrefix && (
        <div className={classNames(styles.inputPrefix, inputPrefixClassName)}>
          {inputPrefix}
        </div>
      )}
      <div className={classNames(styles.inputDiv, inputWrapperClassName)}>
        <Input
          type="text"
          className={classNames(styles.input, inputClassName)}
          classes={{wrapper: styles.commonInputWrapper, title: 'tm-para'}}
          {...inputProps}
        />
      </div>
      {inputPostfix && (
        <div className={classNames(styles.inputPostfix, inputPostfixClassName)}>
          {inputPostfix}
        </div>
      )}
    </div>
  )
}

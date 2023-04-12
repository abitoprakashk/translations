import React from 'react'
import classNames from 'classnames'
import styles from './TextArea.module.css'

export default function TextArea({
  label = '',
  cols = '10',
  rows = '4',
  placeholder = '',
  wrapperClassName = '',
  textAreaClassName = '',
  labelClassName = '',
  value = '',
  fieldName = '',
  onChange = () => {},
}) {
  return (
    <div className={classNames(styles.textAreaDiv, wrapperClassName)}>
      <label className={classNames(styles.label, labelClassName)}>
        {label}
      </label>
      <textarea
        className={classNames(styles.textArea, textAreaClassName)}
        cols={cols}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) =>
          onChange({
            fieldName,
            value: String(e.target.value),
            event: e,
          })
        }
      >
        {value}
      </textarea>
    </div>
  )
}

import React from 'react'
import styles from './SearchBar.module.css'
import classNames from 'classnames'
import {Icon, Input} from '@teachmint/common'

export default function SearchBar({
  wrapperClassName = '',
  iconClassName = '',
  onChange = () => {},
  placeholder = '',
  inputValue = '',
}) {
  return (
    <div className={classNames(styles.searchInputDiv, wrapperClassName)}>
      <Icon
        color="secondary"
        name={'search'}
        size="xs"
        type="outlined"
        className={iconClassName}
      />
      <Input
        type="text"
        fieldName="searchField"
        value={inputValue}
        onChange={(obj) => onChange(obj.value)}
        placeholder={placeholder}
        className={classNames(styles.searchInput, 'tm-para-14')}
        classes={{wrapper: styles.inputWrapper, input: styles.input}}
      />
      {/* <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          onChange={onChange}
        /> */}
    </div>
  )
}

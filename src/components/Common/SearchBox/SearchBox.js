import React from 'react'
import {Icon} from '@teachmint/common'
import styles from './SearchBox.module.css'
import classNames from 'classnames'

export default function SearchBox({
  value,
  placeholder,
  handleSearchFilter,
  ...inputProps
}) {
  return (
    <div
      className={classNames(
        'flex py-2 px-4 items-center rounded-full',
        styles.searchBox
      )}
    >
      <Icon color="secondary" name="search" size="xs" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        className={classNames(
          'tm-w-full tm-para tm-para-14 outline-none py-1',
          styles.input
        )}
        onInput={(e) => handleSearchFilter(e.target.value.trimLeft())}
        {...inputProps}
      />

      {value && (
        <img
          src="https://storage.googleapis.com/tm-assets/icons/secondary/cross-bg-secondary.svg"
          className="w-4 h-4 mr-1 cursor-pointer"
          alt="Search"
          onClick={() => handleSearchFilter('')}
        />
      )}
    </div>
  )
}

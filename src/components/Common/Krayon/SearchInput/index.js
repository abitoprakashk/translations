import React from 'react'
import {Icon, Input, ICON_CONSTANTS} from '@teachmint/krayon'
import styles from './styles.module.css'

const SearchInput = ({value, onChange, placeholder, classes = {}, ...rest}) => {
  return (
    <Input
      value={value}
      placeholder={placeholder}
      prefix={
        <Icon
          name="search"
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={ICON_CONSTANTS.TYPES.SECONDARY}
        />
      }
      classes={{wrapper: styles.search, ...classes}}
      onChange={onChange}
      {...rest}
    />
  )
}

export default SearchInput

import {Icon, ICON_CONSTANTS, Input} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './Search.module.css'
function Search({onChange, value, placeholder, onCrossClick = () => {}}) {
  const {t} = useTranslation()
  return (
    <Input
      classes={{wrapper: styles.inputWrapper, input: styles.input}}
      fieldName="search"
      onChange={({value}) => {
        onChange(value)
      }}
      value={value}
      placeholder={placeholder || t('searchbyNameorEmail')}
      type="text"
      prefix={
        <Icon
          name={'search'}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          className={styles.searchIcon}
          type={ICON_CONSTANTS.TYPES.SECONDARY}
        />
      }
      suffix={
        value ? (
          <div
            className={styles.pointer}
            onClick={() => {
              onChange('')
              onCrossClick()
            }}
          >
            <Icon
              name={'close'}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              className={styles.searchIcon}
              type={ICON_CONSTANTS.TYPES.SECONDARY}
            />
          </div>
        ) : null
      }
    />
  )
}

export default Search

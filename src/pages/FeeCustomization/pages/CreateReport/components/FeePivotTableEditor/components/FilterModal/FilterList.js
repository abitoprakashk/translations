import {Icon, ICON_CONSTANTS, Para} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './FilterModal.module.css'

function FilterList({data, setData}) {
  const {t} = useTranslation()

  const handleChange = (selectedItem) => {
    setData(
      Object.keys(data).reduce((obj, key) => {
        obj[key] = {
          ...data[key],
          isSelected: data[key].value === selectedItem.value,
        }
        return obj
      }, {})
    )
  }

  return (
    <div className={styles.listWrapper}>
      {Object.values(data).map((item, i) => (
        <div
          onClick={() => {
            handleChange(item)
          }}
          className={classNames(styles.list, {
            [styles.highlight]: item.isSelected,
          })}
          key={i}
        >
          <Para className={styles.sentenceCase}>{t(item.titleKey)}</Para>
          <Icon
            type={ICON_CONSTANTS.TYPES.SECONDARY}
            name="arrowForwardIos"
            size={ICON_CONSTANTS.SIZES.XXXX_SMALL}
          />
        </div>
      ))}
    </div>
  )
}

export default FilterList

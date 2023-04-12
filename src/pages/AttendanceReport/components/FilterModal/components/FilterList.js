import React from 'react'
import {useTranslation} from 'react-i18next'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import styles from '../FilterModal.module.css'
import produce from 'immer'
import useIsMobile from '../../../hooks/useIsMobile'

function FilterList({filterList, setfilterList}) {
  const {t} = useTranslation()
  const isMobile = useIsMobile()
  const handleFilterSelection = (key) => {
    setfilterList(
      produce(filterList, (draft) => {
        Object.keys(draft)?.map((_key) => {
          draft[_key].isSelected = false
        })
        draft[key].isSelected = true
        return draft
      })
    )
  }
  return (
    <div className={styles.filterListWrapper}>
      {Object.keys(filterList).map((key) => (
        <div
          className={classNames(styles.listWrapper, {
            [styles.highlight]: filterList[key].isSelected,
          })}
          onClick={() => handleFilterSelection(key)}
          key={filterList[key].titleLabel}
        >
          <span>
            {isMobile
              ? t(filterList[key].mWebTitleLabel)
              : t(filterList[key].titleLabel)}
          </span>
          {isMobile ? null : (
            <span>
              <Icon
                type={
                  filterList[key].isSelected
                    ? ICON_CONSTANTS.TYPES.PRIMARY
                    : ICON_CONSTANTS.TYPES.BASIC
                }
                name="forwardArrow"
                size={ICON_CONSTANTS.SIZES.X_SMALL}
                version="outlined"
              />
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default FilterList

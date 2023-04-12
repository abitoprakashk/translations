import React from 'react'
import classNames from 'classnames'
import {
  FEE_WISE_DATE_FILTER,
  SELECT_ALL_OPTION,
  ICON_SIZES,
} from '../../../../../pages/fee/fees.constants'
import styles from '../../FeeReports.module.css'
import {Icon} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'

const GetChips = ({
  filt,
  filterValues,
  viewMoreExpanded,
  setFilterValues,
  setChipClosed,
  chipClosed,
  toggleViewMore,
}) => {
  const {t} = useTranslation()
  const clearCrossedFilter = (ftype, chipId) => {
    let filtrValue = {...filterValues}
    let fTypeData = {...filtrValue[ftype]}
    let newOptions = [...fTypeData.options]
    newOptions = newOptions.filter((opt) => opt.id !== chipId)
    let newSelectedOpt = [...fTypeData.param1]
    newSelectedOpt = newSelectedOpt.filter(
      (opt) => opt !== chipId && opt !== SELECT_ALL_OPTION.value
    )
    fTypeData.options = newOptions
    fTypeData.param1 = newSelectedOpt
    filtrValue[ftype] = fTypeData
    setFilterValues(filtrValue)
    setChipClosed(!chipClosed)
  }

  let chipsList = []
  if (filterValues[filt.value]) {
    chipsList = [...filterValues[filt.value].options]
  }
  let selectAllIdx = chipsList.findIndex(
    (chip) => chip.id === SELECT_ALL_OPTION.value
  )
  if (selectAllIdx !== -1) chipsList.splice(selectAllIdx, 1)
  let remainingList = []
  if (chipsList.length > 2) {
    remainingList = [...chipsList]
    remainingList.shift()
    remainingList.shift()
    chipsList = chipsList.slice(0, 2)
  }
  return (
    <>
      {chipsList.length !== 0 &&
        chipsList.map((filtVal) => (
          <div
            key={filtVal.id}
            className={classNames(styles.chipsBox, styles.floatLeft)}
          >
            <span className={styles.marginRight8}>{filtVal.label}</span>
            {chipsList.length !== 1 && (
              <div
                onClick={() => clearCrossedFilter(filt.value, filtVal.id)}
                className={styles.chipsCross}
              >
                <Icon
                  name="close"
                  type="secondary"
                  size={ICON_SIZES.SIZES.XXX_SMALL}
                  className="cursor-pointer"
                ></Icon>
              </div>
            )}
          </div>
        ))}
      {!viewMoreExpanded[filt.value] ? (
        <span
          onClick={() => toggleViewMore(filt.value)}
          className={classNames(styles.chipsRemaining)}
        >
          {remainingList.length !== 0 ? `+ ${remainingList.length} more` : ''}
        </span>
      ) : (
        <>
          {remainingList.map((filtVal) => (
            <div
              key={filtVal.id}
              className={classNames(styles.chipsBox, styles.floatLeft)}
            >
              <span className={styles.marginRight8}>{filtVal.label}</span>
              <div
                onClick={() => clearCrossedFilter(filt.value, filtVal.id)}
                className={styles.chipsCross}
              >
                <Icon
                  name="close"
                  type="secondary"
                  size={ICON_SIZES.SIZES.XXX_SMALL}
                  className={styles.cursorPointer}
                ></Icon>
              </div>
            </div>
          ))}
          <div
            onClick={() => toggleViewMore(filt.value)}
            className={classNames(styles.chipsRemaining, styles.floatLeft)}
          >
            {t('viewLess')}
          </div>
        </>
      )}
    </>
  )
}

export const GetDateChipList = (slectedTimePeriod, ranges) => {
  let chipValue = []
  FEE_WISE_DATE_FILTER.forEach((filtr) => {
    if (filtr.value === slectedTimePeriod) {
      let obj = {}
      obj.id = filtr.value
      if (
        filtr.label === 'Custom date range' ||
        filtr.label === 'Custom Date'
      ) {
        let strtDate = ranges.startDate?.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        let endDate = ranges.endDate?.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        obj.label = `${strtDate} - ${endDate}`
      } else {
        obj.label = filtr.label
      }
      chipValue.push(obj)
    }
  })
  return chipValue
}

export default GetChips

import React, {useState} from 'react'
import {DateTime} from 'luxon'
import {
  ButtonDropdown,
  BUTTON_CONSTANTS,
  DateRangePicker,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import styles from './DateDropdownFilter.module.css'
import {dateDurationFilter, dateDurationKeys} from '../../../utils/constants'

export default function DateDropdownFilter({handleChange}) {
  const [showDateRangePicker, setShowDateRangePicker] = useState(false)
  const [dropdownText, setDropdownText] = useState(
    dateDurationFilter[dateDurationKeys.LASTMONTH].label
  )

  const getTimestamps = (selectedValue) => {
    let startDate = DateTime.now()
    let endDate = DateTime.now()
    switch (selectedValue) {
      case dateDurationKeys.LASTWEEK:
        startDate = startDate.minus({day: 6})
        break
      case dateDurationKeys.LASTMONTH:
        startDate = startDate.minus({months: 1})
        break
    }
    return {
      startDate: startDate.toSeconds(),
      endDate: endDate.toSeconds(),
    }
  }

  const handleClick = (event, selectedValue) => {
    event.stopPropagation()
    if (selectedValue === dateDurationKeys.CUSTOMDATERANGE) {
      setShowDateRangePicker(!showDateRangePicker)
    } else {
      setDropdownText(dateDurationFilter[selectedValue].label)
      handleChange(getTimestamps(selectedValue))
    }
  }

  const handleDoneChange = (e) => {
    const startDate = DateTime.fromJSDate(e.startDate).startOf('day')
    const endDate = DateTime.fromJSDate(e.endDate).endOf('day')
    setShowDateRangePicker(!showDateRangePicker)
    handleChange({
      startDate: startDate.toSeconds(),
      endDate: endDate.toSeconds(),
    })
    setDropdownText(
      `${startDate.toFormat('d LLL')} - ${endDate.toFormat('d LLL')}`
    )
  }

  return (
    <div className={styles.dropdownWrapper}>
      {showDateRangePicker && (
        <div
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <DateRangePicker onDone={(e) => handleDoneChange(e)} />
        </div>
      )}
      <ButtonDropdown
        buttonObj={{
          prefixIcon: (
            <Icon
              name="calendar"
              type={ICON_CONSTANTS.TYPES.PRIMARY}
              version={ICON_CONSTANTS.VERSION.OUTLINED}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              className={styles.iconStyle}
            />
          ),
          suffixIcon: 'downArrow',
          children: dropdownText,
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          classes: {button: styles.wrapper},
        }}
        handleOptionClick={({event, value}) => {
          handleClick(event, value)
        }}
        options={Object.values(dateDurationFilter).map((option) => ({
          ...option,
          label: (
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
            >
              {option.label}
            </Para>
          ),
        }))}
        classes={{
          dropdownContainer: styles.dropdownContainer,
        }}
      />
    </div>
  )
}

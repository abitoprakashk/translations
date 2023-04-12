import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {DateRangePicker, Input} from '@teachmint/common'
import styles from './DateRangePickerWrapper.module.css'

const DateRangePickerWrapper = ({
  setIsFormValid,
  fieldFormInputsValue,
  setFieldFormInputsValue,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const {t} = useTranslation()
  // Date range functions start
  const dateChekboxOnChangeHandler = (dateChange) => {
    const checkBoxChecked = dateChange.checked
    if (checkBoxChecked) {
      setIsFormValid(false)
    } else {
      if (fieldFormInputsValue.fieldName !== '') {
        setIsFormValid(true)
      } else {
        setIsFormValid(false)
      }
      setStartDate(null)
      setEndDate(null)
      setFieldFormInputsValue({
        ...fieldFormInputsValue,
        dateRange: [],
      })
    }
    setFieldFormInputsValue({
      ...fieldFormInputsValue,
      isDateChecked: checkBoxChecked,
    })
  }
  const dateRangeStartAndEndDateChangeHandler = (dateType, date) => {
    if (dateType === 'start') setStartDate(date)
    if (dateType === 'end') setEndDate(date)
  }
  useEffect(() => {
    let getStartDateTimeStampValue = null
    let geEndDateTimeStampValue = null
    if (startDate) {
      getStartDateTimeStampValue = startDate.getTime() / 1000
    }
    if (endDate) {
      geEndDateTimeStampValue = endDate.getTime() / 1000
    }
    if (getStartDateTimeStampValue && geEndDateTimeStampValue) {
      setFieldFormInputsValue({
        ...fieldFormInputsValue,
        dateRange: [getStartDateTimeStampValue, geEndDateTimeStampValue],
      })
      if (fieldFormInputsValue.fieldName !== '') {
        setIsFormValid(true)
      } else {
        setIsFormValid(false)
      }
    }
  }, [startDate, endDate])
  // Date range functions end

  return (
    <div className={styles.dateRangePickerBlock}>
      <Input
        id="isDateChecked"
        type="checkbox"
        labelTxt={t('dateRange')}
        fieldName="isDateChecked"
        isChecked={fieldFormInputsValue?.isDateChecked}
        onChange={dateChekboxOnChangeHandler}
      />
      {fieldFormInputsValue?.isDateChecked && (
        <div className={styles.dateRangeBlock}>
          <div className={styles.dateRangeLabel}>
            <span
              className={classNames(styles.labelText, styles.startLimitTitle)}
            >
              {t('startLimit')}
            </span>
            <span
              className={classNames(styles.labelText, styles.endLimitTitle)}
            >
              {t('endLimit')}
            </span>
          </div>
          <div className={styles.dateRangeInputsDiv}>
            <DateRangePicker
              validateDateRangeOrder
              startDatePlaceholder={'DD Mon YYYY'}
              endDatePlaceholder={'DD Mon YYYY'}
              startDate={startDate}
              endDate={endDate}
              onChange={dateRangeStartAndEndDateChangeHandler}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePickerWrapper

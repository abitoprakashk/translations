import React from 'react'
import {DateRangePicker} from '@teachmint/common'
import DateField from '../DateField/DateField'
import DropdownField from '../DropdownField/DropdownField'
import MultipleSelectionDropdown from '../MultipleSelectionDropdown/MultipleSelectionDropdown'
import PhoneNumberField from '../PhoneNumberField/PhoneNumberField'
import RadioInput from '../RadioInput/RadioInput'
import SearchDropdown from '../SearchDropdown/SearchDropdown'
import TextareaField from '../TextareaField/TextareaField'
import TextInputField from '../TextInputField/TextInputField'
import CountryField from '../CountryField/CountryField'
import CurrencyField from '../CurrencyField/CurrencyField'
import {t} from 'i18next'

export default function InputField({
  fieldType,
  title,
  placeholder,
  value,
  handleChange,
  fieldName,
  errorText = null,
  errorTextStyle = false,
  dropdownItems,
  countryCodeItem,
  inputLimit = null,
  eventName = null,
  disabled = false,
  editable = false,
  options = {},
  onClick,
  startDate = null,
  endDate = null,
  startDatePlaceholder = t('startDate'),
  endDatePlaceholder = t('endDate'),
  dateMax,
  style,
  dateMin,
  maxLength,
  eventKey,
  eventData,
  searchBar,
}) {
  const inputFields = {
    text: (
      <TextInputField
        placeholder={placeholder}
        value={value}
        handleChange={handleChange}
        fieldName={fieldName}
        eventName={eventName}
        eventData={eventData}
        disabled={disabled}
        maxLength={maxLength}
      />
    ),
    phone: (
      <PhoneNumberField
        value={value}
        handleChange={handleChange}
        fieldName={fieldName}
        countryCodeItem={countryCodeItem}
        placeholder={placeholder}
        disabled={disabled}
        editable={editable}
      />
    ),
    dropdown: (
      <DropdownField
        value={value}
        handleChange={handleChange}
        fieldName={fieldName}
        dropdownItems={dropdownItems}
        onClick={onClick}
        disabled={disabled}
      />
    ),
    date: (
      <DateField
        placeholder={placeholder}
        value={value}
        handleChange={handleChange}
        fieldName={fieldName}
        disabled={disabled}
        max={dateMax}
        min={dateMin}
        eventName={eventName}
        eventKey={eventKey}
      />
    ),
    searchDropdown: (
      <SearchDropdown
        placeholder={placeholder}
        value={value}
        handleChange={handleChange}
        fieldName={fieldName}
        dropdownItems={dropdownItems}
      />
    ),
    textarea: (
      <TextareaField
        value={value}
        fieldName={fieldName}
        handleChange={handleChange}
        placeholder={placeholder}
      />
    ),
    radio: (
      <RadioInput
        value={value}
        fieldName={fieldName}
        handleChange={handleChange}
        dropdownItems={dropdownItems}
        options={options}
      />
    ),
    multipleSelectionDropdown: (
      <MultipleSelectionDropdown
        title={title}
        value={value}
        fieldName={fieldName}
        handleChange={handleChange}
      />
    ),
    dateRange: (
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        validateDateRangeOrder
        onChange={handleChange}
        startDatePlaceholder={startDatePlaceholder}
        endDatePlaceholder={endDatePlaceholder}
        fitContentWidth
      />
    ),
    countryName: (
      <CountryField
        onChange={handleChange}
        value={value}
        dropdownItems={dropdownItems}
        searchBar={searchBar}
      />
    ),
    currency: (
      <CurrencyField
        onChange={handleChange}
        value={value}
        dropdownItems={dropdownItems}
        searchBar={searchBar}
      />
    ),
  }

  return (
    <>
      {fieldType == 'dateRange' ? (
        <>
          {inputFields[fieldType]}
          <div
            className={`tm-para4 mt-1 h-4 ${
              errorTextStyle ? 'tm-color-green' : 'tm-color-red'
            }`}
          >
            {errorText}
          </div>
        </>
      ) : (
        <div style={style}>
          <div className="flex mb-1 justify-between">
            <div className="tm-hdg-14 tm-color-text-secondary">{title}</div>
            <div className="tm-para2">{inputLimit || ''}</div>
          </div>
          {inputFields[fieldType]}
          <div
            className={`tm-para4 mt-1 h-4 ${
              errorTextStyle ? 'tm-color-green' : 'tm-color-red'
            }`}
          >
            {errorText}
          </div>
        </div>
      )}
    </>
  )
}

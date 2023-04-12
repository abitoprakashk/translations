import {DateTime} from 'luxon'
import {t} from 'i18next'
import classNames from 'classnames'
import {Datepicker, Input, INPUT_TYPES, RequiredSymbol} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {IMIS_FIELD_TYPES, staticImisFields} from '../../../utils/constants'
import {checkRegex} from '../../../../../utils/Validations'
import {useGetCurrentCoutryCode} from '../../../redux/admissionManagement.selectors'
import styles from './FormField.module.css'

export default function FormField({
  field,
  isRequired,
  isDisabled,
  formData,
  setFormData,
  formErrors,
  standardData,
}) {
  const defaultCountryCode = useGetCurrentCoutryCode()

  const handleChange = (value) => {
    if (
      ![IMIS_FIELD_TYPES.EMAIL, IMIS_FIELD_TYPES.PHONE_NUMBER].includes(
        field.field_type
      ) &&
      field.pattern &&
      !checkRegex(new RegExp(field.pattern), value)
    ) {
      return
    }
    setFormData({...formData, [field.key_id]: value})
  }

  const handleDateChange = (jsDate) => {
    handleChange(DateTime.fromJSDate(jsDate).toSeconds())
  }

  const handlePhoneNumberChange = (value) => {
    handleChange(`${getCountryCode()}-${value}`)
  }

  const getStandards = () => {
    return Object.values(standardData).map((standard) => ({
      label: standard.name,
      value: standard.id,
    }))
  }

  const getSections = () => {
    if (formData?.standard) {
      return standardData[formData.standard].sections.map((section) => ({
        label: section.name,
        value: section.id,
      }))
    }
    return []
  }

  const getDropdownFieldOptions = () => {
    if (field.key_id === staticImisFields.STANDARD) {
      return getStandards()
    } else if (field.key_id === staticImisFields.SECTION) {
      return getSections()
    } else {
      return field.permissible_values.map((option) => ({
        label: (
          <div className={styles.dropdownTextTransform}>
            {option.replace('_', ' ').toLowerCase()}
          </div>
        ),
        value: option,
      }))
    }
  }

  const getInputfield = (type, otherProps = {}) => {
    return (
      <Input
        type={type}
        title={field.label}
        fieldName={field.key_id}
        value={
          type !== INPUT_TYPES.PHONE_NUMBER
            ? formData[field.key_id]
            : formData[field.key_id]?.replace(/\d*-/, '')
        }
        showMsg={field.key_id in formErrors}
        infoMsg={formErrors[field.key_id]}
        infoType={field.key_id in formErrors ? 'error' : ''}
        onChange={(e) =>
          type !== INPUT_TYPES.PHONE_NUMBER
            ? handleChange(e.value)
            : handlePhoneNumberChange(e.value)
        }
        isRequired={isRequired}
        isDisabled={isDisabled}
        {...otherProps}
      />
    )
  }

  const getCountryCode = () => {
    if (formData[field.key_id]) {
      return formData[field.key_id].includes('-')
        ? formData[field.key_id]?.replace(/-\d*/, '')
        : defaultCountryCode
    }
    return defaultCountryCode
  }

  const getDatePickerRange = () => {
    let dateRange = {}
    if (field.date_range.length) {
      dateRange = {
        minDate: DateTime.fromSeconds(field.date_range[0]).toJSDate(),
        maxDate: DateTime.fromSeconds(field.date_range[1]).toJSDate(),
      }
    } else if (field.key_id === staticImisFields.DATE_OF_BIRTH) {
      dateRange = {
        maxDate: DateTime.now().toJSDate(),
      }
    }
    return dateRange
  }

  const handleChangeCountryCode = (code) => {
    let countryCode = `${code}-`
    if (formData[field.key_id]) {
      countryCode = formData[field.key_id].includes('-')
        ? formData[field.key_id].replace(/\d*-/, `${code}-`)
        : `${code}-${formData[field.key_id]}`
    }
    handleChange(countryCode)
  }

  const renderField = (fieldType) => {
    switch (fieldType) {
      case IMIS_FIELD_TYPES.EMAIL:
        return getInputfield(INPUT_TYPES.EMAIL, {
          placeholder: t('confirmAdmissionInputFieldPlaceholderPrefix', {
            fieldLabel: field.label,
          }),
        })
      case IMIS_FIELD_TYPES.PHONE_NUMBER:
        return getInputfield(INPUT_TYPES.PHONE_NUMBER, {
          placeholder: t('confirmAdmissionInputFieldPlaceholderPrefix', {
            fieldLabel: field.label,
          }),
          classes: {phoneNumberField: styles.phoneNumberField},
          countryCodeObj: {
            countryCode: getCountryCode(),
            onCountryChange: handleChangeCountryCode,
            isDisabled: false,
          },
        })
      case IMIS_FIELD_TYPES.DROPDOWN:
        return getInputfield(INPUT_TYPES.DROPDOWN, {
          placeholder: t('confirmAdmissionDropdownFieldPlaceholderPrefix', {
            fieldLabel: field.label,
          }),
          options: getDropdownFieldOptions(),
          classes: {
            dropdownClass: styles.dropdownField,
            optionsClass: classNames(styles.dropdown, styles.zIndex),
            optionClass: styles.dropdownOption,
            dropdownOptions: 'show-scrollbar show-scrollbar-small',
          },
        })
      case IMIS_FIELD_TYPES.DATE:
        return (
          <div>
            <div className={styles.datepickerFieldLabel}>
              <div className={styles.datepickerLabel}>{field.label}</div>
              {isRequired && <RequiredSymbol />}
            </div>
            <Datepicker
              closeOnChange={true}
              isDisabled={isDisabled}
              onChange={handleDateChange}
              {...getDatePickerRange()}
              classes={{
                input: styles.datepickerInput,
                wrapper: styles.calendarWrapper,
                calendarWrapper: styles.calendarZindex,
              }}
              inputProps={{
                showMsg: field.key_id in formErrors,
                infoMsg: formErrors[field.key_id],
                infoType: field.key_id in formErrors ? 'error' : '',
                placeholder: t(
                  'confirmAdmissionDatepickerFieldPlaceholderPrefix',
                  {fieldLabel: field.label}
                ),
              }}
              value={
                formData?.[field.key_id]
                  ? DateTime.fromSeconds(formData[field.key_id]).toJSDate()
                  : ''
              }
            />
          </div>
        )
      default:
        return getInputfield(INPUT_TYPES.TEXT, {
          placeholder: t('confirmAdmissionInputFieldPlaceholderPrefix', {
            fieldLabel: field.label,
          }),
        })
    }
  }

  return <ErrorBoundary>{renderField(field.field_type)}</ErrorBoundary>
}

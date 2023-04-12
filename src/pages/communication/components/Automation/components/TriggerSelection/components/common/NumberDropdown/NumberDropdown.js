import {Dropdown} from '@teachmint/krayon'
import classNames from 'classnames'
import {getNumberOptions} from '../../../../../utils'
import styles from './NumberDropdown.module.css'

export default function NumberDropdown({
  limit,
  options,
  selectionPlaceholder,
  selectedOptions,
  onChange,
  placeholder,
  fieldName,
  showOrdinalIndicator,
  className,
  isDisabled,
  prefixText,
  suffixText,
  includeZero,
}) {
  return (
    <div className={styles.wrapper}>
      {prefixText && <span>{prefixText}</span>}
      <Dropdown
        options={
          options || getNumberOptions(limit, showOrdinalIndicator, includeZero)
        }
        placeholder={placeholder}
        selectionPlaceholder={selectionPlaceholder}
        classes={{dropdownClass: classNames(styles.dropdown, className)}}
        selectedOptions={selectedOptions}
        onChange={onChange}
        fieldName={fieldName}
        isDisabled={isDisabled}
      />
      {suffixText && <span className={styles.suffixText}>{suffixText}</span>}
    </div>
  )
}

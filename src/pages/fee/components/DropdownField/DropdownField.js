import React from 'react'
import styles from './DropdownField.module.css'

export default function DropdownField({
  value,
  handleChange,
  fieldName,
  dropdownItems,
  disabled,
  onClick = (f) => f,
}) {
  return (
    <select
      className={`${styles.searchInput} tm-input-field tm-input-select tm-color-text-primary pr-8`}
      value={value}
      onChange={(e) => handleChange(fieldName, e.target.value)}
      onClick={onClick}
      disabled={disabled}
    >
      {dropdownItems.map((item) => (
        <option
          value={item.key}
          className="py-2"
          key={item.key}
          disabled={item.disabled ?? false}
          onClick={(e) => e.stopPropagation()}
        >
          {item.value}
        </option>
      ))}
    </select>
  )
}

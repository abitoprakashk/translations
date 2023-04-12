import React from 'react'

export default function TextareaField({
  rows = 5,
  maxLength = 100,
  value,
  handleChange,
  fieldName,
  placeholder,
  autoFocus = false,
}) {
  return (
    <textarea
      rows={rows}
      maxLength={maxLength}
      className="tm-input-field"
      onChange={(e) =>
        handleChange(fieldName, String(e.target.value).trimLeft())
      }
      placeholder={placeholder}
      value={value}
      autoFocus={autoFocus}
    />
  )
}

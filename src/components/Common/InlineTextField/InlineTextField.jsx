import React from 'react'

export default function InlineTextField({value, handleChange}) {
  return (
    <input
      type="text"
      className="tm-inline-input-field"
      value={value}
      onChange={(e) => handleChange(String(e.target.value).trimLeft())}
    />
  )
}

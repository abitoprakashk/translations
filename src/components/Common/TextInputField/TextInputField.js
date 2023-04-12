import React from 'react'
import {useSelector} from 'react-redux'

export default function TextInputField({
  placeholder,
  value,
  handleChange,
  fieldName,
  eventName,
  eventData = {},
  disabled = false,
  maxLength,
}) {
  const {eventManager} = useSelector((state) => state)

  return (
    <div>
      <input
        type="text"
        className="tm-input-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          handleChange(fieldName, String(e.target.value).trimLeft())
        }
        onBlur={() =>
          value?.length > 0 &&
          eventName &&
          eventManager.send_event(eventName, eventData)
        }
        disabled={disabled}
        maxLength={maxLength}
      />
    </div>
  )
}

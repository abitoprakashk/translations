import React, {useState} from 'react'
import {v4 as uuidv4} from 'uuid'
import classnames from 'classnames'

export default function RadioInput({
  value,
  fieldName,
  handleChange,
  dropdownItems,
  options,
  className = 'tm-para tm-para-14',
}) {
  const [randomId] = useState(uuidv4())
  return (
    <div
      className={`${options?.isVerticalRadio ? '' : 'flex'}`}
      id={`${fieldName}-${randomId}`}
    >
      {dropdownItems.map((item) => (
        <div
          key={item.key}
          className={`flex items-center item-div ${
            options?.isVerticalRadio ? 'mb-4' : 'mr-4'
          }`}
        >
          <input
            type="radio"
            id={`${item.key}-${randomId}`}
            name={`${fieldName}-${randomId}`}
            value={item.key}
            checked={value === item.key}
            onChange={() => handleChange(fieldName, item.key)}
          />
          <label
            htmlFor={`${item.key}-${randomId}`}
            className={classnames('ml-1', className)}
          >
            {item.value}
          </label>
        </div>
      ))}
    </div>
  )
}

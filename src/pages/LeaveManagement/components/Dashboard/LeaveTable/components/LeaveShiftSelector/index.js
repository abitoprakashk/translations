import classNames from 'classnames'
import React from 'react'

import styles from './styles.module.scss'

const LeaveShiftSelector = ({
  name,
  onChange,
  selected,
  options = [],
  className,
}) => {
  return (
    <>
      {options.map(
        ({value, label, disabled = false}) =>
          !disabled && (
            <React.Fragment key={value}>
              <input
                type="radio"
                name={name}
                value={value}
                id={`${name}_${value}`}
                hidden
                onChange={onChange}
                checked={value == selected}
                disabled={disabled}
              />
              <label
                className={classNames(styles.btn, className)}
                htmlFor={`${name}_${value}`}
              >
                {label}
              </label>
            </React.Fragment>
          )
      )}
    </>
  )
}

export default LeaveShiftSelector

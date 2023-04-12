import React from 'react'
import classNames from 'classnames'
import styles from './customSearchBox.module.css'

const CustomSearchBox = React.forwardRef(
  ({value, placeholder, handleChange, classes, forwardRef}) => {
    return (
      <input
        type="text"
        placeholder={placeholder}
        name="search"
        value={value}
        onChange={handleChange}
        className={classNames(styles.input, classes?.input)}
        ref={forwardRef}
      ></input>
    )
  }
)

CustomSearchBox.displayName = 'CustomSearchBox'

export default CustomSearchBox

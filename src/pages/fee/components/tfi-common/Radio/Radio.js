import {useState} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Radio.module.css'

export const Option = () => {}

function Radio({onChange, children, className, type}) {
  const optionsFromChildren = children.map((child) => ({
    label: child.props.children,
    value: child.props.value !== '' ? child.props.value : child.props.children,
    selected: child.props.selected,
  }))

  const [options, setOption] = useState(optionsFromChildren)
  const handleOptionClick = (option) => {
    if (onChange) {
      onChange(option.value)
    }
    const newOptions = [...options]
    newOptions.forEach((o) => {
      const newOption = o
      newOption.selected = newOption.value === option.value
    })
    setOption(newOptions)
  }
  if (!options) {
    return ''
  }
  return (
    <span className={classNames(styles.radioWrapper, className)}>
      {options.map((option) => (
        <span
          key={option.label}
          onClick={() => handleOptionClick(option)}
          className={classNames({
            [styles.option]: true,
            [styles.selected]: option.selected,
            [styles.heading]: type === 'heading',
          })}
        >
          {option.label}
        </span>
      ))}
    </span>
  )
}

Radio.propTypes = {
  onChange: PropTypes.func,
  children: PropTypes.element.isRequired,
}

// TODO fix CSS issue of extra 1px

export default Radio

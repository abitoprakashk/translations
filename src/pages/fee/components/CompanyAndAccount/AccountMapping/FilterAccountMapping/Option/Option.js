import {Icon, Para} from '@teachmint/krayon'
import React from 'react'
import styles from './Option.module.css'

export default function Option({
  isActive = false,
  item = {},
  handleFilterOptionClick = () => {},
}) {
  return (
    <div
      className={styles.section}
      onClick={() => handleFilterOptionClick(item.id)}
    >
      <div className={styles.dateAndIconSection}>
        <Para type={isActive ? 'primary' : 'basic'}>{item?.text}</Para>
        <Icon
          name="forwardArrow"
          size="xx_s"
          type={isActive ? 'primary' : 'basic'}
        />
      </div>
    </div>
  )
}

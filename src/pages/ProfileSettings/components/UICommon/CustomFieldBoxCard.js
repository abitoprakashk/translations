import React from 'react'
import styles from './CustomFieldBoxCard.module.css'

const CustomFieldBoxCard = (props) => {
  return (
    <div className={`${styles.customFieldCardInnerBlock} ${props.className}`}>
      {props.children}
    </div>
  )
}

export default CustomFieldBoxCard

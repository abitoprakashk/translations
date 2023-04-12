import classNames from 'classnames'
import React from 'react'
import styles from './CalloutCard.module.css'

export default function CalloutCard({
  heading = '',
  children = null,
  borderClassName = '',
  type = '',
}) {
  return (
    <div
      className={classNames(
        styles.section,
        borderClassName,
        type ? styles[type] : ''
      )}
    >
      <div className={styles.headingSection}>
        <span className={styles.headingtext}>{heading}</span>
      </div>
      {children}
    </div>
  )
}

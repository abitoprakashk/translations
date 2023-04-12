import {Para} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import styles from './CalloutCard.module.css'

export default function CalloutCard({
  borderClassName = '',
  text = '',
  subText = null,
  additionalInfo = null,
  additionalInfoClass = '',
  smallerText = false,
  subTextClass = '',
  contentWrapperClassName = '',
}) {
  return (
    <div className={styles.section}>
      <div className={classNames(styles.border, borderClassName)}></div>
      <div className={contentWrapperClassName}>
        <div className={smallerText ? styles.smallerText : styles.text}>
          {text}
        </div>
        <Para
          className={subTextClass}
          textSize={smallerText ? 'm' : 'l'}
          type="text-secondary"
        >
          {subText}
        </Para>
        {additionalInfo && (
          <Para
            className={additionalInfoClass}
            textSize={smallerText ? 'm' : 'l'}
            type="text-secondary"
          >
            {additionalInfo}
          </Para>
        )}
      </div>
    </div>
  )
}

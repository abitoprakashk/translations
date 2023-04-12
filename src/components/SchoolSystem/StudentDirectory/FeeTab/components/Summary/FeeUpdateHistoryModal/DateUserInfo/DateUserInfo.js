import React from 'react'
import styles from './DateUserInfo.module.css'
import {Icon, Para} from '@teachmint/krayon'
import {DateTime} from 'luxon'

export default function DateUserInfo({
  isActive = false,
  item = {},
  alterant_name = '-',
  handleRecordClick = () => {},
}) {
  return (
    <div className={styles.section} onClick={() => handleRecordClick(item.id)}>
      <div className={styles.dateAndIconSection}>
        <Para type={isActive ? 'primary' : 'basic'}>
          {item.history_update_timestamp
            ? DateTime.fromSeconds(item.history_update_timestamp).toFormat(
                `d LLL yyyy`
              )
            : ''}
        </Para>
        <Icon
          name="forwardArrow"
          size="xx_s"
          type={isActive ? 'primary' : 'basic'}
        />
      </div>
      <Para>By {alterant_name}</Para>
    </div>
  )
}

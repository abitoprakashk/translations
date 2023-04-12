import React from 'react'
import styles from './AttendanceCard.module.css'
import classNames from 'classnames'
import {formatCurrencyToCountry} from '../../../../../utils/Helpers'

export default function AttendanceCard(props) {
  return (
    <>
      <div className={styles.cardStructure}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.rightHeader}>
          <div className={classNames(props.className)}>
            {formatCurrencyToCountry(props.value)}
          </div>
          <div className={styles.subText}>{props.subText}</div>
        </div>
      </div>
    </>
  )
}

import React from 'react'
import styles from './StatsCard.module.css'
import {Card} from '@teachmint/common'
import classNames from 'classnames'

export default function StatsCard({
  title = '',
  subText = '',
  type = 'basic', // basic, success, error, secondary
}) {
  return (
    <Card className={styles.card}>
      <div className={classNames(styles.section, styles[type])}>
        <div className={styles.titleText}>{title}</div>
        <div className={styles.subText}>{subText}</div>
      </div>
    </Card>
  )
}

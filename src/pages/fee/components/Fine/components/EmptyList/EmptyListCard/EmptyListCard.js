import React from 'react'
import styles from './EmptyListCard.module.css'
import {Card} from '@teachmint/common'
import classNames from 'classnames'

export default function EmptyListCard({cardClassName}) {
  return (
    <Card className={classNames(styles.card, cardClassName)}>
      <div>
        <div className={styles.bigCircle}></div>
      </div>
      <div className={styles.emptyLineSection}>
        <div className={styles.emptyLineFirst}></div>
        <div className={styles.emptyLineSecond}></div>
      </div>
    </Card>
  )
}

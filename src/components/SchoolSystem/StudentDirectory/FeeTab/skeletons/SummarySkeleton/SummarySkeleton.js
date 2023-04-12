import React from 'react'
import styles from './SummarySkeleton.module.css'
import SkeletonBlock from '../../../../../Common/Skeleton/SkeletonBlock'
import SkeletonWrapper from '../../../../../Common/Skeleton/SkeletonWrapper'
import classNames from 'classnames'

export default function SummarySkeleton() {
  return (
    <div>
      <SkeletonWrapper className={styles.headingWrapper}>
        <SkeletonBlock className={styles.headingName} />
        <SkeletonBlock className={styles.subText} />
      </SkeletonWrapper>
      <SkeletonWrapper className={styles.cardWrapper}>
        <SkeletonBlock className={styles.card} />
        <SkeletonBlock className={styles.card} />
        <SkeletonBlock className={classNames(styles.card, styles.paidCard)} />
        <SkeletonBlock className={classNames(styles.card, styles.dueCard)} />
      </SkeletonWrapper>
    </div>
  )
}

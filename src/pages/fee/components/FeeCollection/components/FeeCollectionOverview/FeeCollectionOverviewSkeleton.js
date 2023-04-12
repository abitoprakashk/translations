import React from 'react'
import classNames from 'classnames'
import SkeletonWrapper from '../../../../../../components/Common/Skeleton/SkeletonWrapper'
import SkeletonBlock from '../../../../../../components/Common/Skeleton/SkeletonBlock'
import styles from './FeeCollectionOverviewSkeleton.module.css'

export default function FeeCollectionOverviewSkeleton() {
  return (
    <div>
      <SkeletonWrapper className={styles.cardWrapper}>
        <SkeletonBlock
          className={classNames(styles.card, styles.cardBgTotalApplied)}
        />
        <SkeletonBlock
          className={classNames(styles.card, styles.cardBgDiscount)}
        />
        <SkeletonBlock className={classNames(styles.card, styles.cardBgPaid)} />
        <SkeletonBlock className={classNames(styles.card, styles.cardBgDue)} />
      </SkeletonWrapper>
    </div>
  )
}

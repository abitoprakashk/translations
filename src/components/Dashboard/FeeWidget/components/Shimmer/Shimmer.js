import classNames from 'classnames'
import React from 'react'
import SkeletonBlock from '../../../../Common/Skeleton/SkeletonBlock'
import SkeletonWrapper from '../../../../Common/Skeleton/SkeletonWrapper'
import styles from './Shimmer.module.css'

function Shimmer() {
  return (
    <SkeletonWrapper className={styles.shimmerWrapper}>
      <SkeletonBlock className={classNames(styles.shimmer, styles.short)} />
      <SkeletonBlock className={classNames(styles.shimmer, styles.long)} />
    </SkeletonWrapper>
  )
}

export default Shimmer

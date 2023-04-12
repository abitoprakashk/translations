import React from 'react'
import styles from './ActivitySkeleton.module.css'
import SkeletonBlock from '../../../../../../components/Common/Skeleton/SkeletonBlock'
import SkeletonWrapper from '../../../../../../components/Common/Skeleton/SkeletonWrapper'

export default function ActivitySkeleton() {
  return (
    <div className={styles.historyCardWrapper}>
      {[...Array(2)].map((i) => (
        <SkeletonWrapper key={i} className={styles.historyCard}>
          <SkeletonBlock className={styles.avatar} />
          <SkeletonBlock className={styles.activityMessage} />
        </SkeletonWrapper>
      ))}
    </div>
  )
}

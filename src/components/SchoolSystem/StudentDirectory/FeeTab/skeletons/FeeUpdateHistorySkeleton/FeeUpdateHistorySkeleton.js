import React from 'react'
import styles from './FeeUpdateHistorySkeleton.module.css'
import SkeletonBlock from '../../../../../Common/Skeleton/SkeletonBlock'
import SkeletonWrapper from '../../../../../Common/Skeleton/SkeletonWrapper'
import TableSkeleton from '../TableSkeleton/TableSkeleton'

export default function FeeUpdateHistorySkeleton() {
  return (
    <div className={styles.section}>
      <SkeletonWrapper className={styles.userInfoWrapper}>
        {[...Array(5)].map((item) => (
          <SkeletonBlock key={item} className={styles.userInfoBlock} />
        ))}
      </SkeletonWrapper>
      <div className={styles.dataWrapper}>
        <SkeletonWrapper>
          <div className={styles.statsWrapper}>
            {[...Array(3)].map((item) => (
              <SkeletonBlock key={item} className={styles.statsBlock} />
            ))}
          </div>
          <div>
            <SkeletonBlock className={styles.updatedByBlock} />
          </div>
        </SkeletonWrapper>
        <TableSkeleton tableRowsCount={4} />
      </div>
    </div>
  )
}

import React from 'react'
import styles from './WalletTabSkeleton.module.css'
import SkeletonBlock from '../../../../../Common/Skeleton/SkeletonBlock'
import SkeletonWrapper from '../../../../../Common/Skeleton/SkeletonWrapper'
import TableSkeleton from '../TableSkeleton/TableSkeleton'

export default function WalletTabSkeleton() {
  return (
    <div>
      <SkeletonWrapper>
        <SkeletonBlock className={styles.headerBlock} />
      </SkeletonWrapper>
      <TableSkeleton tableRowsCount={7} />
    </div>
  )
}

import React from 'react'
import styles from './TableSkeleton.module.css'
import SkeletonBlock from '../../../../../Common/Skeleton/SkeletonBlock'
import SkeletonWrapper from '../../../../../Common/Skeleton/SkeletonWrapper'
import classNames from 'classnames'

export default function TableSkeleton({tableRowsCount = 5, classes = {}}) {
  return (
    <div>
      <SkeletonWrapper className={classNames(styles.section, classes.wrapper)}>
        <div className={styles.rowsWrapper}>
          <SkeletonBlock className={classNames(styles.headerBlock)} />
          {[...Array(tableRowsCount)].map((item, idx) => {
            return (
              <SkeletonBlock
                key={`${item}${idx}`}
                className={classNames(
                  styles.rowBlock,
                  `${
                    idx % 2 === 0 ? styles.rowBlockLight : styles.rowBlockDark
                  }`
                )}
              />
            )
          })}
        </div>
      </SkeletonWrapper>
    </div>
  )
}

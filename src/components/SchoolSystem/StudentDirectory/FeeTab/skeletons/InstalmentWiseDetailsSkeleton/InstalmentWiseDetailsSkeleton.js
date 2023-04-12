import React from 'react'
import styles from './InstalmentWiseDetailsSkeleton.module.css'
import SkeletonBlock from '../../../../../Common/Skeleton/SkeletonBlock'
import SkeletonWrapper from '../../../../../Common/Skeleton/SkeletonWrapper'
import classNames from 'classnames'

export default function InstalmentWiseDetailsSkeleton() {
  return (
    <div>
      <SkeletonWrapper>
        <div className={styles.headerSection}>
          <SkeletonBlock className={styles.heading} />
          <div className={styles.buttonSection}>
            <SkeletonBlock
              className={classNames(styles.button1, styles.button)}
            />
            <SkeletonBlock
              className={classNames(styles.button2, styles.button)}
            />
          </div>
        </div>
        <div>
          {[...Array(2)].map((item) => (
            <SkeletonBlock key={item} className={styles.instalmentInfo} />
          ))}
        </div>
      </SkeletonWrapper>
    </div>
  )
}

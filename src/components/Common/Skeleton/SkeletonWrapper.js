import React from 'react'
import styles from './Skeleton.module.css'
import classNames from 'classnames'

export default function SkeletonWrapper({className = '', children = null}) {
  return (
    <div className={classNames(styles.skeletonWrapper, className)}>
      {children}
    </div>
  )
}

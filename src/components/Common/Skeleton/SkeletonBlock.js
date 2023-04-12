import classNames from 'classnames'
import React from 'react'
import styles from './Skeleton.module.css'

export default function SkeletonBlock({className = ''}) {
  return <div className={classNames(styles.skeletonBlock, className)}></div>
}

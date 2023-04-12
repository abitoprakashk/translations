import React from 'react'
import styles from './WidgetShimmer.module.css'

const WidgetShimmer = ({shimmerCount = 1}) => {
  return (
    <>
      {[...Array(shimmerCount)].map((index) => (
        <div key={index} className={styles.widgetShimmerContainer}>
          <div className={styles.widgetShimmerTop}></div>
          <div className={styles.widgetShimmerBottom}></div>
        </div>
      ))}
    </>
  )
}

export default WidgetShimmer

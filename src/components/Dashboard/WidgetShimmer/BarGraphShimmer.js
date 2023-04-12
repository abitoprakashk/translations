import React from 'react'
import styles from './WidgetShimmer.module.css'

const BarGraphShimmer = ({tableColumnsCount = 7}) => {
  return (
    <div className={styles.widgetBarShimmerContainer}>
      {[...Array(tableColumnsCount)].map((index) => (
        <div key={index} className={styles.widgetBarShimmer}></div>
      ))}
    </div>
  )
}

export default BarGraphShimmer

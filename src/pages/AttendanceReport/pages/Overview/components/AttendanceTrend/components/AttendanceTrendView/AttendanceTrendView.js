import React from 'react'
import AttendanceTrendComponent from '../AttendanceTrendComponent/AttendanceTrendComponent'
import styles from './AttendanceTrendView.module.css'

function AttendanceTrendView({data}) {
  return (
    <div className={styles.wrapper}>
      {data.map((item, i) => (
        <AttendanceTrendComponent data={item} key={i} />
      ))}
    </div>
  )
}

export default AttendanceTrendView
